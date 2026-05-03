(function () {
  const GRADE_ORDER = ["low", "mid", "premium"];
  const GRADE_DISPLAY = {
    low: "보급형",
    mid: "표준형",
    premium: "고급형",
  };

  const processGrid = document.getElementById("process-grid");
  const questionList = document.getElementById("question-list");
  const selectionList = document.getElementById("selection-list");
  const auditList = document.getElementById("audit-list");
  const auditSummaryCopy = document.getElementById("audit-summary-copy");
  const omissionList = document.getElementById("omission-list");
  const omissionSummaryCopy = document.getElementById("omission-summary-copy");
  const meetingReportList = document.getElementById("meeting-report-list");
  const meetingReportSummary = document.getElementById("meeting-report-summary");
  const meetingReportMore = document.getElementById("meeting-report-more");
  const meetingReportMoreSummary = document.getElementById("meeting-report-more-summary");
  const meetingReportMoreList = document.getElementById("meeting-report-more-list");
  const pyeongRange = document.getElementById("pyeong-range");
  const pyeongInput = document.getElementById("pyeong-input");
  const quoteTotalInput = document.getElementById("quote-total");
  const estimateTextInput = document.getElementById("estimate-text");
  const estimateRange = document.getElementById("estimate-range");
  const estimateDetail = document.getElementById("estimate-detail");
  const verdictBadge = document.getElementById("verdict-badge");
  const verdictCopy = document.getElementById("verdict-copy");

  const processNames = Object.keys(window.prices);
  const selectedGrades = Object.fromEntries(
    processNames.map((processName) => [processName, "mid"])
  );
  const selectedReferenceIndex = Object.fromEntries(
    processNames.map((processName) => [processName, 0])
  );
  const enabledProcesses = Object.fromEntries(
    processNames.map((processName) => [processName, true])
  );
  const quotedUnitPrices = Object.fromEntries(
    processNames.map((processName) => [processName, ""])
  );

  function formatWon(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function formatManwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  }

  function clampPyeong(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return 33;
    }
    return Math.min(60, Math.max(10, numeric));
  }

  function parseUnitPrice(value) {
    if (value === "") {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
  }

  function getActiveGrade(processName) {
    return window.prices[processName].grades[selectedGrades[processName]];
  }

  function getReferenceOptions(processName) {
    return getActiveGrade(processName).references || [];
  }

  function ensureReferenceSelection(processName) {
    const references = getReferenceOptions(processName);
    const currentIndex = Number(selectedReferenceIndex[processName]);

    if (references.length === 0) {
      selectedReferenceIndex[processName] = 0;
      return 0;
    }

    if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= references.length) {
      selectedReferenceIndex[processName] = 0;
      return 0;
    }

    return currentIndex;
  }

  function getActiveReference(processName) {
    const references = getReferenceOptions(processName);
    const index = ensureReferenceSelection(processName);
    return references[index];
  }

  function getReferenceLabel(reference) {
    return `${reference.brand} ${reference.name}`.trim();
  }

  function getSourceMarkup(reference) {
    const updatedAt = reference.updatedAt || "-";
    if (reference.sourceUrl) {
      return `<a class="source-link" href="${reference.sourceUrl}" target="_blank" rel="noreferrer">${reference.sourceLabel}</a> · 업데이트 ${updatedAt}`;
    }
    return `${reference.sourceLabel} · 업데이트 ${updatedAt}`;
  }

  function getReferenceImpact(processName) {
    const pyeong = clampPyeong(pyeongInput.value);
    const references = getReferenceOptions(processName);
    const current = getActiveReference(processName);
    const baseline = references[0] || current;

    const baselineMid = ((baseline.priceMin + baseline.priceMax) / 2) * pyeong;
    const currentMid = ((current.priceMin + current.priceMax) / 2) * pyeong;
    const delta = currentMid - baselineMid;

    return {
      delta,
      baseline,
      currentMid,
      baselineMid,
    };
  }

  function getImpactCopy(processName) {
    const impact = getReferenceImpact(processName);
    if (impact.delta === 0) {
      return `이 등급의 기본 기준 대비 총액 영향 없음`;
    }

    const sign = impact.delta > 0 ? "+" : "-";
    return `이 등급의 기본 기준 대비 총액 ${sign}${formatManwon(
      Math.abs(impact.delta)
    )}`;
  }

  function getProcessAudit(processName) {
    const quoted = parseUnitPrice(quotedUnitPrices[processName]);
    const reference = getActiveReference(processName);

    if (quoted === null) {
      return {
        status: "pending",
        label: "입력 대기",
        copy: "받은 평당 단가를 입력하면 선택한 세부 기준과 비교합니다.",
      };
    }

    if (quoted > reference.priceMax) {
      return {
        status: "expensive",
        label: "높음",
        copy: `선택 기준 상단 ${formatWon(reference.priceMax)}를 넘습니다.`,
      };
    }

    if (quoted < reference.priceMin) {
      return {
        status: "cheap",
        label: "낮음",
        copy: `선택 기준 하단 ${formatWon(reference.priceMin)}보다 낮습니다.`,
      };
    }

    return {
      status: "fair",
      label: "적정",
      copy: `선택 기준 ${formatWon(reference.priceMin)} ~ ${formatWon(reference.priceMax)} 안입니다.`,
    };
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function getChecklistItems(processName) {
    const processData = window.prices[processName];
    const checklist = processData.missingChecklist || {};
    const gradeKey = selectedGrades[processName];

    return [...(checklist.common || []), ...(checklist[gradeKey] || [])];
  }

  function buildGradeSpecificQuestions(processName) {
    const processData = window.prices[processName];
    const grade = getActiveGrade(processName);
    const reference = getActiveReference(processName);
    const gradeKey = selectedGrades[processName];
    const questions = [];

    if (gradeKey === "low") {
      questions.push(
        `${grade.label} 기준이면 어디까지가 기본 포함이고, 빠지는 항목은 무엇인지 선을 그어 설명해주실 수 있나요?`
      );
    } else if (gradeKey === "mid") {
      questions.push(
        `${grade.label} 기준에서 기본 사양과 옵션 사양의 경계가 어디인지, 추가비가 붙는 지점을 같이 적어주실 수 있나요?`
      );
    } else if (gradeKey === "premium") {
      questions.push(
        `${grade.label} 기준으로 잡힌 이유가 무엇인지, 실제 업그레이드되는 스펙과 브랜드 차이를 항목별로 설명해주실 수 있나요?`
      );
    }

    questions.push(
      `현재 선택 기준은 ${reference.brand} ${reference.name} / ${reference.spec}입니다. 실제 시공도 이 기준과 같은지 확인해주실 수 있나요?`
    );
    questions.push(`포함 항목은 "${grade.includes}"이고, 제외 항목은 "${grade.excludes}"로 이해하면 맞나요?`);

    return [...questions, ...(processData.questions || [])];
  }

  function getRelatedProcessChecks(processName) {
    return window.prices[processName].relatedChecks || [];
  }

  function evaluateChecklistItem(item, normalizedEstimateText) {
    if (!normalizedEstimateText) {
      return {
        status: "pending",
        label: "확인 필요",
        copy: item.note,
      };
    }

    const matchedKeyword = (item.keywords || []).find((keyword) =>
      normalizedEstimateText.includes(String(keyword).toLowerCase())
    );

    if (matchedKeyword) {
      return {
        status: "found",
        label: "확인됨",
        copy: `견적서에서 "${matchedKeyword}" 관련 표현이 확인됐습니다. ${item.note}`,
      };
    }

    return {
      status: "missing",
      label: "누락 의심",
      copy: `견적서 텍스트에서 바로 확인되지 않았습니다. ${item.note}`,
    };
  }

  function getActiveProcessNames() {
    return processNames.filter((processName) => enabledProcesses[processName]);
  }

  function getActiveProcessCount() {
    return getActiveProcessNames().length;
  }

  function buildMeetingReportItems() {
    const activeProcesses = getActiveProcessNames();
    const pyeong = clampPyeong(pyeongInput.value);
    const inputManwon = quoteTotalInput.value.trim();
    const inputTotalWon =
      inputManwon === "" || !Number.isFinite(Number(inputManwon))
        ? undefined
        : Number(inputManwon) * 10000;
    const totalResult = estimateTotals(pyeong, inputTotalWon);
    const normalizedEstimateText = normalizeText(estimateTextInput?.value || "");
    const items = [];
    const seenKeys = new Set();

    function pushItem(item) {
      if (!item || seenKeys.has(item.key)) {
        return;
      }
      seenKeys.add(item.key);
      items.push(item);
    }

    if (totalResult.verdict === "비쌈") {
      pushItem({
        key: "total-expensive",
        priority: 120,
        category: "총액",
        title: "총액이 예상 상단을 넘는 이유를 먼저 분해해 달라고 요청하기",
        copy: `현재 총액은 ${formatManwon(inputTotalWon)}이고, 선택 조건 기준 참고 범위는 ${formatManwon(
          totalResult.min
        )} ~ ${formatManwon(totalResult.max)}입니다. 큰 금액 차이는 묶음 공정이나 숨은 추가비에 있을 가능성이 큽니다.`,
        ask: "질문: 공정별로 자재비·시공비·추가 가능 비용을 분리한 내역서로 다시 주실 수 있나요?",
      });
    } else if (totalResult.verdict === "싸다") {
      pushItem({
        key: "total-cheap",
        priority: 108,
        category: "총액",
        title: "총액이 너무 낮은 이유와 빠진 공정이 없는지 확인하기",
        copy: `현재 총액은 ${formatManwon(inputTotalWon)}이고, 선택 조건 기준 참고 하단은 ${formatManwon(
          totalResult.min
        )}입니다. 낮은 총액은 누락 공정, 저가 자재 대체, 제외 항목 증가로 이어질 수 있습니다.`,
        ask: "질문: 빠진 공정이나 별도 청구 예정 항목이 없는지, 포함/제외 범위를 공정별로 적어주실 수 있나요?",
      });
    } else if (typeof inputTotalWon === "number") {
      pushItem({
        key: "total-fair",
        priority: 72,
        category: "총액",
        title: "총액은 범위 안이지만 증액 가능 항목을 미리 체크하기",
        copy: `총액은 현재 참고 범위 안입니다. 다만 범위 안이라고 해도 실측 후 증액, 양중비, 철거 후 보수처럼 뒤에서 붙는 비용은 별도로 확인해야 안전합니다.`,
        ask: "질문: 실측 후 증액될 수 있는 항목 3가지만 먼저 짚어주실 수 있나요?",
      });
    }

    activeProcesses
      .map((processName) => {
        const reference = getActiveReference(processName);
        const audit = getProcessAudit(processName);
        const quoted = parseUnitPrice(quotedUnitPrices[processName]);
        const upperGap = quoted === null ? 0 : quoted - reference.priceMax;
        const lowerGap = quoted === null ? 0 : reference.priceMin - quoted;
        return {
          processName,
          reference,
          audit,
          quoted,
          score:
            audit.status === "expensive"
              ? 100 + upperGap / Math.max(reference.priceMax, 1)
              : audit.status === "cheap"
                ? 92 + lowerGap / Math.max(reference.priceMin, 1)
                : 0,
        };
      })
      .filter((entry) => entry.audit.status === "expensive" || entry.audit.status === "cheap")
      .sort((a, b) => b.score - a.score)
      .forEach((entry) => {
        const isExpensive = entry.audit.status === "expensive";
        const grade = getActiveGrade(entry.processName);
        const questions = buildGradeSpecificQuestions(entry.processName);
        pushItem({
          key: `audit-${entry.processName}-${entry.audit.status}`,
          priority: entry.score,
          category: "단가",
          title: isExpensive
            ? `${entry.processName} 단가가 선택 기준보다 높게 들어갔는지 확인하기`
            : `${entry.processName} 단가가 너무 낮아서 제외 범위가 숨어 있지 않은지 확인하기`,
          copy: isExpensive
            ? `입력 단가는 ${formatWon(entry.quoted)} / 평이고, 현재 선택 기준은 ${formatWon(
                entry.reference.priceMin
              )} ~ ${formatWon(entry.reference.priceMax)} / 평입니다. ${grade.excludes} 같은 항목이 나중에 추가될 수 있습니다.`
            : `입력 단가는 ${formatWon(entry.quoted)} / 평이고, 현재 선택 기준 하단은 ${formatWon(
                entry.reference.priceMin
              )} / 평입니다. 낮은 단가는 자재 다운그레이드나 시공 범위 축소일 수 있습니다.`,
          ask: `질문: ${questions[0]}`,
        });
      });

    activeProcesses.forEach((processName) => {
      getChecklistItems(processName).forEach((item) => {
        const result = evaluateChecklistItem(item, normalizedEstimateText);
        if (result.status !== "missing") {
          return;
        }
        pushItem({
          key: `missing-${processName}-${item.label}`,
          priority: 88,
          category: "누락",
          title: `${processName}에서 "${item.label}" 포함 여부 다시 확인하기`,
          copy: result.copy,
          ask: `질문: ${item.label}이 현재 견적에 포함인지, 별도인지 명확히 적어주실 수 있나요?`,
        });
      });
    });

    activeProcesses
      .map((processName) => ({
        processName,
        reference: getActiveReference(processName),
        grade: getActiveGrade(processName),
        impact: getReferenceImpact(processName),
      }))
      .sort((a, b) => b.impact.currentMid - a.impact.currentMid)
      .forEach((entry) => {
        const questions = buildGradeSpecificQuestions(entry.processName);
        pushItem({
          key: `baseline-${entry.processName}`,
          priority: 40 + entry.impact.currentMid / 1000000,
          category: "공정",
          title: `${entry.processName}의 기준 스펙과 제외 항목을 미리 고정하기`,
          copy: `${entry.processName}은 현재 ${entry.grade.label} / ${getReferenceLabel(
            entry.reference
          )} 기준입니다. 기준 스펙은 ${entry.reference.specSummary}이고, 제외 항목은 ${entry.grade.excludes}입니다.`,
          ask: `질문: ${questions[1] || questions[0]}`,
        });
      });

    if (items.length === 0) {
      return [];
    }

    return items.sort((a, b) => b.priority - a.priority);
  }

  function evaluateRelatedProcessItem(item, normalizedEstimateText) {
    if (enabledProcesses[item.process]) {
      return {
        status: "found",
        label: "잡힘",
        copy: `${item.label} 관련 공정이 현재 선택 공정에 포함돼 있습니다. ${item.note}`,
      };
    }

    if (!normalizedEstimateText) {
      return {
        status: "missing",
        label: "점검 권장",
        copy: `${item.label} 공정이 현재 선택되지 않았습니다. ${item.note}`,
      };
    }

    const matchedKeyword = (item.keywords || []).find((keyword) =>
      normalizedEstimateText.includes(String(keyword).toLowerCase())
    );

    if (matchedKeyword) {
      return {
        status: "found",
        label: "확인됨",
        copy: `견적서에서 "${matchedKeyword}" 관련 표현이 보여 연관 공정 반영 가능성이 높습니다. ${item.note}`,
      };
    }

    return {
      status: "missing",
      label: "누락 의심",
      copy: `${item.label} 관련 표현이 견적서에서 바로 확인되지 않았습니다. ${item.note}`,
    };
  }

  function estimateTotals(pyeong, inputTotalWon) {
    let min = 0;
    let max = 0;

    processNames.forEach((processName) => {
      if (!enabledProcesses[processName]) {
        return;
      }

      const reference = getActiveReference(processName);
      min += reference.priceMin * pyeong * 0.9;
      max += reference.priceMax * pyeong * 1.1;
    });

    return {
      min,
      max,
      verdict:
        typeof inputTotalWon === "number"
          ? calcTotalVerdict(inputTotalWon, min, max)
          : null,
    };
  }

  function calcTotalVerdict(inputTotal, min, max) {
    if (inputTotal > max) {
      return "비쌈";
    }
    if (inputTotal < min) {
      return "싸다";
    }
    return "적정";
  }

  function getInlineBadgeClass(status) {
    if (status === "expensive") {
      return "inline-badge inline-expensive";
    }
    if (status === "cheap") {
      return "inline-badge inline-cheap";
    }
    if (status === "fair") {
      return "inline-badge inline-fair";
    }
    return "inline-badge inline-pending";
  }

  function renderReferenceSelect(processName) {
    const references = getReferenceOptions(processName);
    const activeIndex = ensureReferenceSelection(processName);

    if (references.length === 0) {
      return "";
    }

    const options = references
      .map((reference, index) => {
        const selected = index === activeIndex ? "selected" : "";
        return `<option value="${index}" ${selected}>${getReferenceLabel(reference)} · ${reference.spec}</option>`;
      })
      .join("");

    return `
      <div class="reference-picker">
        <label class="picker-label" for="reference-${processName}">세부 기준 선택</label>
        <select
          id="reference-${processName}"
          class="reference-select"
          data-role="reference-select"
          data-process="${processName}"
          ${enabledProcesses[processName] ? "" : "disabled"}
        >
          ${options}
        </select>
      </div>
    `;
  }

  function renderProcessGrid() {
    processGrid.innerHTML = "";

    processNames.forEach((processName) => {
      const activeGrade = getActiveGrade(processName);
      const activeReference = getActiveReference(processName);
      const audit = getProcessAudit(processName);

      const card = document.createElement("section");
      card.className = "process-card";
      if (!enabledProcesses[processName]) {
        card.classList.add("is-disabled");
      }

      const title = document.createElement("div");
      title.className = "process-head";
      title.innerHTML = `
        <div class="process-title-block">
          <div>
            <h3>${processName}</h3>
            <p>${activeGrade.material}</p>
          </div>
          <label class="process-toggle">
            <input
              type="checkbox"
              data-role="enabled"
              data-process="${processName}"
              ${enabledProcesses[processName] ? "checked" : ""}
            />
            견적 포함
          </label>
        </div>
      `;

      const toggleGroup = document.createElement("div");
      toggleGroup.className = "grade-toggle";
      toggleGroup.setAttribute("role", "radiogroup");
      toggleGroup.setAttribute("aria-label", `${processName} 등급 선택`);

      GRADE_ORDER.forEach((gradeKey) => {
        const grade = window.prices[processName].grades[gradeKey];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "grade-button";
        button.textContent = grade.label || GRADE_DISPLAY[gradeKey];
        button.disabled = !enabledProcesses[processName];

        if (selectedGrades[processName] === gradeKey) {
          button.classList.add("is-active");
          button.setAttribute("aria-pressed", "true");
        } else {
          button.setAttribute("aria-pressed", "false");
        }

        button.addEventListener("click", function () {
          selectedGrades[processName] = gradeKey;
          selectedReferenceIndex[processName] = 0;
          renderAll();
        });
        toggleGroup.appendChild(button);
      });

      const meta = document.createElement("div");
      meta.className = "process-meta";
      meta.innerHTML = `
        <p><strong>등급 기준</strong> ${activeGrade.label} · ${activeGrade.material}</p>
        <p><strong>세부 기준</strong> ${getReferenceLabel(activeReference)} / ${activeReference.spec}</p>
        <p><strong>선택 범위</strong> ${formatWon(activeReference.priceMin)} ~ ${formatWon(activeReference.priceMax)} / 평</p>
        <p><strong>총액 영향</strong> <span class="impact-copy">${getImpactCopy(
          processName
        )}</span></p>
        <p><strong>규격 요약</strong> ${activeReference.specSummary}</p>
        <p><strong>출처</strong> ${getSourceMarkup(activeReference)}</p>
        <p><strong>메모</strong> ${activeReference.note}</p>
        <p><strong>포함</strong> ${activeGrade.includes}</p>
        <p><strong>제외</strong> ${activeGrade.excludes}</p>
      `;

      const referencePicker = document.createElement("div");
      referencePicker.innerHTML = renderReferenceSelect(processName);

      const priceCheck = document.createElement("div");
      priceCheck.className = "price-check";
      priceCheck.innerHTML = `
        <div class="price-check-head">
          <strong>받은 단가 검증</strong>
          <span class="${getInlineBadgeClass(audit.status)}" data-role="audit-badge">${audit.label}</span>
        </div>
        <div class="price-input-row">
          <label class="currency-field" for="unit-price-${processName}">
            <input
              id="unit-price-${processName}"
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              placeholder="예: 65000"
              value="${quotedUnitPrices[processName]}"
              data-role="unit-price"
              data-process="${processName}"
              ${enabledProcesses[processName] ? "" : "disabled"}
            />
            <span>원 / 평</span>
          </label>
          <span class="inline-range" data-role="audit-copy">${audit.copy}</span>
        </div>
      `;

      card.appendChild(title);
      card.appendChild(toggleGroup);
      card.appendChild(referencePicker);
      card.appendChild(meta);
      card.appendChild(priceCheck);
      processGrid.appendChild(card);
    });

    bindCardEvents();
  }

  function bindCardEvents() {
    processGrid.querySelectorAll('[data-role="enabled"]').forEach((element) => {
      element.addEventListener("change", function (event) {
        const processName = event.target.dataset.process;
        enabledProcesses[processName] = event.target.checked;
        renderAll();
      });
    });

    processGrid
      .querySelectorAll('[data-role="reference-select"]')
      .forEach((element) => {
        element.addEventListener("change", function (event) {
          const processName = event.target.dataset.process;
          selectedReferenceIndex[processName] = Number(event.target.value);
          renderAll();
        });
      });

    processGrid.querySelectorAll('[data-role="unit-price"]').forEach((element) => {
      element.addEventListener("input", function (event) {
        const processName = event.target.dataset.process;
        quotedUnitPrices[processName] = event.target.value.trim();
        syncAuditFeedback(processName, event.target);
        renderSelectionSummary();
        renderAuditSummary();
        renderQuestions();
        updateEstimate();
      });
    });
  }

  function syncAuditFeedback(processName, inputElement) {
    const audit = getProcessAudit(processName);
    const card = inputElement.closest(".process-card");
    if (!card) {
      return;
    }

    const badge = card.querySelector('[data-role="audit-badge"]');
    const copy = card.querySelector('[data-role="audit-copy"]');

    if (badge) {
      badge.className = getInlineBadgeClass(audit.status);
      badge.setAttribute("data-role", "audit-badge");
      badge.textContent = audit.label;
    }

    if (copy) {
      copy.textContent = audit.copy;
    }
  }

  function renderQuestions() {
    questionList.innerHTML = "";

    processNames
      .filter((processName) => enabledProcesses[processName])
      .forEach((processName) => {
        const grade = getActiveGrade(processName);
        const reference = getActiveReference(processName);
        const questions = buildGradeSpecificQuestions(processName);

        const details = document.createElement("details");
        details.className = "question-item";

        const summary = document.createElement("summary");
        summary.innerHTML = `
          <span>${processName}</span>
          <span class="summary-meta">${grade.label} · ${getReferenceLabel(reference)}</span>
        `;

        const list = document.createElement("ul");
        list.className = "question-bullets";

        questions.forEach((question) => {
          const item = document.createElement("li");
          item.textContent = question;
          list.appendChild(item);
        });

        const referenceItem = document.createElement("li");
        referenceItem.innerHTML = `현재 기준: ${reference.specSummary} / ${formatWon(
          reference.priceMin
        )} ~ ${formatWon(reference.priceMax)} / 평`;
        list.prepend(referenceItem);

        const sourceItem = document.createElement("li");
        sourceItem.innerHTML = `출처: ${getSourceMarkup(reference)}`;
        list.prepend(sourceItem);

        details.appendChild(summary);
        details.appendChild(list);
        questionList.appendChild(details);
      });
  }

  function renderOmissionChecklist() {
    omissionList.innerHTML = "";

    const activeProcesses = processNames.filter(
      (processName) => enabledProcesses[processName]
    );

    if (activeProcesses.length === 0) {
      omissionSummaryCopy.textContent =
        "공정을 하나 이상 선택하면 보통 들어가야 할 항목을 자동으로 정리합니다.";
      return;
    }

    const normalizedEstimateText = normalizeText(estimateTextInput?.value || "");
    let totalItems = 0;
    let foundItems = 0;
    let missingItems = 0;

    activeProcesses.forEach((processName) => {
      const items = getChecklistItems(processName);
      const relatedChecks = getRelatedProcessChecks(processName);

      if (items.length === 0 && relatedChecks.length === 0) {
        return;
      }

      const processGroup = document.createElement("section");
      processGroup.className = "omission-process";

      const grade = getActiveGrade(processName);
      const head = document.createElement("div");
      head.className = "omission-process-head";
      head.innerHTML = `
        <h3>${escapeHtml(processName)}</h3>
        <span class="omission-grade">${escapeHtml(grade.label)} · ${escapeHtml(
          grade.material
        )}</span>
      `;

      const list = document.createElement("ul");
      list.className = "omission-items";

      if (relatedChecks.length > 0) {
        const section = document.createElement("li");
        section.className = "omission-section-label";
        section.textContent = "같이 잡히는 공정";
        list.appendChild(section);

        relatedChecks.forEach((item) => {
          totalItems += 1;
          const result = evaluateRelatedProcessItem(item, normalizedEstimateText);

          if (result.status === "found") {
            foundItems += 1;
          } else if (result.status === "missing") {
            missingItems += 1;
          }

          const row = document.createElement("li");
          row.className = "omission-item";
          row.innerHTML = `
            <div class="omission-item-head">
              <span class="omission-item-title">${escapeHtml(item.label)}</span>
              <span class="omission-badge omission-${result.status}">${escapeHtml(
                result.label
              )}</span>
            </div>
            <div class="omission-item-copy">${escapeHtml(result.copy)}</div>
          `;
          list.appendChild(row);
        });
      }

      if (relatedChecks.length > 0 && items.length > 0) {
        const divider = document.createElement("li");
        divider.className = "omission-section-label";
        divider.textContent = "세부 체크포인트";
        list.appendChild(divider);
      }

      items.forEach((item) => {
        totalItems += 1;
        const result = evaluateChecklistItem(item, normalizedEstimateText);

        if (result.status === "found") {
          foundItems += 1;
        } else if (result.status === "missing") {
          missingItems += 1;
        }

        const row = document.createElement("li");
        row.className = "omission-item";
        row.innerHTML = `
          <div class="omission-item-head">
            <span class="omission-item-title">${escapeHtml(item.label)}</span>
            <span class="omission-badge omission-${result.status}">${escapeHtml(
              result.label
            )}</span>
          </div>
          <div class="omission-item-copy">${escapeHtml(result.copy)}</div>
        `;
        list.appendChild(row);
      });

      processGroup.appendChild(head);
      processGroup.appendChild(list);
      omissionList.appendChild(processGroup);
    });

    if (!normalizedEstimateText) {
      omissionSummaryCopy.textContent = `선택한 ${activeProcesses.length}개 공정 기준으로 ${totalItems}개 체크포인트를 정리했습니다. 견적서 텍스트를 붙여넣으면 항목별로 확인됨/누락 의심 상태가 자동 표시됩니다.`;
      return;
    }

    omissionSummaryCopy.textContent = `붙여넣은 견적서 기준 ${totalItems}개 체크포인트 중 ${foundItems}개 확인, ${missingItems}개 누락 의심입니다. 누락 의심 항목은 포함 여부를 다시 물어보는 편이 안전합니다.`;
  }

  function renderSelectionSummary() {
    selectionList.innerHTML = "";

    getActiveProcessNames().forEach((processName) => {
        const item = document.createElement("li");
        const grade = getActiveGrade(processName);
        const reference = getActiveReference(processName);
        const quoted = parseUnitPrice(quotedUnitPrices[processName]);

        item.textContent =
          quoted === null
            ? `${processName}: ${grade.label} / ${getReferenceLabel(reference)} (${reference.spec}, ${reference.updatedAt})`
            : `${processName}: ${grade.label} / ${getReferenceLabel(reference)}, 입력 단가 ${formatWon(quoted)} / 평, 업데이트 ${reference.updatedAt}`;
        selectionList.appendChild(item);
      });
  }

  function renderAuditSummary() {
    auditList.innerHTML = "";

    const activeProcesses = getActiveProcessNames();
    const audits = activeProcesses.map((processName) => ({
      processName,
      reference: getActiveReference(processName),
      audit: getProcessAudit(processName),
      quoted: parseUnitPrice(quotedUnitPrices[processName]),
    }));

    const filledCount = audits.filter((entry) => entry.quoted !== null).length;
    const fairCount = audits.filter((entry) => entry.audit.status === "fair").length;
    const expensiveCount = audits.filter(
      (entry) => entry.audit.status === "expensive"
    ).length;
    const cheapCount = audits.filter((entry) => entry.audit.status === "cheap").length;

    auditSummaryCopy.textContent =
      filledCount === 0
        ? "단가를 입력하면 선택한 세부 기준과 비교한 판정이 표시됩니다."
        : `입력한 ${filledCount}개 공정 중 적정 ${fairCount}개, 높음 ${expensiveCount}개, 낮음 ${cheapCount}개입니다.`;

    audits.forEach((entry) => {
      const item = document.createElement("li");
      const quotedCopy =
        entry.quoted === null ? "단가 미입력" : `${formatWon(entry.quoted)} / 평`;
      item.textContent = `${entry.processName}: ${entry.audit.label} (${quotedCopy}, 기준 ${getReferenceLabel(
        entry.reference
      )} ${formatWon(entry.reference.priceMin)} ~ ${formatWon(
        entry.reference.priceMax
      )})`;
      auditList.appendChild(item);
    });
  }

  function updateTotalVerdict(verdict) {
    verdictBadge.className = "verdict-badge";

    if (!verdict) {
      verdictBadge.classList.add("verdict-pending");
      verdictBadge.textContent = "총액 입력 대기";
      verdictCopy.textContent =
        "총액을 입력하면 예상 범위와 비교한 판단이 표시됩니다.";
      return;
    }

    if (verdict === "비쌈") {
      verdictBadge.classList.add("verdict-expensive");
      verdictCopy.textContent =
        "예상 상단 범위를 넘습니다. 높은 판정이 나온 공정부터 세부 기준과 제외 항목을 다시 확인하는 편이 좋습니다.";
    } else if (verdict === "싸다") {
      verdictBadge.classList.add("verdict-cheap");
      verdictCopy.textContent =
        "예상 하단보다 낮습니다. 선택하지 않은 공정이나 누락된 자재가 없는지 확인하세요.";
    } else {
      verdictBadge.classList.add("verdict-fair");
      verdictCopy.textContent =
        "예상 범위 안에 있습니다. 그래도 실제 견적서에는 제품명과 포함 범위를 명시해두는 것이 안전합니다.";
    }

    verdictBadge.textContent = verdict;
  }

  function updateEstimate() {
    const pyeong = clampPyeong(pyeongInput.value);
    pyeongInput.value = String(pyeong);
    pyeongRange.value = String(pyeong);

    const inputManwon = quoteTotalInput.value.trim();
    const inputTotalWon =
      inputManwon === "" || !Number.isFinite(Number(inputManwon))
        ? undefined
        : Number(inputManwon) * 10000;

    const activeCount = getActiveProcessCount();
    const result = estimateTotals(pyeong, inputTotalWon);

    if (activeCount === 0) {
      estimateRange.textContent = "-";
      estimateDetail.textContent = "합산할 공정을 하나 이상 선택하세요.";
      updateTotalVerdict(null);
      return;
    }

    estimateRange.textContent = `${formatManwon(result.min)} ~ ${formatManwon(
      result.max
    )}`;
    estimateDetail.textContent = `${pyeong}평 기준, 선택한 ${activeCount}개 공정의 세부 기준을 합산한 참고 범위입니다.`;
    updateTotalVerdict(result.verdict);
    renderMeetingReport();
  }

  function renderMeetingReport() {
    if (
      !meetingReportList ||
      !meetingReportSummary ||
      !meetingReportMore ||
      !meetingReportMoreSummary ||
      !meetingReportMoreList
    ) {
      return;
    }

    meetingReportList.innerHTML = "";
    meetingReportMoreList.innerHTML = "";

    const activeCount = getActiveProcessCount();
    if (activeCount === 0) {
      meetingReportSummary.textContent =
        "공정을 하나 이상 선택하면 이번 미팅에서 우선 확인할 7가지를 자동으로 정리합니다.";
      meetingReportMoreSummary.textContent =
        "핵심 항목 외에 더 확인해두면 좋은 내용이 여기에 정리됩니다.";
      meetingReportMore.open = false;
      meetingReportMore.hidden = false;
      return;
    }

    const reportItems = buildMeetingReportItems();
    const coreItems = reportItems.slice(0, 7);
    const extraItems = reportItems.slice(7);
    const hasEstimateText = normalizeText(estimateTextInput?.value || "") !== "";

    meetingReportSummary.textContent = hasEstimateText
      ? `선택한 ${activeCount}개 공정과 붙여넣은 견적서 기준으로, 이번 상담에서 먼저 짚어야 할 7가지를 우선순위대로 정리했습니다.`
      : `선택한 ${activeCount}개 공정과 입력한 단가/총액 기준으로 우선 확인사항을 먼저 정리했습니다. 견적서 텍스트를 붙여넣으면 누락 의심 항목까지 더 정확해집니다.`;

    coreItems.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "meeting-report-item";
      card.innerHTML = `
        <div class="meeting-report-head">
          <span class="meeting-report-rank">${index + 1}</span>
          <span class="meeting-report-category">${escapeHtml(item.category)}</span>
        </div>
        <h3 class="meeting-report-title">${escapeHtml(item.title)}</h3>
        <p class="meeting-report-copy">${escapeHtml(item.copy)}</p>
        <p class="meeting-report-ask">${escapeHtml(item.ask)}</p>
      `;
      meetingReportList.appendChild(card);
    });

    if (extraItems.length === 0) {
      meetingReportMore.hidden = true;
      meetingReportMore.open = false;
      return;
    }

    meetingReportMore.hidden = false;
    meetingReportMoreSummary.textContent = hasEstimateText
      ? `핵심 7개 외에도 추가로 ${extraItems.length}개를 더 확인할 수 있습니다. 업체 답변이 애매하거나 시간 여유가 있을 때 이어서 보시면 됩니다.`
      : `핵심 7개 외에도 현재 조건 기준으로 ${extraItems.length}개를 더 확인할 수 있습니다. 견적서 텍스트를 붙여넣으면 추가 항목도 더 정교해집니다.`;

    extraItems.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "meeting-report-item";
      card.innerHTML = `
        <div class="meeting-report-head">
          <span class="meeting-report-rank">${index + 8}</span>
          <span class="meeting-report-category">${escapeHtml(item.category)}</span>
        </div>
        <h3 class="meeting-report-title">${escapeHtml(item.title)}</h3>
        <p class="meeting-report-copy">${escapeHtml(item.copy)}</p>
        <p class="meeting-report-ask">${escapeHtml(item.ask)}</p>
      `;
      meetingReportMoreList.appendChild(card);
    });
  }

  function renderAll() {
    processNames.forEach(ensureReferenceSelection);
    renderProcessGrid();
    renderQuestions();
    renderOmissionChecklist();
    renderSelectionSummary();
    renderAuditSummary();
    updateEstimate();
  }

  function syncPyeongFromRange() {
    pyeongInput.value = pyeongRange.value;
    updateEstimate();
  }

  function syncPyeongFromInput() {
    updateEstimate();
  }

  pyeongRange.addEventListener("input", syncPyeongFromRange);
  pyeongInput.addEventListener("input", syncPyeongFromInput);
  quoteTotalInput.addEventListener("input", updateEstimate);
  estimateTextInput?.addEventListener("input", () => {
    renderOmissionChecklist();
    renderMeetingReport();
  });

  renderAll();
})();
