(function () {
  const STORAGE_KEY = "anthropic_api_key";
  let activeAnalysis = null;

  const DEMO_ESTIMATE = `시공 항목 내용 / 사용자재 수량 / 단위 단가 (단위: 원) 금액(단위: 원)

[ 철거 시공비 ] - 벽지 철거 전체 공간 - 벽면 기존 벽지 제거 및 철거 105 m² 4,000 420,000
[ 철거 시공비 ] - 몰딩/걸레받이 철거 전체공간 - 기존 천정 몰딩, 바닥 걸레받이 철거 72 EA 1,000 72,000
[ 철거 시공비 ] - 바닥재 철거 전체공간 - 기존 마루 33평 철거 및 샌딩 33 평 30,000 990,000
[ 철거 시공비 ] - 욕실 철거 거실욕실 - 떠붙임 기준(타일, 욕실기기, 천장재 등) 전체 철거 1 식 650,000 650,000
[ 철거 기타 ] - 폐기물 처리 비용 공사 중 발생하는 공사 폐기물 처리비용 (1t 기준, 총 3회) 3 식 350,000 1,050,000

[ 설비 시공비 ] - 확장 공사 거실 확장 - 철거, 목공, 난방 등 전체 공정 포함 기준 금액(행위허가 포함) 1 식 2,000,000 2,000,000
[ 설비 시공비 ] - 방수 공사 거실욕실 방수 - (1차 시멘트 액방방수) 1 식 150,000 150,000
[ 설비 시공비 ] - 방수 공사 거실욕실 방수 - (2차 도막방수) 1 식 300,000 300,000
[ 설비 시공비 ] - 시스템 에어컨 LG 단배관 4대(18평1대/6평1대/5평2대) 1 식 5,376,636 5,376,636

[ 창호 시공비 ] - 창호 ◆ 거실확장부(3890*2260) 26T유리 단열간봉+로이 LX뷰프레임 250S 기준 1 식 2,450,000 2,450,000
[ 창호 시공비 ] - 창호 ◆ 안방(3020*1800) 24T유리 내창이중창 LX BS D235 기준 1 식 1,550,000 1,550,000
[ 창호 시공비 ] - 창호 ◆ 터닝도어 LX 터닝도어 2 식 550,000 1,100,000

[ 전기/조명 ] - 전기 배선 공사 33평형 조명/스위치/콘센트 설치를 위한 기초 전기 배선공사 3 품 300,000 900,000
[ 전기/조명 ] - 전기 자재 콘센트 르그랑 아펠라 화이트 (2구, 3구, LAN, TV선 등) 30 EA 4,600 138,000
[ 전기/조명 ] - 전기 자재 스위치 르그랑 아펠라 화이트 (2구, 3구, 4구) 9 EA 6,400 57,600

[ 목공 자재 ] - 도어 자재 방3개 욕실2개 영림 ABS 민자도어 자재 (총 5개) 5 EA 120,000 600,000
[ 목공 자재 ] - 중문 자재 현관 180도 스윙 중문 (제품 선택필요) 1 EA 1,150,000 1,150,000
[ 목공 자재 ] - 천장 목공 자재 거실 공간 - 기존 등박스 자리 천장 평탄화 기준 마감 공사 자재 1 식 250,000 250,000
[ 목공 인건비 ] - 목공 인건비 기공 기준 7 품 420,000 2,940,000

[ 타일 자재 ] - 타일 자재비 거실욕실 - 바닥타일 600X600 포세린 타일 6 BOX 30,000 180,000
[ 타일 자재 ] - 타일 자재비 거실욕실 - 벽타일 600X600 포세린 타일 9 BOX 30,000 270,000
[ 타일 자재 ] - 타일 자재비 안방욕실 - 벽타일 300X600 자기질 타일 8 BOX 20,000 160,000
[ 타일 인건비 ] - 인건비 타일 작업 후 타일 매지 작업 인건비 1 품 200,000 200,000

[ 욕실 ] - 도기 ◆ American Standard WAVE S 2PC (림리스) 투피스 양변기 1 EA 274,545 274,545
[ 욕실 ] - 세면대 ◆ American Standard PLAT 플랫 반다리 일체형 세면기 1 EA 228,181 228,181
[ 욕실 설비 ] - 환풍기 ◆ 힘펠 휴젠(화이트) / 플렉스 C2-100LF 1 EA 300,000 300,000
[ 욕실 가구 ] - 상부장 ◆ 히든바스 1200 플랩장 / 라운드장 / 원형거울 2 EA 261,181 522,362

[ 필름 ] - 도어/문틀SET 필름시공 방3개 욕실2개 기존 도어/문틀 SET 필름 (총 5개) 25 m 13,000 325,000
[ 도장 시공비 ] - 탄성코트 시공 안방 발코니 세라믹코트 시공 (기본1개소 기준 시공비) 1 식 150,000 150,000
[ 마루/장판 시공비 ] - 강마루 ◆ 동화 진 그란데 이모션 블랑 (Tx325x805) 30 평 90,300 2,709,000
[ 도배 ] - 벽지 ◆ LX지인 베스트 82559-01 (106cmx15.5m) 20 롤 34,545 690,900
[ 가구 시공비 ] - 싱크대 총 4.5m 일자형 상하부장, 도어-PET 무광화이트 E0 4.5 m 540,000 2,430,000
[ 가구 시공비 ] - 상판 LX 스노우라인 (주문제작) 4.5 m 310,000 1,395,000
[ 가구 집기 시공비 ] - 싱크볼 백조 사각 싱크볼 SQSR780 1 EA 272,000 272,000
[ 가구 집기 시공비 ] - 싱크수전 엘라라 주방수전 W형 K4612W 1 EA 170,000 170,000
[ 가구 가전 시공비 ] - 후드 하츠 하이드후드 IB60S 1 EA 80,000 80,000

[ 마감 ] - 기본 마감작업 실리콘 마감 시공비 1 식 350,000 350,000
[ 입주 청소 ] - 준공청소 + 입주청소(샷시, 바닥, 벽체, 가구 등) 33 평 19,000 627,000
[ 마감 ] - 월패드/도어락 시공 삼성 푸쉬 일반형 도어락 1 식 350,000 350,000
[ 공과잡비 ] - 행위허가 / 입주민 동의 대행 / 보양작업 1 식 1,362,840 1,362,840
[ 일반관리 ] - 산재/고용 보험, 현장감리, 기업이윤 1 식 7,495,620 7,495,620

총계: 84,700,000원`;

  const DEMO_RESPONSE = `📋 인테리어 견적서 분석 결과 (33평 기준)

전체 요약
- 이 견적은 33평 전면 리모델링 기준으로는 항목이 꽤 촘촘하지만, 묶음 항목이 많아 비교가 어렵습니다.
- 창호, 시스템에어컨, 목공, 가구는 브랜드와 모델명이 이미 보여서 확인 포인트가 뚜렷합니다.
- 철거와 공과잡비는 세부 범위가 더 분리돼야 협상력이 생깁니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 가격 이상 의심 항목

1. 목공
   위험도: 높음
   근거: 2,940,000원 + 문/중문/천장 목공 자재 포함
   왜 문제인지: 도어, 중문, 천장 목공이 한 묶음으로 들어가 있어 어디까지가 기본이고 어디부터 옵션인지 경계가 흐립니다.
   바로 물어볼 질문: "도어, 중문, 천장 평탄화, 가벽, 보강 공사를 각각 분리해서 다시 견적 주세요."

2. 창호
   위험도: 높음
   근거: LX뷰프레임 250S 2,450,000원 + LX BS D235 1,550,000원 + LX 터닝도어 1,100,000원
   왜 문제인지: 모델명은 나왔지만, 유리 사양과 양중/철거 비용이 분리돼 있지 않아 최종 금액이 더 오를 수 있습니다.
   바로 물어볼 질문: "26T, 24T, 로이유리, 단열간봉, 사다리차 비용이 각각 포함인지 다시 적어주세요."

3. 도배
   위험도: 중간
   근거: LX지인 베스트 82559-01, 20롤, 690,900원
   왜 문제인지: 제품명과 롤 수량은 좋지만 천장 포함 여부, 초배, 기존 벽지 제거가 따로 보이지 않습니다.
   바로 물어볼 질문: "천장 포함인지, 초배와 벽지 제거가 별도인지 분리해서 알려주세요."

━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ 범위 모호 항목

1. 철거
   위험도: 높음
   근거: 벽지 철거, 몰딩 철거, 바닥재 철거, 욕실 철거, 폐기물 처리
   왜 문제인지: 항목은 나뉘어 있지만, 실제로는 어느 공간까지 포함인지와 폐기물 횟수가 핵심입니다.
   바로 물어볼 질문: "확장부, 욕실, 도어, 가구 철거가 각각 어디까지 포함인지 다시 적어주세요."

2. 타일
   위험도: 중간
   근거: 600x600 포세린, 300x600 자기질
   왜 문제인지: 자재는 보이지만, 욕실별 면적과 시공 방식(덧방/떠붙임)이 분리돼 있지 않습니다.
   바로 물어볼 질문: "욕실 1, 욕실 2, 현관, 주방벽 면적을 따로 나눠서 보여주세요."

3. 설비/방수
   위험도: 중간
   근거: LG 시스템에어컨, 방수 1차/2차, 확장 공사
   왜 문제인지: 설비와 방수가 한 덩어리로 보여서, 배관 위치 변경과 에어컨 추가비가 어디까지인지 모호합니다.
   바로 물어볼 질문: "배관 길이, 실외기 앵글, 방수 보증 기간을 분리해서 적어주세요."

━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 누락 항목 확인

아래 항목이 견적서에 없거나 다른 항목에 묻혀 있을 수 있습니다:

· 엘리베이터 사용료 / 양중비
· 철거 후 바닥·벽면 미장 보수
· 욕실 천장재
· 시스템에어컨 실외기 앵글·배관 연장 추가비
· 창호 사다리차 비용
· 도배 천장 포함 여부
· 가구 후드/싱크볼/수전 모델 차액

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 협상 포인트

1. 목공 분리 발주
   예상 절감: 150~300만원
   포인트: 도어, 중문, 천장 평탄화, 보강을 분리하면 가격이 더 명확해집니다.

2. 창호 등급 조정
   예상 절감: 100~200만원
   포인트: 로이유리, 단열간봉, 터닝도어를 각각 분리하면 과금 포인트가 보입니다.

3. 가구 싱크대 분리
   예상 절감: 150~250만원
   포인트: 싱크대, 상판, 싱크볼, 수전, 후드를 따로 떼어보세요.

4. 시스템에어컨 포함 여부 재확인
   예상 절감: 30~80만원
   포인트: 실외기 앵글·추가 배관이 별도면 분리 청구가 가능합니다.

5. 마감 통합 항목 분리
   예상 절감: 20~80만원
   포인트: 줄눈, 도어락, 인터폰, 청소를 분리하면 불필요한 묶음 비용을 줄일 수 있습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 총평

총 84,700,000원은 33평 전면 리모델링 기준으로 높은 편입니다.
브랜드와 모델명은 꽤 잘 드러나지만, 항목별 포함/제외와 추가비 분리가 아직 부족합니다.
"일식" 또는 묶음 표기는 공정별 세부 내역서로 다시 받는 것이 우선입니다.`;

  function buildSystemPrompt() {
    const processLines = Object.entries(window.prices)
      .map(([name, data]) => {
        const grades = Object.entries(data.grades)
          .map(
            ([, g]) =>
              `    ${g.label}: ${Math.round(g.priceMin / 1000)}천~${Math.round(g.priceMax / 1000)}천원/평, 자재: ${g.material}, 포함: ${g.includes}, 제외: ${g.excludes}`
          )
          .join("\n");
        return `[${name}]\n${grades}`;
      })
      .join("\n\n");

    return `당신은 한국 인테리어 견적서 분석 전문가입니다. 소비자가 견적서에서 호갱 당하지 않도록 도와주세요.

아래는 공정별·등급별 기준 단가 데이터입니다 (평당 기준):

${processLines}

사용자의 견적서 텍스트를 분석해서 다음 4가지 항목을 찾아주세요:

⚠️ 가격 이상 — 기준 단가 대비 현저히 높거나, 등급 대비 가격이 맞지 않는 항목
❓ 범위 모호 — "일식", "전체 포함", "기타" 등 시공 범위가 불명확한 표현
❌ 누락 항목 — 전면 리모델링인데 견적서에 없는 공정 (폐기물 처리, 보양 등 포함)
💡 협상 포인트 — 등급을 낮추거나 분리 발주하면 아낄 수 있는 부분

응답 형식:
- 먼저 전체 요약 3줄 이내
- 그 다음 아래 4개 섹션을 순서대로 출력
- 각 섹션은 항목별 리스트로 작성
- 각 항목마다 반드시 아래 5개 요소 포함
  1. 항목명
  2. 위험도: 높음 / 중간 / 낮음
  3. 근거: 견적서 표현 또는 숫자
  4. 왜 문제인지: 한두 문장
  5. 바로 물어볼 질문 또는 수정 요청 문장
- 금액이 이상한 경우에는 기준 범위와의 차이를 숫자로 적어주세요
- 범위가 모호한 경우에는 무엇이 빠졌는지 정확히 적어주세요
- 누락 항목은 "왜 빠졌을 가능성이 높은지"까지 적어주세요
- 협상 포인트는 "얼마를 줄일 수 있는지" 추정 범위까지 적어주세요
- 견적서에 나온 브랜드와 모델명이 있으면 그대로 우선 인용하세요
- 불확실한 추정은 "추정"이라고 표시하세요
- 마지막에 총평 2~4줄로 마무리
- 한국어로 작성

권장 출력 구조:
1. 전체 요약
2. 가격 이상 의심 항목
3. 범위 모호 항목
4. 누락 항목
5. 협상 포인트
6. 총평`;
  }

  async function analyzeEstimate(estimateText, apiKey, signal) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        stream: true,
        system: buildSystemPrompt(),
        messages: [
          {
            role: "user",
            content: `다음 인테리어 견적서를 분석해주세요:\n\n${estimateText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    return response.body;
  }

  async function streamToElement(stream, el, signal) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (raw === "[DONE]") continue;
        try {
          const parsed = JSON.parse(raw);
          if (
            parsed.type === "content_block_delta" &&
            parsed.delta?.type === "text_delta"
          ) {
            el.textContent += parsed.delta.text;
            el.scrollTop = el.scrollHeight;
          }
        } catch {}
      }
    }
  }

  async function fakeStream(text, el, signal) {
    el.textContent = "";
    el.className = "ai-result";

    // chunk by character, with slight random variance for natural feel
    for (let i = 0; i < text.length; i++) {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      el.textContent += text[i];
      el.scrollTop = el.scrollHeight;

      const ch = text[i];
      let delay;
      if (ch === "\n") {
        delay = 18;
      } else if ("。．！？!?.".includes(ch)) {
        delay = 40;
      } else if (ch === "—" || ch === "→") {
        delay = 25;
      } else {
        // Korean chars slightly slower, Latin faster
        const code = ch.charCodeAt(0);
        delay = code > 127 ? 14 : 8;
      }
      // small jitter
      delay += Math.random() * 6;

      await new Promise((r) => setTimeout(r, delay));
    }
  }

  function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }, ms);

      function onAbort() {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      }

      if (signal?.aborted) {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  function init() {
    const apiKeyInput = document.getElementById("api-key-input");
    const saveKeyBtn = document.getElementById("save-key-btn");
    const keyStatus = document.getElementById("key-status");
    const estimateTextarea = document.getElementById("estimate-text");
    const analyzeBtn = document.getElementById("analyze-btn");
    const demoBtn = document.getElementById("demo-btn");
    const stopBtn = document.getElementById("stop-btn");
    const resultEl = document.getElementById("ai-result");

    if (!analyzeBtn) return;

    function resetControls() {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "분석하기";
      if (demoBtn) demoBtn.disabled = false;
      if (stopBtn) stopBtn.disabled = true;
    }

    function stopActiveAnalysis(message = "분석이 중단되었습니다. 내용을 수정한 뒤 다시 분석할 수 있습니다.") {
      if (activeAnalysis?.controller) {
        activeAnalysis.controller.abort();
      }
      activeAnalysis = null;
      resultEl.textContent = message;
      resultEl.className = "ai-result is-error";
      resetControls();
    }

    // restore saved key
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && apiKeyInput) {
      apiKeyInput.value = saved;
      keyStatus.textContent = "저장된 키 있음 ✓";
      keyStatus.className = "key-status is-saved";
    }

    if (saveKeyBtn) {
      saveKeyBtn.addEventListener("click", () => {
        const key = apiKeyInput.value.trim();
        if (!key) return;
        localStorage.setItem(STORAGE_KEY, key);
        keyStatus.textContent = "저장됨 ✓";
        keyStatus.className = "key-status is-saved";
      });
    }

    // demo mode
    if (demoBtn) {
      demoBtn.addEventListener("click", async () => {
        if (activeAnalysis?.controller) {
          activeAnalysis.controller.abort();
        }
        const controller = new AbortController();
        activeAnalysis = { controller, mode: "demo" };
        estimateTextarea.value = DEMO_ESTIMATE;
        estimateTextarea.dispatchEvent(new Event("input", { bubbles: true }));
        demoBtn.disabled = true;
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "분석 중…";
        if (stopBtn) stopBtn.disabled = false;
        resultEl.textContent = "";
        resultEl.className = "ai-result is-loading";
        resultEl.textContent = "분석 중…";

        try {
          await sleep(900, controller.signal);

          await fakeStream(DEMO_RESPONSE, resultEl, controller.signal);
          resultEl.className = "ai-result";
        } catch (err) {
          if (err?.name !== "AbortError") {
            resultEl.textContent = `오류: ${err.message}`;
            resultEl.className = "ai-result is-error";
          }
        } finally {
          if (activeAnalysis?.controller === controller) {
            activeAnalysis = null;
          }
          resetControls();
        }
      });
    }

    // real API mode
    analyzeBtn.addEventListener("click", async () => {
      const apiKey =
        localStorage.getItem(STORAGE_KEY) || (apiKeyInput ? apiKeyInput.value.trim() : "");
      const text = estimateTextarea.value.trim();

      if (!apiKey) {
        resultEl.textContent = "API 키를 먼저 입력하고 저장해주세요. 또는 '데모 체험하기'를 눌러보세요.";
        resultEl.className = "ai-result is-error";
        return;
      }
      if (!text) {
        resultEl.textContent = "분석할 견적서 내용을 붙여넣어주세요.";
        resultEl.className = "ai-result is-error";
        return;
      }

      if (activeAnalysis?.controller) {
        activeAnalysis.controller.abort();
      }
      const controller = new AbortController();
      activeAnalysis = { controller, mode: "api" };

      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "분석 중…";
      if (demoBtn) demoBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = false;
      resultEl.textContent = "";
      resultEl.className = "ai-result is-loading";

      try {
        const stream = await analyzeEstimate(text, apiKey, controller.signal);
        resultEl.className = "ai-result";
        await streamToElement(stream, resultEl, controller.signal);
      } catch (err) {
        if (err?.name === "AbortError") {
          stopActiveAnalysis();
          return;
        }
        resultEl.textContent = `오류: ${err.message}`;
        resultEl.className = "ai-result is-error";
      } finally {
        if (activeAnalysis?.controller === controller) {
          activeAnalysis = null;
        }
        resetControls();
      }
    });

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        stopActiveAnalysis();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
