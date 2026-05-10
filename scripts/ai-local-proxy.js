#!/usr/bin/env node

const http = require("http");
const { execFile, spawn } = require("child_process");

const HOST = "127.0.0.1";
const PORT = Number(process.env.AI_LOCAL_PORT || 8787);
const MAX_BODY_BYTES = 320_000;
const COMMAND_TIMEOUT_MS = 180_000;
const HEALTH_TIMEOUT_MS = 5_000;

const allowedOrigins = new Set([
  "null",
  `http://${HOST}:${PORT}`,
  `http://localhost:${PORT}`,
]);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function writeCors(req, res) {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", isAllowedOrigin(origin) && origin ? origin : "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function sendJson(req, res, statusCode, payload) {
  writeCors(req, res);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendSseHead(req, res) {
  writeCors(req, res);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
}

function sendSse(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;

    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error("요청 본문이 너무 큽니다."));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON 요청만 지원합니다."));
      }
    });

    req.on("error", reject);
  });
}

function execCommand(command, args) {
  return new Promise((resolve) => {
    execFile(command, args, { timeout: HEALTH_TIMEOUT_MS }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        output: `${stdout || ""}${stderr || ""}`.trim(),
      });
    });
  });
}

async function getProviderStatus() {
  const [claudeVersion, claudeAuth, codexVersion, codexAuth] = await Promise.all([
    execCommand("claude", ["--version"]),
    execCommand("claude", ["auth", "status"]),
    execCommand("codex", ["--version"]),
    execCommand("codex", ["login", "status"]),
  ]);

  return {
    claude: {
      installed: claudeVersion.ok,
      loggedIn: claudeAuth.ok,
    },
    codex: {
      installed: codexVersion.ok,
      loggedIn: codexAuth.ok,
    },
  };
}

function buildPrompt(systemPrompt, estimateText) {
  return `${systemPrompt}

추가 지시:
- 도구 사용, 파일 읽기, 코드 수정은 하지 마세요.
- 아래 견적서 텍스트만 근거로 분석하세요.
- 결과 본문만 한국어로 출력하세요.

다음 인테리어 견적서를 분석해주세요:

${estimateText}`;
}

function providerCommand(provider) {
  if (provider === "claude") {
    return {
      command: "claude",
      args: [
        "-p",
        "--output-format",
        "stream-json",
        "--include-partial-messages",
        "--verbose",
        "--permission-mode",
        "dontAsk",
        "--tools",
        "",
      ],
    };
  }

  if (provider === "codex") {
    return {
      command: "codex",
      args: [
        "--ask-for-approval",
        "never",
        "exec",
        "--json",
        "--sandbox",
        "read-only",
        "--skip-git-repo-check",
        "-",
      ],
    };
  }

  throw new Error("지원하지 않는 로컬 AI 제공자입니다.");
}

function createJsonLineParser(onJson, onText) {
  let buffer = "";

  return {
    push(chunk) {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          onJson(JSON.parse(trimmed));
        } catch {
          onText(line + "\n");
        }
      }
    },
    flush() {
      const trimmed = buffer.trim();
      if (!trimmed) return;

      try {
        onJson(JSON.parse(trimmed));
      } catch {
        onText(buffer);
      }
      buffer = "";
    },
  };
}

function extractEventText(event, state) {
  if (typeof event === "string") return event;

  const directDelta =
    event.delta?.text ||
    event.delta?.content ||
    event.text_delta ||
    event.textDelta ||
    event.content_delta ||
    event.contentDelta;
  if (typeof directDelta === "string") return directDelta;

  if (typeof event.delta === "string") return event.delta;
  if (typeof event.content === "string" && /delta|message/i.test(event.type || "")) {
    return event.content;
  }

  const message = event.message || event.msg || event.item;
  if (typeof message?.text === "string" && message.text) {
    if (state.lastMessageText && message.text.trim() === state.lastMessageText.trim()) {
      return "";
    }
    state.lastMessageText = message.text;
    state.sentAnyText = true;
    return message.text;
  }

  const content = message?.content || event.content;
  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") return part;
        return part.text || part.content || "";
      })
      .join("");

    if (text) {
      const previous = state.lastMessageText || "";
      state.lastMessageText = text;
      state.sentAnyText = true;
      if (text.startsWith(previous)) return text.slice(previous.length);
      return previous ? `\n${text}` : text;
    }
  }

  const finalText =
    event.final_output ||
    event.finalOutput ||
    event.output_text ||
    event.outputText ||
    event.result ||
    event.response;
  if (typeof finalText === "string" && !state.sentFinalText) {
    state.sentFinalText = true;
    if (state.lastMessageText && finalText.trim() === state.lastMessageText.trim()) {
      return "";
    }
    return finalText;
  }

  return "";
}

async function handleAnalyze(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(req, res, 400, { error: error.message });
    return;
  }

  const provider = payload.provider || "claude";
  const estimateText = String(payload.estimateText || "").trim();
  const systemPrompt = String(payload.systemPrompt || "").trim();

  if (!estimateText) {
    sendJson(req, res, 400, { error: "분석할 견적서 내용이 없습니다." });
    return;
  }

  if (!systemPrompt) {
    sendJson(req, res, 400, { error: "분석 프롬프트가 없습니다." });
    return;
  }

  let cli;
  try {
    cli = providerCommand(provider);
  } catch (error) {
    sendJson(req, res, 400, { error: error.message });
    return;
  }

  sendSseHead(req, res);

  const child = spawn(cli.command, cli.args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["pipe", "pipe", "pipe"],
  });

  const state = {};
  let finished = false;
  const parser = createJsonLineParser(
    (event) => {
      const text = extractEventText(event, state);
      if (text) sendSse(res, { type: "text_delta", text });
    },
    (text) => {
      if (text) sendSse(res, { type: "text_delta", text });
    }
  );

  const timeout = setTimeout(() => {
    finished = true;
    child.kill("SIGTERM");
    sendSse(res, { type: "error", error: "분석 시간이 너무 오래 걸려 중단했습니다." });
    res.end();
  }, COMMAND_TIMEOUT_MS);

  req.on("aborted", () => {
    if (!finished) child.kill("SIGTERM");
  });

  res.on("close", () => {
    if (!finished) child.kill("SIGTERM");
  });

  child.stdout.on("data", (chunk) => {
    parser.push(chunk.toString("utf8"));
  });

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString("utf8");
  });

  child.stdin.on("error", () => {
    // The child can exit early on auth errors before stdin is fully written.
  });

  child.on("error", (error) => {
    finished = true;
    clearTimeout(timeout);
    sendSse(res, { type: "error", error: `${cli.command} 실행 실패: ${error.message}` });
    res.end();
  });

  child.on("close", (code) => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    parser.flush();

    if (code !== 0) {
      const detail = stderr.trim() || `${cli.command} 종료 코드 ${code}`;
      sendSse(res, { type: "error", error: detail });
    } else {
      sendSse(res, { type: "done" });
    }

    res.end();
  });

  child.stdin.end(buildPrompt(systemPrompt, estimateText));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    writeCors(req, res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (!isAllowedOrigin(req.headers.origin)) {
    sendJson(req, res, 403, { error: "로컬 앱에서만 호출할 수 있습니다." });
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(req, res, 200, {
      ok: true,
      providers: await getProviderStatus(),
    });
    return;
  }

  if (req.method === "POST" && req.url === "/analyze") {
    await handleAnalyze(req, res);
    return;
  }

  sendJson(req, res, 404, { error: "Not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`AI local proxy listening on http://${HOST}:${PORT}`);
  console.log("Use Claude/Codex after logging in locally: claude auth login or codex login");
});
