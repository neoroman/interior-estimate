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
  const hiddenCheckSummary = document.getElementById("hidden-check-summary");
  const hiddenCheckList = document.getElementById("hidden-check-list");
  const measurementCheckSummary = document.getElementById("measurement-check-summary");
  const measurementCheckList = document.getElementById("measurement-check-list");
  const pyeongRange = document.getElementById("pyeong-range");
  const pyeongInput = document.getElementById("pyeong-input");
  const quoteTotalInput = document.getElementById("quote-total");
  const estimateTextInput = document.getElementById("estimate-text");
  const estimateRange = document.getElementById("estimate-range");
  const estimateDetail = document.getElementById("estimate-detail");
  const verdictBadge = document.getElementById("verdict-badge");
  const verdictCopy = document.getElementById("verdict-copy");
  const specFocusList = document.getElementById("spec-focus-list");
  const specSearchInput = document.getElementById("spec-search-input");
  const specFilterActive = document.getElementById("spec-filter-active");
  const specGlossarySummary = document.getElementById("spec-glossary-summary");
  const specGlossaryList = document.getElementById("spec-glossary-list");
  const simCurrentTotal = document.getElementById("sim-current-total");
  const simNextTotal = document.getElementById("sim-next-total");
  const simDeltaTotal = document.getElementById("sim-delta-total");
  const simDeltaCopy = document.getElementById("sim-delta-copy");
  const simRecommendationList = document.getElementById("sim-recommendation-list");
  const simScenarioList = document.getElementById("sim-scenario-list");
  const simScriptList = document.getElementById("sim-script-list");
  const menuTabButtons = Array.from(document.querySelectorAll("[data-menu-tab]"));
  const menuTabPanels = Array.from(document.querySelectorAll("[data-menu-panel]"));
  const MENU_TAB_STORAGE_KEY = "interier-active-menu-tab";

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
  const simulationChoices = Object.fromEntries(
    processNames.map((processName) => [processName, "keep"])
  );
  const glossaryEntries = Array.isArray(window.specGlossary) ? window.specGlossary : [];
  const hiddenConstructionChecklist = Array.isArray(window.hiddenConstructionChecklist)
    ? window.hiddenConstructionChecklist
    : [];
  const measurementChecklist = Array.isArray(window.measurementChecklist)
    ? window.measurementChecklist
    : [];

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

  function activateMenuTab(tabName, options = {}) {
    if (!menuTabButtons.length || !menuTabPanels.length) {
      return;
    }

    const { focus = false } = options;
    const nextTab = menuTabButtons.find((button) => button.dataset.menuTab === tabName)
      ? tabName
      : menuTabButtons[0]?.dataset.menuTab;

    if (!nextTab) {
      return;
    }

    menuTabButtons.forEach((button) => {
      const isActive = button.dataset.menuTab === nextTab;
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
      if (isActive && focus) {
        button.focus();
      }
    });

    menuTabPanels.forEach((panel) => {
      panel.hidden = panel.dataset.menuPanel !== nextTab;
    });

    try {
      window.localStorage.setItem(MENU_TAB_STORAGE_KEY, nextTab);
    } catch (error) {
      // Ignore storage failures in private mode or embedded browsers.
    }
  }

  function moveMenuTabFocus(currentTabName, direction) {
    const currentIndex = menuTabButtons.findIndex(
      (button) => button.dataset.menuTab === currentTabName
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + direction + menuTabButtons.length) % menuTabButtons.length;
    const nextButton = menuTabButtons[nextIndex];
    activateMenuTab(nextButton.dataset.menuTab, { focus: true });
  }

  function initMenuTabs() {
    if (!menuTabButtons.length || !menuTabPanels.length) {
      return;
    }

    menuTabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activateMenuTab(button.dataset.menuTab, { focus: false });
      });

      button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveMenuTabFocus(button.dataset.menuTab, 1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveMenuTabFocus(button.dataset.menuTab, -1);
        } else if (event.key === "Home") {
          event.preventDefault();
          activateMenuTab(menuTabButtons[0].dataset.menuTab, { focus: true });
        } else if (event.key === "End") {
          event.preventDefault();
          activateMenuTab(menuTabButtons[menuTabButtons.length - 1].dataset.menuTab, {
            focus: true,
          });
        }
      });
    });

    let initialTab = menuTabButtons[0].dataset.menuTab;
    try {
      const storedTab = window.localStorage.getItem(MENU_TAB_STORAGE_KEY);
      if (storedTab) {
        initialTab = storedTab;
      }
    } catch (error) {
      // Ignore storage failures in private mode or embedded browsers.
    }

    activateMenuTab(initialTab);
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

  function getReferenceMidpoint(reference) {
    return (reference.priceMin + reference.priceMax) / 2;
  }

  function getGradeIndex(gradeKey) {
    return GRADE_ORDER.indexOf(gradeKey);
  }

  function getGradeLabel(gradeKey) {
    return GRADE_DISPLAY[gradeKey] || gradeKey;
  }

  function getReferenceForGrade(processName, gradeKey) {
    const grade = window.prices[processName].grades[gradeKey];
    const references = grade.references || [];
    const currentIndex = Number(selectedReferenceIndex[processName]);
    if (references.length === 0) {
      return null;
    }
    const safeIndex =
      Number.isInteger(currentIndex) && currentIndex >= 0 && currentIndex < references.length
        ? currentIndex
        : 0;
    return references[safeIndex] || references[0];
  }

  function ensureSimulationChoice(processName) {
    const currentChoice = simulationChoices[processName];
    const gradeKey = selectedGrades[processName];
    const gradeIndex = getGradeIndex(gradeKey);

    if (!enabledProcesses[processName]) {
      return "off";
    }

    if (currentChoice === "down" && gradeIndex <= 0) {
      simulationChoices[processName] = "keep";
      return "keep";
    }

    if (!["keep", "down", "off"].includes(currentChoice)) {
      simulationChoices[processName] = "keep";
      return "keep";
    }

    return currentChoice;
  }

  function getSimulationOutcome(processName) {
    const currentGradeKey = selectedGrades[processName];
    const currentReference = getActiveReference(processName);
    const action = ensureSimulationChoice(processName);
    const currentMid = getReferenceMidpoint(currentReference);

    if (action === "off") {
      return {
        action,
        processName,
        nextGradeKey: null,
        nextReference: null,
        currentMid,
        nextMid: 0,
        deltaPerPyeong: -currentMid,
        label: "제외 검토",
        copy: "이 공정을 이번 범위에서 빼거나, 다른 공사와 분리 발주하는 시나리오입니다.",
      };
    }

    if (action === "down") {
      const nextGradeKey = GRADE_ORDER[Math.max(getGradeIndex(currentGradeKey) - 1, 0)];
      const nextReference = getReferenceForGrade(processName, nextGradeKey);
      const nextMid = nextReference ? getReferenceMidpoint(nextReference) : currentMid;

      return {
        action,
        processName,
        nextGradeKey,
        nextReference,
        currentMid,
        nextMid,
        deltaPerPyeong: nextMid - currentMid,
        label: "한 단계 낮추기",
        copy: `${getGradeLabel(currentGradeKey)}에서 ${getGradeLabel(nextGradeKey)}으로 조정하는 시나리오입니다.`,
      };
    }

    return {
      action,
      processName,
      nextGradeKey: currentGradeKey,
      nextReference: currentReference,
      currentMid,
      nextMid: currentMid,
      deltaPerPyeong: 0,
      label: "유지",
      copy: "현재 선택한 등급과 세부 기준을 그대로 유지합니다.",
    };
  }

  function buildSimulationOptions(processName) {
    const options = [
      { value: "keep", label: "유지" },
    ];

    if (getGradeIndex(selectedGrades[processName]) > 0) {
      options.push({ value: "down", label: "한 단계 낮추기" });
    }

    options.push({ value: "off", label: "제외 검토" });
    return options;
  }

  function getDefaultRecommendation(processName) {
    const currentGradeKey = selectedGrades[processName];
    const currentReference = getActiveReference(processName);
    const currentMid = getReferenceMidpoint(currentReference);

    const downgradeGradeKey = GRADE_ORDER[Math.max(getGradeIndex(currentGradeKey) - 1, 0)];
    const downgradeReference =
      downgradeGradeKey === currentGradeKey
        ? currentReference
        : getReferenceForGrade(processName, downgradeGradeKey);
    const downgradeMid = downgradeReference ? getReferenceMidpoint(downgradeReference) : currentMid;

    const downgradeDelta = downgradeMid - currentMid;
    const offDelta = -currentMid;

    if (downgradeDelta < 0) {
      return {
        processName,
        action: "down",
        nextGradeKey: downgradeGradeKey,
        nextReference: downgradeReference,
        deltaPerPyeong: downgradeDelta,
      };
    }

    return {
      processName,
      action: "off",
      nextGradeKey: null,
      nextReference: null,
      deltaPerPyeong: offDelta,
    };
  }

  function getRecommendationAsk(entry) {
    if (entry.action === "off") {
      return `${entry.processName} 공정을 이번 범위에서 빼면 어떤 하자나 공백이 생기는지, 분리 발주도 가능한지 설명해주세요.`;
    }

    return `${entry.processName}을 ${getGradeLabel(selectedGrades[entry.processName])}에서 ${getGradeLabel(
      entry.nextGradeKey
    )}으로 낮추면 빠지는 스펙과 절감액을 항목별로 적어주세요.`;
  }

  function getGlossaryMatches(processName) {
    return glossaryEntries.filter((entry) =>
      (entry.relatedProcesses || []).includes(processName)
    );
  }

  function getPrimaryGlossaryProcess(entry) {
    const related = Array.isArray(entry.relatedProcesses) ? entry.relatedProcesses : [];
    const firstKnown = related.find((processName) => processNames.includes(processName));
    return firstKnown || "공통";
  }

  function buildGlossaryGroups(entries, activeProcesses, activeOnly) {
    const groupOrder = activeOnly && activeProcesses.length > 0
      ? [...activeProcesses, "공통"]
      : [...processNames, "공통"];
    const groupMap = new Map(groupOrder.map((name) => [name, []]));

    entries.forEach((entry) => {
      const primaryProcess = getPrimaryGlossaryProcess(entry);
      if (!groupMap.has(primaryProcess)) {
        groupMap.set(primaryProcess, []);
      }
      groupMap.get(primaryProcess).push(entry);
    });

    return groupOrder
      .map((name) => ({
        processName: name,
        entries: (groupMap.get(name) || []).sort((a, b) => a.term.localeCompare(b.term, "ko")),
      }))
      .filter((group) => group.entries.length > 0);
  }

  function getRoomPriority(room, activeProcesses) {
    const roomProcessMap = {
      현관: ["목공", "필름", "전기/조명", "마감"],
      거실: ["전기/조명", "목공", "마루/장판", "도배", "창호"],
      주방: ["가구", "전기/조명", "설비/방수", "타일", "마감"],
      욕실: ["욕실", "타일", "설비/방수", "도장", "마감"],
    };

    const relatedProcesses = roomProcessMap[room] || [];
    return relatedProcesses.reduce(
      (count, processName) => count + (activeProcesses.includes(processName) ? 1 : 0),
      0
    );
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

  function getChecklistBundle(processName) {
    const processData = window.prices[processName];
    const checklist = processData.missingChecklist || {};
    const gradeKey = selectedGrades[processName];

    return {
      common: [...(checklist.common || [])],
      gradeSpecific: [...(checklist[gradeKey] || [])],
    };
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
      const checklist = getChecklistBundle(processName);
      const items = checklist.common;
      const gradeSpecificItems = checklist.gradeSpecific;
      const relatedChecks = getRelatedProcessChecks(processName);

      if (items.length === 0 && relatedChecks.length === 0 && gradeSpecificItems.length === 0) {
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

      if (relatedChecks.length > 0 && (items.length > 0 || gradeSpecificItems.length > 0)) {
        const divider = document.createElement("li");
        divider.className = "omission-section-label";
        divider.textContent = "기본 체크포인트";
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

      if (gradeSpecificItems.length > 0) {
        const divider = document.createElement("li");
        divider.className = "omission-section-label";
        divider.textContent = "등급 선택 시 추가 힌트";
        list.appendChild(divider);

        gradeSpecificItems.forEach((item) => {
          const row = document.createElement("li");
          row.className = "omission-item omission-item-soft";
          row.innerHTML = `
            <div class="omission-item-head">
              <span class="omission-item-title">${escapeHtml(item.label)}</span>
              <span class="omission-badge omission-pending">참고</span>
            </div>
            <div class="omission-item-copy">${escapeHtml(item.note)}</div>
          `;
          list.appendChild(row);
        });
      }

      processGroup.appendChild(head);
      processGroup.appendChild(list);
      omissionList.appendChild(processGroup);
    });

    if (!normalizedEstimateText) {
      omissionSummaryCopy.textContent = `선택한 ${activeProcesses.length}개 공정 기준으로 ${totalItems}개 기본 체크포인트를 정리했습니다. 등급을 몰라도 먼저 공정 기준으로 확인할 수 있고, 등급별 항목은 아래에 참고 힌트로만 보여줍니다.`;
      return;
    }

    omissionSummaryCopy.textContent = `붙여넣은 견적서 기준 ${totalItems}개 체크포인트 중 ${foundItems}개 확인, ${missingItems}개 누락 의심입니다. 누락 의심 항목은 포함 여부를 다시 물어보는 편이 안전합니다.`;
  }

  function renderSpecFocus() {
    if (!specFocusList) {
      return;
    }

    specFocusList.innerHTML = "";

    const activeProcesses = getActiveProcessNames();
    if (activeProcesses.length === 0) {
      specFocusList.innerHTML =
        '<div class="spec-empty">공정을 하나 이상 선택하면 현재 기준에서 먼저 이해해야 할 스펙과 용어를 자동으로 묶어서 보여줍니다.</div>';
      return;
    }

    activeProcesses.forEach((processName) => {
      const grade = getActiveGrade(processName);
      const reference = getActiveReference(processName);
      const glossary = getGlossaryMatches(processName).slice(0, 4);
      const card = document.createElement("details");
      card.className = "spec-focus-card";
      card.open = activeProcesses.length <= 2;
      const glossaryMarkup =
        glossary.length === 0
          ? '<li><span class="spec-key-label">꼭 알아둘 용어</span><span class="spec-key-value">관련 용어 준비 중</span></li>'
          : glossary
              .map(
                (entry) => `
                  <li>
                    <span class="spec-key-label">${escapeHtml(entry.term)}</span>
                    <span class="spec-key-value">${escapeHtml(entry.summary)}</span>
                  </li>
                `
              )
              .join("");

      card.innerHTML = `
        <summary class="spec-focus-head">
          <div>
            <h3 class="spec-focus-title">${escapeHtml(processName)}</h3>
            <p class="spec-focus-meta">${escapeHtml(
              `${grade.label} · ${getReferenceLabel(reference)} / ${reference.spec}`
            )}</p>
          </div>
          <span class="spec-badge">현재 기준</span>
        </summary>
        <div class="spec-section">
          <h4 class="spec-section-title">핵심 스펙</h4>
          <ul class="spec-focus-points">
            <li><span class="spec-key-label">규격 요약</span><span class="spec-key-value">${escapeHtml(reference.specSummary)}</span></li>
            <li><span class="spec-key-label">대표 기준</span><span class="spec-key-value">${escapeHtml(reference.spec)}</span></li>
            <li><span class="spec-key-label">비용 범위</span><span class="spec-key-value">${escapeHtml(
              `${formatWon(reference.priceMin)} ~ ${formatWon(reference.priceMax)} / 평`
            )}</span></li>
          </ul>
        </div>
        <div class="spec-section">
          <h4 class="spec-section-title">이 공정에서 자주 나오는 용어</h4>
          <ul class="spec-focus-points spec-focus-glossary">${glossaryMarkup}</ul>
        </div>
        <div class="spec-section">
          <h4 class="spec-section-title">미리 확인할 포인트</h4>
          <ul class="spec-focus-points">
            <li><span class="spec-key-label">포함</span><span class="spec-key-value">${escapeHtml(grade.includes)}</span></li>
            <li><span class="spec-key-label">제외</span><span class="spec-key-value">${escapeHtml(grade.excludes)}</span></li>
          </ul>
        </div>
      `;
      specFocusList.appendChild(card);
    });
  }

  function renderHiddenConstructionChecks() {
    if (!hiddenCheckList || !hiddenCheckSummary) {
      return;
    }

    hiddenCheckList.innerHTML = "";

    const activeProcesses = getActiveProcessNames();
    const orderedRooms = [...hiddenConstructionChecklist].sort((a, b) => {
      const priorityDiff =
        getRoomPriority(b.room, activeProcesses) - getRoomPriority(a.room, activeProcesses);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return 0;
    });

    hiddenCheckSummary.textContent =
      activeProcesses.length === 0
        ? "공정 선택과 상관없이 자주 놓치는 항목을 공간별로 확인할 수 있습니다."
        : `현재 선택한 공정과 가까운 공간을 먼저 보여줍니다. 상담 전에 ${orderedRooms.length}개 공간 체크리스트를 훑어보세요.`;

    orderedRooms.forEach((section) => {
      const card = document.createElement("article");
      card.className = "hidden-check-room";

      const priority = getRoomPriority(section.room, activeProcesses);
      const badgeLabel = priority > 0 ? "현재 공정 연관" : "공통 체크";
      const itemsMarkup = section.items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      card.innerHTML = `
        <div class="hidden-check-head">
          <div>
            <h3>${escapeHtml(section.room)}</h3>
            <p>${escapeHtml(section.summary)}</p>
          </div>
          <span class="hidden-check-badge">${escapeHtml(badgeLabel)}</span>
        </div>
        <ol class="hidden-check-items">${itemsMarkup}</ol>
      `;

      hiddenCheckList.appendChild(card);
    });
  }

  function getMeasurementPriority(room, activeProcesses) {
    const roomProcessMap = {
      "공통 준비": processNames,
      현관: ["목공", "필름", "전기/조명", "마감"],
      거실: ["전기/조명", "목공", "마루/장판", "도배", "창호", "시스템에어컨"],
      주방: ["가구", "전기/조명", "설비/방수", "타일", "마감"],
      "침실·붙박이장": ["가구", "목공", "도배", "전기/조명", "창호", "시스템에어컨"],
      욕실: ["욕실", "타일", "설비/방수", "전기/조명", "마감"],
      "발코니·다용도실": ["도장", "설비/방수", "마감", "가구"],
      "창호·설비 포인트": ["창호", "설비/방수", "전기/조명", "시스템에어컨"],
    };

    const relatedProcesses = roomProcessMap[room] || [];
    return relatedProcesses.reduce(
      (count, processName) => count + (activeProcesses.includes(processName) ? 1 : 0),
      0
    );
  }

  function renderMeasurementChecks() {
    if (!measurementCheckList || !measurementCheckSummary) {
      return;
    }

    measurementCheckList.innerHTML = "";

    const activeProcesses = getActiveProcessNames();
    const orderedSections = [...measurementChecklist].sort((a, b) => {
      const priorityDiff =
        getMeasurementPriority(b.room, activeProcesses) -
        getMeasurementPriority(a.room, activeProcesses);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return 0;
    });

    measurementCheckSummary.textContent =
      activeProcesses.length === 0
        ? "실측 전 준비물부터 공간별 핵심 치수까지, 현장에서 빠뜨리기 쉬운 항목을 먼저 확인하세요."
        : `현재 선택한 공정과 가까운 실측 항목을 먼저 보여줍니다. 현장에서 ${orderedSections.length}개 구역을 순서대로 체크해보세요.`;

    orderedSections.forEach((section) => {
      const card = document.createElement("article");
      card.className = "hidden-check-room";

      const priority = getMeasurementPriority(section.room, activeProcesses);
      const badgeLabel = priority > 0 ? "현재 공정 연관" : "실측 공통";
      const itemsMarkup = section.items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      card.innerHTML = `
        <div class="hidden-check-head">
          <div>
            <h3>${escapeHtml(section.room)}</h3>
            <p>${escapeHtml(section.summary)}</p>
          </div>
          <span class="hidden-check-badge">${escapeHtml(badgeLabel)}</span>
        </div>
        <ol class="hidden-check-items">${itemsMarkup}</ol>
      `;

      measurementCheckList.appendChild(card);
    });
  }

  function renderSpecGlossary() {
    if (!specGlossaryList || !specGlossarySummary) {
      return;
    }

    specGlossaryList.innerHTML = "";

    const search = normalizeText(specSearchInput?.value || "");
    const activeOnly = Boolean(specFilterActive?.checked);
    const activeProcesses = getActiveProcessNames();

    const filtered = glossaryEntries.filter((entry) => {
      const matchesActive =
        !activeOnly ||
        activeProcesses.length === 0 ||
        (entry.relatedProcesses || []).some((processName) =>
          activeProcesses.includes(processName)
        );

      const haystack = normalizeText(
        [entry.term, entry.category, entry.summary, entry.whyItMatters, entry.ask]
          .concat(entry.aliases || [])
          .join(" ")
      );
      const matchesSearch = search === "" || haystack.includes(search);

      return matchesActive && matchesSearch;
    });

    if (filtered.length === 0) {
      specGlossarySummary.textContent =
        "검색 결과가 없습니다. 다른 용어를 검색하거나, 선택 공정 필터를 꺼서 전체 사전을 확인해보세요.";
      specGlossaryList.innerHTML =
        '<div class="spec-empty">조건에 맞는 용어가 없습니다.</div>';
      return;
    }

    specGlossarySummary.textContent =
      activeOnly && activeProcesses.length > 0
        ? `선택한 ${activeProcesses.length}개 공정과 관련된 용어 ${filtered.length}개를 먼저 보여줍니다.`
        : `전체 용어 사전에서 ${filtered.length}개를 보여줍니다.`;

    const groups = buildGlossaryGroups(filtered, activeProcesses, activeOnly);

    groups.forEach((group) => {
      const section = document.createElement("details");
      section.className = "spec-glossary-group";
      section.open =
        (activeOnly && activeProcesses.includes(group.processName)) ||
        (!activeOnly && groups.length <= 2) ||
        group.processName === "공통";

      const titleCopy =
        group.processName === "공통"
          ? "여러 공정에서 같이 나오는 표현입니다."
          : `${group.processName} 견적을 볼 때 같이 확인하면 좋은 용어입니다.`;

      const cardsMarkup = group.entries
        .map(
          (entry) => `
            <article class="spec-glossary-card">
              <div class="spec-glossary-head">
                <div>
                  <h3 class="spec-glossary-title">${escapeHtml(entry.term)}</h3>
                  <p class="spec-glossary-meta">${escapeHtml(entry.category)} · 관련 공정 ${escapeHtml(
                    (entry.relatedProcesses || []).join(", ")
                  )}</p>
                </div>
                <span class="spec-badge">${escapeHtml(entry.category)}</span>
              </div>
              <ul class="spec-glossary-points">
                <li>무슨 뜻인지: ${escapeHtml(entry.summary)}</li>
                <li>왜 중요한지: ${escapeHtml(entry.whyItMatters)}</li>
                <li>${escapeHtml(entry.ask)}</li>
              </ul>
            </article>
          `
        )
        .join("");

      section.innerHTML = `
        <summary class="spec-group-head">
          <div>
            <h3 class="spec-group-title">${escapeHtml(group.processName)}</h3>
            <p class="spec-group-copy">${escapeHtml(titleCopy)}</p>
          </div>
          <span class="spec-group-count">${group.entries.length}개</span>
        </summary>
        <div class="spec-glossary-group-list">${cardsMarkup}</div>
      `;

      specGlossaryList.appendChild(section);
    });
  }

  function renderNegotiationSimulator() {
    if (
      !simCurrentTotal ||
      !simNextTotal ||
      !simDeltaTotal ||
      !simDeltaCopy ||
      !simRecommendationList ||
      !simScenarioList ||
      !simScriptList
    ) {
      return;
    }

    simRecommendationList.innerHTML = "";
    simScenarioList.innerHTML = "";
    simScriptList.innerHTML = "";

    const activeProcesses = getActiveProcessNames();
    const pyeong = clampPyeong(pyeongInput.value);

    if (activeProcesses.length === 0) {
      simCurrentTotal.textContent = "-";
      simNextTotal.textContent = "-";
      simDeltaTotal.textContent = "-";
      simDeltaTotal.className = "sim-amount";
      simDeltaCopy.textContent =
        "공정을 하나 이상 선택하면 등급 조정 시 절감 가능 금액을 계산합니다.";
      simRecommendationList.innerHTML =
        '<div class="sim-empty">공정을 선택하면 절감 효과가 큰 추천 협상안 3개를 먼저 보여줍니다.</div>';
      simScenarioList.innerHTML =
        '<div class="sim-empty">공정을 선택하면 공정별로 유지, 한 단계 낮추기, 제외 검토 시나리오를 조정할 수 있습니다.</div>';
      simScriptList.innerHTML =
        "<li>공정을 선택하면 바로 꺼내 쓸 협상 문장이 여기에 정리됩니다.</li>";
      return;
    }

    let currentTotal = 0;
    let nextTotal = 0;
    const changedItems = [];
    const scenarioEntries = [];

    activeProcesses.forEach((processName) => {
      const outcome = getSimulationOutcome(processName);
      const currentTotalWon = outcome.currentMid * pyeong;
      const nextTotalWon = outcome.nextMid * pyeong;
      const deltaWon = nextTotalWon - currentTotalWon;
      currentTotal += currentTotalWon;
      nextTotal += nextTotalWon;

      scenarioEntries.push({
        processName,
        outcome,
        currentTotalWon,
        nextTotalWon,
        deltaWon,
      });
    });

    const recommendationItems = activeProcesses
      .map((processName) => {
        const recommendation = getDefaultRecommendation(processName);
        return {
          ...recommendation,
          deltaWon: recommendation.deltaPerPyeong * pyeong,
        };
      })
      .filter((entry) => entry.deltaWon < 0)
      .sort((a, b) => a.deltaWon - b.deltaWon)
      .slice(0, 3);

    if (recommendationItems.length === 0) {
      simRecommendationList.innerHTML =
        '<div class="sim-empty">현재 선택 기준에서는 바로 절감으로 이어지는 추천 협상안이 아직 없습니다.</div>';
    } else {
      recommendationItems.forEach((entry, index) => {
        const currentReference = getActiveReference(entry.processName);
        const title =
          entry.action === "off"
            ? `${entry.processName} 공정 제외 검토`
            : `${entry.processName} ${getGradeLabel(selectedGrades[entry.processName])} → ${getGradeLabel(
                entry.nextGradeKey
              )}`;
        const copy =
          entry.action === "off"
            ? `${entry.processName} 공정을 이번 범위에서 빼거나 분리 발주하는 시나리오입니다. ${pyeong}평 기준 약 ${formatManwon(
                Math.abs(entry.deltaWon)
              )} 절감 가능성이 있습니다.`
            : `${getReferenceLabel(currentReference)} 기준에서 한 단계 낮추는 시나리오입니다. ${pyeong}평 기준 약 ${formatManwon(
                Math.abs(entry.deltaWon)
              )} 절감 가능성이 있습니다.`;

        const card = document.createElement("article");
        card.className = "sim-recommendation-card";
        card.innerHTML = `
          <div class="sim-recommendation-head">
            <span class="sim-recommendation-rank">${index + 1}</span>
            <span class="sim-badge">추천안</span>
          </div>
          <h3 class="sim-recommendation-title">${escapeHtml(title)}</h3>
          <p class="sim-recommendation-copy">${escapeHtml(copy)}</p>
          <p class="sim-recommendation-ask">${escapeHtml(getRecommendationAsk(entry))}</p>
        `;
        simRecommendationList.appendChild(card);
      });
    }

    scenarioEntries
      .sort((a, b) => {
        if (a.deltaWon !== b.deltaWon) {
          return a.deltaWon - b.deltaWon;
        }
        return a.processName.localeCompare(b.processName, "ko");
      })
      .forEach((entry) => {
        const { processName, outcome, deltaWon } = entry;

      const currentReference = getActiveReference(processName);
      const currentGradeKey = selectedGrades[processName];
      const card = document.createElement("article");
      card.className = "sim-scenario-card";

      const optionsMarkup = buildSimulationOptions(processName)
        .map((option) => {
          const selected = option.value === ensureSimulationChoice(processName) ? "selected" : "";
          return `<option value="${option.value}" ${selected}>${option.label}</option>`;
        })
        .join("");

      const nextLabel =
        outcome.action === "off"
          ? "이번 범위에서 제외 검토"
          : `${getGradeLabel(outcome.nextGradeKey)} · ${getReferenceLabel(outcome.nextReference)}`;

      card.innerHTML = `
        <div class="sim-scenario-head">
          <div>
            <h3 class="sim-scenario-title">${escapeHtml(processName)}</h3>
            <p class="sim-scenario-meta">현재 ${escapeHtml(
              `${getGradeLabel(currentGradeKey)} · ${getReferenceLabel(currentReference)}`
            )}</p>
          </div>
          <span class="sim-badge">${escapeHtml(outcome.label)}</span>
        </div>
        <div class="sim-scenario-body">
          <div class="sim-select-row">
            <label for="sim-choice-${processName}">시나리오</label>
            <select
              id="sim-choice-${processName}"
              class="sim-select"
              data-role="sim-choice"
              data-process="${processName}"
            >
              ${optionsMarkup}
            </select>
          </div>
          <div class="sim-scenario-stats">
            <div class="sim-stat">
              <span class="sim-stat-label">현재 기준</span>
              <div class="sim-stat-value">${escapeHtml(
                `${formatWon(currentReference.priceMin)} ~ ${formatWon(
                  currentReference.priceMax
                )} / 평`
              )}</div>
            </div>
            <div class="sim-stat">
              <span class="sim-stat-label">시뮬레이션 결과</span>
              <div class="sim-stat-value">${escapeHtml(nextLabel)}</div>
            </div>
          </div>
          <p class="sim-copy">${escapeHtml(
            `${outcome.copy} ${pyeong}평 기준 예상 차이는 ${
              deltaWon === 0
                ? "변동 없음"
                : `${deltaWon < 0 ? "-" : "+"}${formatManwon(Math.abs(deltaWon))}`
            }입니다.`
          )}</p>
        </div>
      `;
        simScenarioList.appendChild(card);

        if (outcome.action !== "keep") {
          changedItems.push({
            processName,
            outcome,
            currentReference,
            deltaWon,
          });
        }
      });

    const totalDelta = nextTotal - currentTotal;
    simCurrentTotal.textContent = formatManwon(currentTotal);
    simNextTotal.textContent = formatManwon(nextTotal);
    simDeltaTotal.textContent =
      totalDelta === 0
        ? "변동 없음"
        : `${totalDelta < 0 ? "-" : "+"}${formatManwon(Math.abs(totalDelta))}`;
    simDeltaTotal.className = "sim-amount";
    if (totalDelta < 0) {
      simDeltaTotal.classList.add("is-saving");
    } else if (totalDelta > 0) {
      simDeltaTotal.classList.add("is-costly");
    }

    simDeltaCopy.textContent =
      totalDelta < 0
        ? `현재 조건 대비 약 ${formatManwon(
            Math.abs(totalDelta)
          )} 절감 가능한 시나리오입니다. 절감폭이 큰 공정부터 실제 스펙 차이를 확인하세요.`
        : totalDelta > 0
          ? `현재 조건보다 약 ${formatManwon(
              totalDelta
            )} 증가하는 시나리오입니다. 업그레이드가 꼭 필요한지 근거를 받아두는 편이 안전합니다.`
          : "현재 선택 기준과 동일한 총액입니다. 한 단계 낮추기나 제외 검토를 적용하면 절감 차이를 바로 볼 수 있습니다.";

    if (changedItems.length === 0) {
      simScriptList.innerHTML =
        "<li>시나리오를 바꾸면 그 항목에 맞는 협상 문장이 자동으로 정리됩니다.</li>";
    } else {
      changedItems
        .sort((a, b) => Math.abs(b.deltaWon) - Math.abs(a.deltaWon))
        .forEach((entry) => {
          const item = document.createElement("li");
          const question = getRecommendationAsk({
            processName: entry.processName,
            action: entry.outcome.action,
            nextGradeKey: entry.outcome.nextGradeKey,
          });
          item.textContent = `${entry.processName}: ${question}`;
          simScriptList.appendChild(item);
        });
    }

    simScenarioList.querySelectorAll('[data-role="sim-choice"]').forEach((element) => {
      element.addEventListener("change", function (event) {
        const processName = event.target.dataset.process;
        simulationChoices[processName] = event.target.value;
        renderNegotiationSimulator();
      });
    });
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
    renderNegotiationSimulator();
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
    renderHiddenConstructionChecks();
    renderMeasurementChecks();
    renderSpecFocus();
    renderSpecGlossary();
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
  specSearchInput?.addEventListener("input", renderSpecGlossary);
  specFilterActive?.addEventListener("change", renderSpecGlossary);

  initMenuTabs();
  renderAll();
})();
