const prices = {
  "철거": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "부분 철거",
        priceMin: 50000,
        priceMax: 80000,
        includes: "가구·몰딩·도어 일부 해체, 기본 폐기물 처리",
        excludes: "전면 욕실 철거, 야간 작업, 엘리베이터 양중비",
      },
      mid: {
        label: "표준형",
        material: "전면 철거",
        priceMin: 80000,
        priceMax: 130000,
        includes: "전체 목공·바닥재·욕실 타일·도기 철거, 폐기물 처리",
        excludes: "엘리베이터 양중비, 야간 작업",
      },
      premium: {
        label: "고급형",
        material: "구조 변경 포함 철거",
        priceMin: 130000,
        priceMax: 200000,
        includes: "비내력 벽체 미장 철거, 중량 폐기물 처리 포함",
        excludes: "구조 보강 공사, 철거 후 미장 보수",
      },
    },
    questions: [
      "철거 범위가 부분인지 전면인지, 어떤 부위를 해체하는지 목록으로 알려주실 수 있나요?",
      "폐기물 운반·처리 비용이 모두 포함된 금액인가요?",
      "엘리베이터 사용 제한이나 양중 비용이 추가되나요?",
      "철거 후 바닥·벽면 보수 비용은 별도인가요?",
    ],
  },

  "설비/방수": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 배관 점검·방수 보수",
        priceMin: 50000,
        priceMax: 80000,
        includes: "누수 점검, 방수 부분 보수, 기존 배관 활용",
        excludes: "배관 위치 변경, 에어컨 배관, 미장 포함 방수",
      },
      mid: {
        label: "표준형",
        material: "배관 일부 변경·방수 신규 시공",
        priceMin: 80000,
        priceMax: 150000,
        includes: "욕실·발코니 방수 신규, 일부 수도 배관 변경, 미장 포함",
        excludes: "전면 배관 교체, 시스템 에어컨 배관",
      },
      premium: {
        label: "고급형",
        material: "전면 배관 교체·에어컨 배관 포함",
        priceMin: 150000,
        priceMax: 250000,
        includes: "전면 배관 재시공, 방수 전체, 에어컨 배관 공사",
        excludes: "시스템 에어컨 기기 구매, 미장 재시공",
      },
    },
    questions: [
      "방수 시공 범위(욕실 몇 개, 발코니 포함 여부)를 구체적으로 알려주실 수 있나요?",
      "방수 하자 보증 기간이 어떻게 되나요?",
      "시스템 에어컨 배관 비용이 포함된 금액인가요, 별도인가요?",
      "배관 위치 변경 여부와 미장 재시공 비용이 포함인지 확인해주세요.",
    ],
  },

  "창호": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 이중창(PL)",
        priceMin: 100000,
        priceMax: 150000,
        includes: "기본 이중창 교체, 창틀 마감",
        excludes: "방음 업그레이드, 발코니 내창·외창",
      },
      mid: {
        label: "표준형",
        material: "시스템창호(국산)",
        priceMin: 150000,
        priceMax: 250000,
        includes: "시스템창호 전면 교체, 내창·외창 포함",
        excludes: "3중 유리, 고급 하드웨어",
      },
      premium: {
        label: "고급형",
        material: "독일식·3중 시스템창호",
        priceMin: 250000,
        priceMax: 400000,
        includes: "3중 유리 시스템창호, 터닝도어 포함",
        excludes: "커스텀 사이즈 추가 비용",
      },
    },
    questions: [
      "창호 브랜드와 유리 사양(이중/3중, 로이유리 여부)을 알려주실 수 있나요?",
      "내창·외창·발코니창이 모두 포함된 금액인가요?",
      "터닝도어나 특수 형태 창호 비용이 별도로 추가되나요?",
      "창호 하자 보증 기간이 어떻게 되나요?",
    ],
  },

  "전기/조명": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 배선 정리·조명 교체",
        priceMin: 10000,
        priceMax: 20000,
        includes: "기존 배선 유지, 조명 기구 교체",
        excludes: "콘센트·스위치 위치 변경, 분전반 교체",
      },
      mid: {
        label: "표준형",
        material: "스위치·콘센트 위치 변경",
        priceMin: 20000,
        priceMax: 40000,
        includes: "일부 회로 조정, 분전반 교체, 콘센트 위치 변경",
        excludes: "전면 배선 재시공, 스마트홈 시스템",
      },
      premium: {
        label: "고급형",
        material: "전면 전기 개조",
        priceMin: 40000,
        priceMax: 80000,
        includes: "전면 배선 재시공, 스마트스위치, 분전반 교체",
        excludes: "조명 기구 고급 옵션, 스마트홈 기기 구매",
      },
    },
    questions: [
      "기존 배선을 유지하는지, 회로를 전면 재시공하는지 구분해주세요.",
      "분전반 교체 여부와 비용이 포함인지 확인해주세요.",
      "조명 기구 가격과 설치비가 분리되어 있나요?",
      "스마트 스위치·콘센트 설치 여부와 비용을 알려주세요.",
    ],
  },

  "목공": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 몰딩·도어 교체",
        priceMin: 100000,
        priceMax: 180000,
        includes: "전체 몰딩·걸레받이, 도어·문틀 교체",
        excludes: "천장 공사, 등박스, 가벽 신설",
      },
      mid: {
        label: "표준형",
        material: "천장·등박스·벽면 마감 포함",
        priceMin: 180000,
        priceMax: 300000,
        includes: "천장 목공, 등박스, 벽면 마감, 도어 포함",
        excludes: "TV 매립, 특수 마감재",
      },
      premium: {
        label: "고급형",
        material: "TV 매립·특수 목공 포함",
        priceMin: 300000,
        priceMax: 500000,
        includes: "TV 매립벽, 전면 특수 목공, 가벽 신설 포함",
        excludes: "대리석·고급 마감재 별도 옵션",
      },
    },
    questions: [
      "몰딩·걸레받이 자재가 MDF인지 원목인지, 마감 방법(필름/도장/래핑)을 알려주세요.",
      "천장 공사(기초 석고 포함)와 등박스가 포함된 금액인가요?",
      "TV 매립벽이나 가벽 신설이 포함인지, 별도 추가 비용인지 확인해주세요.",
      "도어·문틀 수량과 제품명을 견적서에 명시해주실 수 있나요?",
    ],
  },

  "타일": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "국산 저가 타일",
        priceMin: 99000,
        priceMax: 165000,
        includes: "욕실·현관·발코니 기본 시공비",
        excludes: "줄눈 업그레이드, 젠다이·니치 시공",
      },
      mid: {
        label: "표준형",
        material: "국산 중급 타일",
        priceMin: 165000,
        priceMax: 330000,
        includes: "욕실·현관·발코니·주방벽 타일 시공",
        excludes: "수입 타일 혼용, 특수 패턴",
      },
      premium: {
        label: "고급형",
        material: "수입·포세린 타일",
        priceMin: 330000,
        priceMax: 600000,
        includes: "전 구역 수입/포세린 타일, 줄눈 포함",
        excludes: "대형 타일 추가 가공비",
      },
    },
    questions: [
      "욕실·현관·발코니·주방 어느 구역까지 타일 시공이 포함된 금액인가요?",
      "벽과 바닥 타일이 모두 포함된 금액인가요?",
      "줄눈 마감과 코너 마감, 방수 후 재시공 비용도 포함인가요?",
      "타일 국산/수입 여부와 사이즈(mm)를 견적서에 적어주실 수 있나요?",
    ],
  },

  "욕실": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "저가 국산 도기·수전",
        priceMin: 50000,
        priceMax: 100000,
        includes: "변기·세면대·수전·환풍기·천장재 설치",
        excludes: "비데, 수납장, 욕조",
      },
      mid: {
        label: "표준형",
        material: "중급 도기·수전",
        priceMin: 100000,
        priceMax: 180000,
        includes: "변기·세면대·수전·비데·환풍기·수납장",
        excludes: "욕조, 샤워부스 고급 옵션",
      },
      premium: {
        label: "고급형",
        material: "고급 도기·수전·빌트인",
        priceMin: 180000,
        priceMax: 350000,
        includes: "브랜드 도기·수전·비데·샤워부스·수납장 풀셋",
        excludes: "욕조 (별도 옵션)",
      },
    },
    questions: [
      "욕실 도기(변기·세면대)와 수전 브랜드·등급을 알려주세요.",
      "비데·수납장·거울 등 집기가 모두 포함된 금액인가요?",
      "욕실 몇 개 기준의 견적인지, 추가 욕실 단가도 알려주세요.",
      "환풍기와 욕실 천장재(천장 마감)가 포함인가요?",
    ],
  },

  "필름": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 단색 필름",
        priceMin: 20000,
        priceMax: 35000,
        includes: "도어·문틀·현관문 필름 시공",
        excludes: "패턴 필름, 추가 벽면 시공",
      },
      mid: {
        label: "표준형",
        material: "중급 패턴·우드 필름",
        priceMin: 35000,
        priceMax: 60000,
        includes: "도어·문틀·목공 벽면 필름 마감",
        excludes: "고급 수입 필름, 리폼 범위 외 시공",
      },
      premium: {
        label: "고급형",
        material: "수입·고급 필름",
        priceMin: 60000,
        priceMax: 100000,
        includes: "전면 목공·도어·현관문 고급 필름 마감",
        excludes: "석재·유리 필름 별도 옵션",
      },
    },
    questions: [
      "필름 시공 범위(어느 표면)가 정확히 어디어디인지 목록으로 알려주세요.",
      "필름 브랜드와 제품명, 두께를 알려주실 수 있나요?",
      "현관문 필름 리폼이 포함된 금액인가요, 별도인가요?",
      "필름 하자 보증 기간이 어떻게 되나요?",
    ],
  },

  "도장": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 페인트 시공",
        priceMin: 15000,
        priceMax: 25000,
        includes: "발코니 기본 페인트 1~2회",
        excludes: "방수 탄성코트, 균열 보수, 전체 실내 도장",
      },
      mid: {
        label: "표준형",
        material: "탄성코트 시공",
        priceMin: 25000,
        priceMax: 45000,
        includes: "발코니 탄성코트 2회, 균열 보수 포함",
        excludes: "방수 등급 탄성코트, 전체 실내",
      },
      premium: {
        label: "고급형",
        material: "방수 탄성코트·특수 도장",
        priceMin: 45000,
        priceMax: 80000,
        includes: "방수 겸용 탄성코트 3회, 균열 전처리 포함",
        excludes: "실내 전체 도장 별도",
      },
    },
    questions: [
      "발코니만 시공인지, 실내 벽면 도장도 포함인지 범위를 알려주세요.",
      "탄성코트인지 일반 페인트인지, 몇 회 도포인지 확인해주세요.",
      "균열 보수와 전처리 비용이 포함된 금액인가요?",
      "방수 성능 보증 여부와 보증 기간을 알려주세요.",
    ],
  },

  "마루/장판": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "LPT·장판",
        priceMin: 30000,
        priceMax: 50000,
        includes: "기본 자재·시공비",
        excludes: "바닥 평탄화",
      },
      mid: {
        label: "표준형",
        material: "강마루",
        priceMin: 50000,
        priceMax: 80000,
        includes: "기본 자재·시공비",
        excludes: "몰딩 교체",
      },
      premium: {
        label: "고급형",
        material: "원목마루",
        priceMin: 100000,
        priceMax: 180000,
        includes: "기본 자재·시공비",
        excludes: "습도 관리 추가 공정",
      },
    },
    questions: [
      "장판, 강마루, 원목마루 중 어떤 자재인지 제품명까지 명시해주세요.",
      "걸레받이와 문선 마감 비용도 포함인가요?",
      "기존 바닥재 철거와 바닥 평탄화 비용은 별도인가요?",
      "등급을 한 단계 낮추면 평당 얼마가 줄어드나요?",
    ],
  },

  "도배": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "합지",
        priceMin: 15000,
        priceMax: 20000,
        includes: "기본 시공비",
        excludes: "기존 벽지 철거",
      },
      mid: {
        label: "표준형",
        material: "실크 벽지",
        priceMin: 20000,
        priceMax: 30000,
        includes: "기본 시공비",
        excludes: "전면 철거",
      },
      premium: {
        label: "고급형",
        material: "수입지·천연벽지",
        priceMin: 30000,
        priceMax: 60000,
        includes: "기본 시공비",
        excludes: "특수 패턴 추가 시공",
      },
    },
    questions: [
      "어떤 등급의 벽지를 사용하시나요? 합지, 실크, 수입지 중 무엇인가요?",
      "천장 도배도 포함인가요?",
      "기존 벽지 제거와 폐기 비용이 포함인가요?",
      "브랜드나 제품명까지 견적서에 적어주실 수 있나요?",
    ],
  },

  "가구": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "국산 저가 싱크대·기본 붙박이장",
        priceMin: 80000,
        priceMax: 150000,
        includes: "싱크대, 신발장 기본 설치",
        excludes: "냉장고장, 붙박이장, 상판 업그레이드",
      },
      mid: {
        label: "표준형",
        material: "중급 시스템 가구",
        priceMin: 150000,
        priceMax: 280000,
        includes: "싱크대·냉장고장·신발장·붙박이장 포함",
        excludes: "천연석 상판, 고급 철물",
      },
      premium: {
        label: "고급형",
        material: "고급 시스템 가구",
        priceMin: 280000,
        priceMax: 500000,
        includes: "전면 시스템 가구, 천연석 상판, 고급 철물 포함",
        excludes: "빌트인 가전 구매",
      },
    },
    questions: [
      "싱크대·붙박이장·신발장·냉장고장이 모두 포함된 금액인가요?",
      "싱크대 상판 자재(인조대리석, 천연석 등)가 무엇인지 알려주세요.",
      "브랜드와 제품명(카탈로그 번호)을 견적서에 명시해주실 수 있나요?",
      "가구 하자 보증 기간과 AS 방법을 알려주세요.",
    ],
  },

  "마감": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 실리콘·청소",
        priceMin: 10000,
        priceMax: 20000,
        includes: "마감 실리콘, 기본 입주청소",
        excludes: "줄눈 시공, 도어락·인터폰 교체",
      },
      mid: {
        label: "표준형",
        material: "줄눈·도어락·인터폰 포함",
        priceMin: 20000,
        priceMax: 35000,
        includes: "줄눈 마감, 도어락·인터폰 교체, 입주청소",
        excludes: "고급 도어락, 스마트 인터폰",
      },
      premium: {
        label: "고급형",
        material: "전문 줄눈·스마트 설비",
        priceMin: 35000,
        priceMax: 60000,
        includes: "전문 줄눈, 스마트 도어락·인터폰, 전문 청소",
        excludes: "스마트홈 연동 추가 기능",
      },
    },
    questions: [
      "줄눈 시공이 포함된 금액인가요? 줄눈 색상과 자재를 알려주세요.",
      "도어락과 인터폰 교체가 포함인가요? 제품 모델명을 알려주세요.",
      "입주청소 범위(에어컨 청소 포함 여부)를 알려주세요.",
      "마감 실리콘 하자 처리 방법과 보증 기간을 확인해주세요.",
    ],
  },

  "공과잡비": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 보양·경비",
        priceMin: 15000,
        priceMax: 30000,
        includes: "기본 보양 작업, 일반 경비",
        excludes: "행위허가 대행, 입주민 동의 대행",
      },
      mid: {
        label: "표준형",
        material: "허가 대행·입주민 동의 포함",
        priceMin: 30000,
        priceMax: 50000,
        includes: "행위허가 대행, 입주민 동의 대행, 보양 포함",
        excludes: "복잡한 구조 변경 허가",
      },
      premium: {
        label: "고급형",
        material: "복잡한 허가·특수 보양",
        priceMin: 50000,
        priceMax: 80000,
        includes: "구조 변경 허가 대행, 특수 보양, 전 과정 경비",
        excludes: "별도 법적 비용",
      },
    },
    questions: [
      "행위허가가 필요한 공사인가요? 허가 대행 비용이 포함인가요?",
      "입주민 동의 대행 비용이 포함된 금액인가요?",
      "보양 작업(바닥·벽·엘리베이터 보호) 범위가 어떻게 되나요?",
      "공과잡비 항목을 세부적으로 나열해서 견적서에 적어주실 수 있나요?",
    ],
  },

  "일반관리": {
    unit: "pyeong",
    grades: {
      low: {
        label: "보급형",
        material: "기본 보험·관리",
        priceMin: 20000,
        priceMax: 40000,
        includes: "산재·고용보험, 기본 현장 관리",
        excludes: "전문 감리, 기업이윤",
      },
      mid: {
        label: "표준형",
        material: "보험·감리·기업이윤 포함",
        priceMin: 40000,
        priceMax: 70000,
        includes: "산재·고용보험, 현장감리, 기업이윤",
        excludes: "독립 제3자 감리",
      },
      premium: {
        label: "고급형",
        material: "전문 감리·보험 완비",
        priceMin: 70000,
        priceMax: 120000,
        includes: "산재·고용보험 완비, 전문 감리, 기업이윤",
        excludes: "제3자 독립 감리 별도",
      },
    },
    questions: [
      "산재·고용보험이 실제로 가입된 상태인지 확인할 수 있나요?",
      "현장 감리가 전담인지, 겸임인지 알려주세요.",
      "기업이윤(마진)이 항목에 포함된 금액인가요, 따로 표기인가요?",
      "공사 중 사고 발생 시 보상 프로세스를 알려주세요.",
    ],
  },
};

const missingItemCatalog = {
  "철거": {
    common: [
      {
        label: "폐기물 처리",
        keywords: ["폐기물", "폐기물 처리", "폐기물 반출"],
        note: "철거 견적이면 보통 분리 표기되거나 포함 여부가 명확해야 합니다.",
      },
      {
        label: "양중비·사다리차",
        keywords: ["양중", "사다리차", "엘리베이터 사용료"],
        note: "고층·승강기 제한 현장은 추가비가 자주 붙습니다.",
      },
      {
        label: "철거 후 미장·보수",
        keywords: ["미장 보수", "철거 후 보수", "면정리"],
        note: "철거 뒤 바닥·벽면 보수가 빠지면 후속 공정에서 증액되기 쉽습니다.",
      },
    ],
  },
  "설비/방수": {
    common: [
      {
        label: "방수 범위",
        keywords: ["방수", "도막방수", "액방", "방수 공사"],
        note: "욕실·발코니 중 어디까지 방수하는지 보여야 합니다.",
      },
      {
        label: "배관 변경 범위",
        keywords: ["배관", "급수", "배수", "수도 배관"],
        note: "기존 배관 유지인지 일부 이동인지가 빠지면 비교가 어렵습니다.",
      },
      {
        label: "미장 복구",
        keywords: ["미장", "미장 복구", "방수 후 미장"],
        note: "방수만 있고 미장 복구가 없으면 별도 증액 가능성이 큽니다.",
      },
    ],
    premium: [
      {
        label: "시스템에어컨 배관",
        keywords: ["시스템 에어컨", "에어컨 배관", "냉매 배관"],
        note: "고급형 설비에서는 에어컨 배관 포함 여부를 같이 보는 편이 안전합니다.",
      },
    ],
  },
  "창호": {
    common: [
      {
        label: "유리 사양",
        keywords: ["로이", "복층유리", "3중", "24t", "26t"],
        note: "창호는 프레임보다 유리 사양 차이로 가격이 크게 갈립니다.",
      },
      {
        label: "내창·외창 범위",
        keywords: ["내창", "외창", "발코니창", "거실확장부"],
        note: "어느 창을 바꾸는지 빠지면 견적 총액만으로 비교가 안 됩니다.",
      },
      {
        label: "철거·양중 추가비",
        keywords: ["창호 철거", "사다리차", "양중", "철거비"],
        note: "창호는 시공비와 별개로 철거·양중이 추가되는 경우가 많습니다.",
      },
    ],
    premium: [
      {
        label: "터닝도어·고급 하드웨어",
        keywords: ["터닝도어", "하드웨어", "핸들"],
        note: "고급형은 도어와 하드웨어가 별도 옵션인지 확인이 필요합니다.",
      },
    ],
  },
  "전기/조명": {
    common: [
      {
        label: "분전반 교체 여부",
        keywords: ["분전반", "차단기"],
        note: "전기 견적에서 분전반 포함 여부는 총액 차이에 직접 영향을 줍니다.",
      },
      {
        label: "스위치·콘센트 수량",
        keywords: ["스위치", "콘센트", "lan", "tv선"],
        note: "브랜드만 있고 수량이 없으면 비교 근거가 약합니다.",
      },
      {
        label: "조명 기구 포함 여부",
        keywords: ["조명", "다운라이트", "간접조명"],
        note: "배선 공사만인지, 조명 기구값까지인지 분리 확인이 필요합니다.",
      },
    ],
  },
  "목공": {
    common: [
      {
        label: "도어·문틀 수량",
        keywords: ["도어", "문틀", "문선"],
        note: "목공은 수량 누락 시 업체별 비교가 가장 어려운 공정 중 하나입니다.",
      },
      {
        label: "천장·등박스 범위",
        keywords: ["천장", "등박스", "우물천장"],
        note: "천장 목공 유무에 따라 단가 차이가 큽니다.",
      },
      {
        label: "가벽·보강 공사",
        keywords: ["가벽", "보강", "매립", "tv 매립"],
        note: "기본 목공인지 특수 목공인지 가르는 핵심 항목입니다.",
      },
    ],
  },
  "타일": {
    common: [
      {
        label: "벽·바닥 구분",
        keywords: ["벽타일", "바닥타일", "벽 타일", "바닥 타일"],
        note: "욕실은 벽/바닥 포함 여부가 빠지면 누락 가능성이 큽니다.",
      },
      {
        label: "줄눈·코너 마감",
        keywords: ["줄눈", "매지", "코너", "마감"],
        note: "타일은 시공 뒤 마감 항목이 빠져 있으면 추가비로 이어집니다.",
      },
      {
        label: "젠다이·니치·가공비",
        keywords: ["젠다이", "니치", "가공비", "타일 가공"],
        note: "고객이 원하는 욕실 디테일이 있으면 이 항목이 자주 별도 처리됩니다.",
      },
    ],
  },
  "욕실": {
    common: [
      {
        label: "양변기·세면대·수전",
        keywords: ["양변기", "세면대", "수전", "샤워수전"],
        note: "욕실 기본 집기는 모델명까지 잡혀야 비교가 가능합니다.",
      },
      {
        label: "환풍기·천장재",
        keywords: ["환풍기", "욕실 천장", "천장재"],
        note: "기본 패키지 견적에서도 빠지면 나중에 별도 청구되기 쉽습니다.",
      },
      {
        label: "수납장·거울",
        keywords: ["수납장", "장", "거울", "플랩장"],
        note: "집기류는 도기보다 누락되기 쉬운 항목입니다.",
      },
    ],
    mid: [
      {
        label: "비데",
        keywords: ["비데"],
        note: "표준형 이상 욕실은 비데 포함 여부를 같이 확인하는 편이 일반적입니다.",
      },
    ],
    premium: [
      {
        label: "샤워부스",
        keywords: ["샤워부스", "파티션"],
        note: "고급형 욕실은 샤워 공간 사양이 별도인지 확인이 필요합니다.",
      },
    ],
  },
  "필름": {
    common: [
      {
        label: "시공 범위",
        keywords: ["문틀", "도어", "현관문", "필름 시공"],
        note: "필름은 어디를 붙이는지 면적·수량이 빠지기 쉽습니다.",
      },
      {
        label: "필름 브랜드·제품명",
        keywords: ["lg", "lx", "현대l&c", "필름"],
        note: "필름은 같은 '화이트'라도 브랜드에 따라 내구성과 단가 차이가 큽니다.",
      },
      {
        label: "하자 보수 기준",
        keywords: ["as", "하자", "보수"],
        note: "들뜸·모서리 까짐 대응 기준을 같이 받아두는 편이 안전합니다.",
      },
    ],
  },
  "도장": {
    common: [
      {
        label: "도장 범위",
        keywords: ["발코니", "실내", "도장", "탄성코트"],
        note: "발코니만인지, 실내 벽면까지인지 구분돼야 합니다.",
      },
      {
        label: "균열 보수",
        keywords: ["균열", "크랙", "보수"],
        note: "전처리 없이 도장만 잡혀 있으면 품질 이슈가 생기기 쉽습니다.",
      },
      {
        label: "도포 횟수",
        keywords: ["1회", "2회", "3회", "도포"],
        note: "탄성코트와 일반 페인트는 회수 기준이 빠지면 비교가 불안정합니다.",
      },
    ],
  },
  "마루/장판": {
    common: [
      {
        label: "바닥재 제품명",
        keywords: ["강마루", "장판", "원목마루", "바닥재"],
        note: "바닥재 종류와 제품 라인이 보이지 않으면 등급 판정이 어렵습니다.",
      },
      {
        label: "바닥 평탄화",
        keywords: ["평탄화", "바닥 면정리", "샌딩"],
        note: "기존 바닥 상태가 나쁘면 평탄화 비용이 따로 붙는 경우가 많습니다.",
      },
      {
        label: "걸레받이·문선 마감",
        keywords: ["걸레받이", "문선", "몰딩"],
        note: "바닥재만 있고 주변 마감이 빠지면 완성 견적이 아닐 수 있습니다.",
      },
    ],
  },
  "도배": {
    common: [
      {
        label: "벽지 제품명",
        keywords: ["벽지", "실크", "합지", "lx", "did"],
        note: "도배는 브랜드·제품 코드가 보여야 자재 수준을 판별할 수 있습니다.",
      },
      {
        label: "천장 포함 여부",
        keywords: ["천장", "천정"],
        note: "천장 도배가 빠져 있으면 평당 단가가 지나치게 낮아 보일 수 있습니다.",
      },
      {
        label: "기존 벽지 철거·폐기",
        keywords: ["벽지 철거", "기존 벽지 제거", "폐기"],
        note: "도배 시공비만 있고 철거가 누락되면 추가비 가능성이 큽니다.",
      },
    ],
  },
  "가구": {
    common: [
      {
        label: "상판 재질",
        keywords: ["상판", "인조대리석", "천연석", "스노우라인"],
        note: "가구는 도어보다 상판 차이로 금액 편차가 크게 벌어집니다.",
      },
      {
        label: "싱크볼·수전·후드",
        keywords: ["싱크볼", "수전", "후드"],
        note: "주방 집기는 본체 가구와 분리 청구되는 경우가 많습니다.",
      },
      {
        label: "붙박이장·신발장 범위",
        keywords: ["붙박이장", "신발장", "냉장고장"],
        note: "가구는 어떤 장이 포함인지 분리돼 있어야 누락을 줄일 수 있습니다.",
      },
    ],
  },
  "마감": {
    common: [
      {
        label: "실리콘·줄눈",
        keywords: ["실리콘", "줄눈", "매지"],
        note: "마감 공정은 사소해 보여도 최종 완성도와 하자에 직결됩니다.",
      },
      {
        label: "도어락·인터폰",
        keywords: ["도어락", "인터폰", "월패드"],
        note: "교체 항목이 있으면 모델명 또는 기본형 여부를 받아두는 편이 좋습니다.",
      },
      {
        label: "입주청소",
        keywords: ["입주청소", "준공청소", "청소"],
        note: "청소 범위가 없으면 준공 후 별도 비용이 생기기 쉽습니다.",
      },
    ],
  },
  "공과잡비": {
    common: [
      {
        label: "보양 작업",
        keywords: ["보양", "엘리베이터 보양", "바닥 보양"],
        note: "공용부 보호 범위가 빠지면 현장 추가비나 민원 리스크가 생깁니다.",
      },
      {
        label: "행위허가·입주민 동의",
        keywords: ["행위허가", "입주민 동의", "허가 대행"],
        note: "아파트 공사는 허가 대행 여부가 비용 구조에 영향을 줍니다.",
      },
      {
        label: "경비·공용부 사용료",
        keywords: ["경비", "관리비", "공용부 사용"],
        note: "경비성 비용이 묶여 있으면 다른 항목으로 숨기기 쉽습니다.",
      },
    ],
  },
  "일반관리": {
    common: [
      {
        label: "산재·고용보험",
        keywords: ["산재", "고용보험", "보험"],
        note: "관리 항목에서 보험 가입 여부는 계약 리스크와 직결됩니다.",
      },
      {
        label: "현장감리",
        keywords: ["감리", "현장 관리", "현장감리"],
        note: "누가 현장을 관리하는지 빠지면 품질 관리 기준이 흐려집니다.",
      },
      {
        label: "기업이윤·관리비",
        keywords: ["기업이윤", "관리비", "마진"],
        note: "일반관리비는 왜 붙는지 설명이 있어야 납득 가능한 항목입니다.",
      },
    ],
  },
};

const processDependencyCatalog = {
  "철거": [
    {
      process: "공과잡비",
      label: "보양·공용부 보호",
      keywords: ["보양", "엘리베이터 보양", "공용부 사용"],
      note: "철거가 들어가면 보통 보양과 공용부 사용 관련 비용이 같이 검토됩니다.",
    },
  ],
  "설비/방수": [
    {
      process: "철거",
      label: "철거",
      keywords: ["철거", "철거비", "철거 공사"],
      note: "배관 이동이나 방수 재시공이면 기존 마감 철거가 먼저 잡히는 경우가 많습니다.",
    },
    {
      process: "타일",
      label: "타일 복구",
      keywords: ["타일", "벽타일", "바닥타일"],
      note: "욕실·발코니 방수 후에는 타일 복구 공정이 같이 잡히는 경우가 일반적입니다.",
    },
  ],
  "창호": [
    {
      process: "철거",
      label: "기존 창호 철거",
      keywords: ["창호 철거", "철거비", "철거"],
      note: "창호 교체 견적이면 기존 창 철거와 반출 비용을 같이 확인해야 합니다.",
    },
    {
      process: "공과잡비",
      label: "양중·사다리차",
      keywords: ["양중", "사다리차", "공용부 사용"],
      note: "창호는 양중과 공용부 사용 비용이 별도 줄로 빠지는 경우가 많습니다.",
    },
  ],
  "전기/조명": [
    {
      process: "목공",
      label: "천장·매립 목공",
      keywords: ["등박스", "천장", "매립"],
      note: "간접조명이나 매립 조명이 있으면 천장 목공이 같이 필요한 경우가 많습니다.",
    },
  ],
  "목공": [
    {
      process: "필름",
      label: "문틀·도어 필름",
      keywords: ["필름", "문틀", "도어"],
      note: "목공으로 문틀·몰딩을 만지면 필름이나 도장 마감이 같이 들어가는 경우가 많습니다.",
    },
    {
      process: "도장",
      label: "목공 후 도장",
      keywords: ["도장", "페인트", "래핑"],
      note: "필름 대신 도장 마감을 잡는 현장도 많아서 마감 공정 확인이 필요합니다.",
    },
  ],
  "타일": [
    {
      process: "설비/방수",
      label: "방수·설비",
      keywords: ["방수", "배관", "설비"],
      note: "욕실·발코니 타일이면 방수와 배관 범위가 같이 잡혀야 비교가 됩니다.",
    },
    {
      process: "마감",
      label: "줄눈·실리콘 마감",
      keywords: ["줄눈", "실리콘", "코너 마감"],
      note: "타일 시공 뒤 줄눈과 실리콘 마감이 별도 누락되는 경우가 자주 있습니다.",
    },
  ],
  "욕실": [
    {
      process: "설비/방수",
      label: "욕실 방수·배관",
      keywords: ["방수", "배관", "설비"],
      note: "욕실 견적이면 방수와 배관 변경 범위가 같이 보이는 편이 안전합니다.",
    },
    {
      process: "타일",
      label: "욕실 타일",
      keywords: ["타일", "벽타일", "바닥타일"],
      note: "욕실 패키지라도 타일 범위가 빠지면 실제 총액 비교가 어렵습니다.",
    },
    {
      process: "마감",
      label: "욕실 마감",
      keywords: ["실리콘", "줄눈", "마감"],
      note: "욕실은 최종 줄눈·실리콘 마감까지 포함 여부를 같이 확인하는 편이 좋습니다.",
    },
  ],
  "필름": [
    {
      process: "목공",
      label: "바탕 목공 상태",
      keywords: ["목공", "문틀", "몰딩"],
      note: "필름은 바탕 상태 영향을 크게 받아서 목공 보수 범위와 같이 보아야 합니다.",
    },
  ],
  "도장": [
    {
      process: "목공",
      label: "바탕 보수·퍼티",
      keywords: ["목공", "퍼티", "면정리"],
      note: "도장 품질은 바탕 보수와 연결돼 있어서 별도 줄로 빠지는지 확인이 필요합니다.",
    },
  ],
  "마루/장판": [
    {
      process: "철거",
      label: "기존 바닥재 철거",
      keywords: ["철거", "바닥 철거", "장판 철거"],
      note: "바닥 교체 견적이면 기존 바닥재 철거 여부가 누락되기 쉽습니다.",
    },
    {
      process: "목공",
      label: "걸레받이·문선 마감",
      keywords: ["걸레받이", "문선", "몰딩"],
      note: "바닥 교체 후 주변 마감이 목공 또는 별도 마감으로 함께 잡히는 경우가 많습니다.",
    },
  ],
  "도배": [
    {
      process: "철거",
      label: "기존 벽지 철거",
      keywords: ["벽지 철거", "철거", "폐기"],
      note: "도배 견적은 기존 벽지 철거·폐기 비용이 별도로 빠지기 쉽습니다.",
    },
    {
      process: "목공",
      label: "면 정리·석고 보수",
      keywords: ["면정리", "석고", "보수"],
      note: "상태가 좋지 않은 벽은 도배 전 바탕 보수가 같이 들어가야 할 수 있습니다.",
    },
  ],
  "가구": [
    {
      process: "설비/방수",
      label: "주방 설비 연결",
      keywords: ["수전", "배관", "설비"],
      note: "싱크대 교체면 급배수·가스·후드 연결이 같이 검토되는 경우가 많습니다.",
    },
    {
      process: "전기/조명",
      label: "주방 전기 이설",
      keywords: ["콘센트", "전기", "후드 배선"],
      note: "가전 위치가 바뀌면 주방 전기 이설 비용이 함께 잡히는 경우가 많습니다.",
    },
  ],
};

const referenceCatalog = {
  "철거": {
    low: [
      {
        brand: "현장 기준",
        name: "부분 철거 라이트",
        spec: "붙박이장·몰딩·문짝 위주",
        priceMin: 50000,
        priceMax: 65000,
        note: "욕실과 바닥 철거는 제외되는 경우가 많음",
      },
      {
        brand: "현장 기준",
        name: "부분 철거 플러스",
        spec: "가구+장판+일부 타일 포함",
        priceMin: 65000,
        priceMax: 80000,
        note: "폐기물 반출 동선에 따라 상단으로 붙기 쉬움",
      },
    ],
    mid: [
      {
        brand: "현장 기준",
        name: "전면 철거 기본형",
        spec: "목공·바닥·도배 전면 철거",
        priceMin: 80000,
        priceMax: 105000,
        note: "욕실은 1개 기준으로 보는 경우가 많음",
      },
      {
        brand: "현장 기준",
        name: "전면 철거 욕실 포함형",
        spec: "욕실 철거+폐기물 처리 포함",
        priceMin: 105000,
        priceMax: 130000,
        note: "양중과 야간 작업은 대개 별도",
      },
    ],
    premium: [
      {
        brand: "현장 기준",
        name: "구조 변경 철거",
        spec: "비내력벽 철거 포함",
        priceMin: 130000,
        priceMax: 165000,
        note: "구조 보강은 별도인 경우가 많음",
      },
      {
        brand: "현장 기준",
        name: "중량 폐기물 철거",
        spec: "타일·조적·미장 중량 철거",
        priceMin: 165000,
        priceMax: 200000,
        note: "엘리베이터 사용 제한 시 급등 가능",
      },
    ],
  },
  "설비/방수": {
    low: [
      {
        brand: "노멀 패키지",
        name: "배관 유지형",
        spec: "기존 배관 활용, 부분 방수",
        priceMin: 50000,
        priceMax: 65000,
        note: "누수 흔적이 적은 현장 기준",
      },
      {
        brand: "노멀 패키지",
        name: "부분 방수 보강형",
        spec: "욕실 1곳 보수 중심",
        priceMin: 65000,
        priceMax: 80000,
        note: "에어컨 배관은 보통 별도",
      },
    ],
    mid: [
      {
        brand: "스탠다드",
        name: "배관 일부 이동형",
        spec: "수전 위치 일부 변경",
        priceMin: 80000,
        priceMax: 115000,
        note: "미장 복구 포함 여부 확인 필요",
      },
      {
        brand: "스탠다드",
        name: "신규 방수 시공형",
        spec: "욕실·발코니 재방수",
        priceMin: 115000,
        priceMax: 150000,
        note: "시공 횟수에 따라 차이 큼",
      },
    ],
    premium: [
      {
        brand: "프로 패키지",
        name: "전면 배관 교체형",
        spec: "급수·배수 전면 재시공",
        priceMin: 150000,
        priceMax: 200000,
        note: "도면 없이도 현장 사양 확인 필요",
      },
      {
        brand: "프로 패키지",
        name: "배관+시스템에어컨형",
        spec: "LG 시스템에어컨 4대 배관 포함",
        priceMin: 200000,
        priceMax: 250000,
        note: "공릉신도1차 견적서에 LG 단배관 4대 기준으로 표기됨",
      },
    ],
  },
  "창호": {
    low: [
      {
        brand: "KCC",
        name: "일반 이중창",
        spec: "PL창, 기본 복층유리",
        priceMin: 100000,
        priceMax: 125000,
        note: "방음·단열 업그레이드 제외",
      },
      {
        brand: "LX Z:IN",
        name: "기본 이중창",
        spec: "발코니 기본 교체형",
        priceMin: 125000,
        priceMax: 150000,
        note: "내창/외창 동시 교체 여부 확인 필요",
      },
    ],
    mid: [
      {
        brand: "LX Z:IN",
        name: "LX BS D235 내창이중창",
        spec: "24T 유리 기준",
        priceMin: 150000,
        priceMax: 200000,
        note: "방/확장부 내창이중창 견적 사례 반영",
      },
      {
        brand: "이건창호",
        name: "시스템창호 업그레이드",
        spec: "LX 뷰프레임 140S, 26T 유리",
        priceMin: 200000,
        priceMax: 250000,
        note: "단열간봉·로이유리 추가 여부에 따라 변동",
      },
    ],
    premium: [
      {
        brand: "Rehau급",
        name: "LX 뷰프레임 250S",
        spec: "26T 유리 + 단열간봉 + 로이유리",
        priceMin: 250000,
        priceMax: 320000,
        note: "거실 확장부/입구방 확장부 고사양 기준",
      },
      {
        brand: "Schuco급",
        name: "LX 터닝도어 포함형",
        spec: "발코니 터닝도어 2개 기준",
        priceMin: 320000,
        priceMax: 400000,
        note: "사다리차·철거비는 별도일 수 있음",
      },
    ],
  },
  "전기/조명": {
    low: [
      {
        brand: "기본형",
        name: "배선 유지형",
        spec: "기존 회로 유지, 조명만 교체",
        priceMin: 10000,
        priceMax: 15000,
        note: "분전반 교체 제외",
      },
      {
        brand: "기본형",
        name: "조명·스위치 소폭 교체형",
        spec: "기본 스위치 일부 교체",
        priceMin: 15000,
        priceMax: 20000,
        note: "콘센트 증설은 제한적",
      },
    ],
    mid: [
      {
        brand: "르그랑 아펠라",
        name: "아펠라 화이트 스위치/콘센트",
        spec: "2구·3구·4구, LAN·TV 포함",
        priceMin: 20000,
        priceMax: 30000,
        note: "견적서 실제 표기 브랜드 기준",
      },
      {
        brand: "ABB급",
        name: "분전반 포함형",
        spec: "회로 일부 조정",
        priceMin: 30000,
        priceMax: 40000,
        note: "조명 기구값은 별도일 수 있음",
      },
    ],
    premium: [
      {
        brand: "스마트 패키지",
        name: "전면 배선 재시공형",
        spec: "스마트 스위치 일부 포함",
        priceMin: 40000,
        priceMax: 60000,
        note: "세대 전체 회로 조정 기준",
      },
      {
        brand: "스마트 패키지",
        name: "프리미엄 조명 연동형",
        spec: "스마트 스위치+분전반 교체",
        priceMin: 60000,
        priceMax: 80000,
        note: "스마트홈 허브는 대개 별도",
      },
    ],
  },
  "목공": {
    low: [
      {
        brand: "기본 목공",
        name: "몰딩·도어 교체형",
        spec: "MDF 몰딩, 일반 문선",
        priceMin: 100000,
        priceMax: 140000,
        note: "천장 목공 제외",
      },
      {
        brand: "기본 목공",
        name: "도어 포함 확장형",
        spec: "걸레받이+문틀 정리 포함",
        priceMin: 140000,
        priceMax: 180000,
        note: "가벽 신설은 제외",
      },
    ],
    mid: [
      {
        brand: "스탠다드 목공",
        name: "천장 박스형",
        spec: "등박스, 우물천장 포함",
        priceMin: 180000,
        priceMax: 240000,
        note: "간접조명 포함 여부 확인 필요",
      },
      {
        brand: "스탠다드 목공",
        name: "벽면 마감형",
        spec: "가벽 일부+도어 정리",
        priceMin: 240000,
        priceMax: 300000,
        note: "마감재 종류에 따라 편차 큼",
      },
    ],
    premium: [
      {
        brand: "프리미엄 목공",
        name: "TV 매립형",
        spec: "배선 정리 포함",
        priceMin: 300000,
        priceMax: 400000,
        note: "석재/타일 마감은 별도",
      },
      {
        brand: "프리미엄 목공",
        name: "전면 특수 목공형",
        spec: "가벽 신설+특수 마감",
        priceMin: 400000,
        priceMax: 500000,
        note: "도장/필름 공정은 별도일 수 있음",
      },
    ],
  },
  "타일": {
    low: [
      {
        brand: "국산 기본",
        name: "욕실 벽바닥 기본형",
        spec: "300각 전후 국산 타일",
        priceMin: 99000,
        priceMax: 130000,
        note: "줄눈 업그레이드는 제외",
      },
      {
        brand: "국산 기본",
        name: "현관·발코니 포함형",
        spec: "욕실+소구역 타일",
        priceMin: 130000,
        priceMax: 165000,
        note: "젠다이·니치 제외",
      },
    ],
    mid: [
      {
        brand: "윤현상재급",
        name: "국산 중급 포인트형",
        spec: "욕실+주방벽 일부",
        priceMin: 165000,
        priceMax: 240000,
        note: "사이즈 커질수록 상단 접근",
      },
      {
        brand: "대동타일급",
        name: "국산 중급 확장형",
        spec: "주방벽·현관 포함",
        priceMin: 240000,
        priceMax: 330000,
        note: "수입 혼용 시 별도 확인 필요",
      },
    ],
    premium: [
      {
        brand: "이탈리아 포세린급",
        name: "포세린 기본형",
        spec: "600각 이상",
        priceMin: 330000,
        priceMax: 450000,
        note: "가공비 포함 여부 확인 필요",
      },
      {
        brand: "수입 타일급",
        name: "대형 수입 타일형",
        spec: "대형 포세린+고급 줄눈",
        priceMin: 450000,
        priceMax: 600000,
        note: "파손분·예비분 포함 여부 확인 필요",
      },
    ],
  },
  "욕실": {
    low: [
      {
        brand: "대림바스",
        name: "기본 욕실 패키지",
        spec: "국산 도기·수전 기본형",
        priceMin: 50000,
        priceMax: 75000,
        note: "수납장·비데 제외 가능성 높음",
      },
      {
        brand: "대림바스",
        name: "기본 집기 확장형",
        spec: "환풍기·천장재 포함",
        priceMin: 75000,
        priceMax: 100000,
        note: "거울장 포함 여부 확인 필요",
      },
    ],
    mid: [
      {
        brand: "대림바스",
        name: "기본 욕실 패키지",
        spec: "국산 도기·수전 기본형",
        priceMin: 100000,
        priceMax: 140000,
        note: "세면수전·샤워수전 사양에 따라 편차 큼",
      },
      {
        brand: "아메리칸스탠다드",
        name: "Wave S / Plat 세트",
        spec: "웨이브S 투피스 + 플랫 반다리 세면기",
        priceMin: 140000,
        priceMax: 180000,
        note: "공릉신도1차 견적서 실제 도기 라인 기준",
      },
    ],
    premium: [
      {
        brand: "비반트",
        name: "비반트 수전 패키지",
        spec: "세면수전·샤워수전·슬라이드바",
        priceMin: 180000,
        priceMax: 260000,
        note: "메트실버/메트그레이 옵션 견적 사례 반영",
      },
      {
        brand: "히든바스/힘펠",
        name: "히든바스/힘펠 풀셋형",
        spec: "상부장·거울장·환풍기·천장재 포함",
        priceMin: 260000,
        priceMax: 350000,
        note: "히든바스 욕실장과 힘펠 환풍기 조합 사례 반영",
      },
    ],
  },
  "필름": {
    low: [
      {
        brand: "현대L&C 보닥",
        name: "단색 솔리드 필름",
        spec: "도어·문틀 중심",
        priceMin: 20000,
        priceMax: 27000,
        note: "현관문 포함 여부 확인 필요",
      },
      {
        brand: "LX Benif",
        name: "기본 리폼 필름",
        spec: "문짝+문선+일부 가구",
        priceMin: 27000,
        priceMax: 35000,
        note: "패턴 필름 제외",
      },
    ],
    mid: [
      {
        brand: "LX Benif",
        name: "우드 패턴 필름",
        spec: "목공 벽면 일부 포함",
        priceMin: 35000,
        priceMax: 47000,
        note: "시공 면적 산정 기준 확인 필요",
      },
      {
        brand: "현대L&C 보닥",
        name: "패턴 확장형",
        spec: "도어+현관문+가구 전면",
        priceMin: 47000,
        priceMax: 60000,
        note: "리폼 범위 외는 추가",
      },
    ],
    premium: [
      {
        brand: "3M DI-NOC",
        name: "프리미엄 인테리어 필름",
        spec: "고급 패턴·질감",
        priceMin: 60000,
        priceMax: 80000,
        note: "석재/금속 질감 필름 비교용",
      },
      {
        brand: "Bodaq",
        name: "수입 필름 전면형",
        spec: "전면 목공 리폼",
        priceMin: 80000,
        priceMax: 100000,
        note: "복잡한 곡면은 상단으로 감",
      },
    ],
  },
  "도장": {
    low: [
      {
        brand: "노루페인트",
        name: "기본 수성 도장",
        spec: "발코니 1~2회 도포",
        priceMin: 15000,
        priceMax: 20000,
        note: "균열 보수는 제한적",
      },
      {
        brand: "KCC",
        name: "기본 보수 포함형",
        spec: "발코니 전처리 일부 포함",
        priceMin: 20000,
        priceMax: 25000,
        note: "실내 전체 도장은 제외",
      },
    ],
    mid: [
      {
        brand: "삼화페인트",
        name: "탄성코트 표준형",
        spec: "2회 도포",
        priceMin: 25000,
        priceMax: 35000,
        note: "전처리 포함 여부 확인 필요",
      },
      {
        brand: "노루페인트",
        name: "탄성코트 보수형",
        spec: "균열 보수+2회 도포",
        priceMin: 35000,
        priceMax: 45000,
        note: "방수 등급은 별도일 수 있음",
      },
    ],
    premium: [
      {
        brand: "삼화페인트",
        name: "방수 탄성코트형",
        spec: "3회 도포",
        priceMin: 45000,
        priceMax: 60000,
        note: "누수 보증 조건 확인 필요",
      },
      {
        brand: "특수도장 패키지",
        name: "특수 도장형",
        spec: "고급 전처리 포함",
        priceMin: 60000,
        priceMax: 80000,
        note: "범위가 넓으면 총액 기준 재확인 필요",
      },
    ],
  },
  "마루/장판": {
    low: [
      {
        brand: "KCC",
        name: "기본 장판",
        spec: "1.8T~2.2T급",
        priceMin: 30000,
        priceMax: 40000,
        note: "평탄화 제외",
      },
      {
        brand: "LX 지아",
        name: "LPT·장판 업그레이드형",
        spec: "층간소음 보강 없음",
        priceMin: 40000,
        priceMax: 50000,
        note: "문턱/걸레받이 포함 확인 필요",
      },
    ],
    mid: [
      {
        brand: "동화자연마루",
        name: "진 그란데 이모션 블랑",
        spec: "강마루 325 x 805 규격",
        priceMin: 50000,
        priceMax: 65000,
        note: "PDF 견적서 실제 표기 제품 기준",
      },
      {
        brand: "구정마루",
        name: "강마루 업그레이드형",
        spec: "광폭·질감 강화",
        priceMin: 65000,
        priceMax: 80000,
        note: "철거/평탄화 포함 여부 중요",
      },
    ],
    premium: [
      {
        brand: "이건마루",
        name: "원목마루 기본형",
        spec: "원목 표면층 적용",
        priceMin: 100000,
        priceMax: 140000,
        note: "습도 관리와 보양 조건 중요",
      },
      {
        brand: "프리미엄 원목급",
        name: "광폭 원목마루",
        spec: "고급 표면 마감",
        priceMin: 140000,
        priceMax: 180000,
        note: "온돌 적합성 확인 필요",
      },
    ],
  },
  "도배": {
    low: [
      {
        brand: "신한벽지",
        name: "합지 기본형",
        spec: "국산 합지",
        priceMin: 15000,
        priceMax: 17000,
        note: "천장 포함 여부 확인 필요",
      },
      {
        brand: "개나리벽지",
        name: "합지 업그레이드형",
        spec: "패턴 선택폭 확장",
        priceMin: 17000,
        priceMax: 20000,
        note: "기존 벽지 제거는 보통 별도",
      },
    ],
    mid: [
      {
        brand: "LX Z:IN",
        name: "베스트 82559-01",
        spec: "비방염 실크벽지 106cm x 15.5m",
        priceMin: 20000,
        priceMax: 25000,
        note: "견적서 실표기 라인 기준",
      },
      {
        brand: "신한벽지",
        name: "실크 업그레이드형",
        spec: "질감/패턴 선택형",
        priceMin: 25000,
        priceMax: 30000,
        note: "천장과 포인트 벽 분리 여부 확인",
      },
    ],
    premium: [
      {
        brand: "수입벽지급",
        name: "수입 실크 벽지",
        spec: "패턴 수입지",
        priceMin: 30000,
        priceMax: 45000,
        note: "로스율에 따라 견적 변동 큼",
      },
      {
        brand: "천연벽지급",
        name: "천연 소재 벽지",
        spec: "마·한지·직물 계열",
        priceMin: 45000,
        priceMax: 60000,
        note: "시공 난이도와 하자 범위 확인 필요",
      },
    ],
  },
  "가구": {
    low: [
      {
        brand: "국산 보급형",
        name: "기본 싱크대 패키지",
        spec: "신발장 포함",
        priceMin: 80000,
        priceMax: 115000,
        note: "상판 업그레이드 제외",
      },
      {
        brand: "한샘",
        name: "보급형 붙박이장 포함형",
        spec: "싱크+신발장+일부 붙박이",
        priceMin: 115000,
        priceMax: 150000,
        note: "냉장고장 여부 확인 필요",
      },
    ],
    mid: [
      {
        brand: "한샘",
        name: "PET 무광화이트 싱크대",
        spec: "4.5m 일자형 상하부장",
        priceMin: 150000,
        priceMax: 210000,
        note: "주문제작 도어 사양과 내부 구성에 따라 변동",
      },
      {
        brand: "LX",
        name: "스노우라인 상판 패키지",
        spec: "주방 4.5m 주문제작 상판",
        priceMin: 210000,
        priceMax: 280000,
        note: "견적서 실제 상판 표기 기준",
      },
    ],
    premium: [
      {
        brand: "백조/하츠",
        name: "싱크볼·후드 포함형",
        spec: "백조 SQSR780 + 하츠 IB60S",
        priceMin: 280000,
        priceMax: 380000,
        note: "주방 집기 포함 구성 기준",
      },
      {
        brand: "맞춤 제작급",
        name: "전면 맞춤 가구형",
        spec: "천연석 상판 가능",
        priceMin: 380000,
        priceMax: 500000,
        note: "하드웨어 브랜드 공개 요청 권장",
      },
    ],
  },
  "마감": {
    low: [
      {
        brand: "기본형",
        name: "실리콘+청소 패키지",
        spec: "줄눈 없음",
        priceMin: 10000,
        priceMax: 15000,
        note: "도어락 교체 제외",
      },
      {
        brand: "기본형",
        name: "청소 확장형",
        spec: "입주청소 범위 확대",
        priceMin: 15000,
        priceMax: 20000,
        note: "에어컨 청소 포함 여부 확인 필요",
      },
    ],
    mid: [
      {
        brand: "삼성",
        name: "푸쉬 도어락 포함형",
        spec: "도어락 + 인터폰 교체",
        priceMin: 20000,
        priceMax: 27000,
        note: "선택 제품에 따라 금액 변동 가능",
      },
      {
        brand: "코콤급",
        name: "인터폰 포함형",
        spec: "줄눈+도어락+청소",
        priceMin: 27000,
        priceMax: 35000,
        note: "스마트 연동은 제한적",
      },
    ],
    premium: [
      {
        brand: "프리미엄 줄눈형",
        name: "전문 줄눈 패키지",
        spec: "욕실·주방 집중형",
        priceMin: 35000,
        priceMax: 45000,
        note: "브랜드보다 시공 범위가 더 중요",
      },
      {
        brand: "스마트 마감형",
        name: "도어락·인터폰 업그레이드",
        spec: "고급 청소 포함",
        priceMin: 45000,
        priceMax: 60000,
        note: "스마트홈 허브 연동은 별도",
      },
    ],
  },
  "공과잡비": {
    low: [
      {
        brand: "기본 관리",
        name: "보양·일반 경비형",
        spec: "엘리베이터 보양 기본",
        priceMin: 15000,
        priceMax: 22000,
        note: "허가 대행 제외",
      },
      {
        brand: "기본 관리",
        name: "보양 확장형",
        spec: "복도·공용부 보양 포함",
        priceMin: 22000,
        priceMax: 30000,
        note: "입주민 동의 대행 제외",
      },
    ],
    mid: [
      {
        brand: "대행 포함형",
        name: "행위허가 패키지",
        spec: "허가 서류 일부 대행",
        priceMin: 30000,
        priceMax: 40000,
        note: "아파트마다 요구 서류 다름",
      },
      {
        brand: "대행 포함형",
        name: "허가+입주민 동의형",
        spec: "보양 포함",
        priceMin: 40000,
        priceMax: 50000,
        note: "관리사무소 협의 범위 확인 필요",
      },
    ],
    premium: [
      {
        brand: "특수 관리형",
        name: "복잡 허가 대응형",
        spec: "구조 변경 허가 보조",
        priceMin: 50000,
        priceMax: 65000,
        note: "법정 비용은 별도일 수 있음",
      },
      {
        brand: "특수 관리형",
        name: "전 과정 관리형",
        spec: "특수 보양·민원 대응 포함",
        priceMin: 65000,
        priceMax: 80000,
        note: "현장 민원 대응비가 포함될 수 있음",
      },
    ],
  },
  "일반관리": {
    low: [
      {
        brand: "기본 관리",
        name: "보험 기본형",
        spec: "현장 관리 최소 구성",
        priceMin: 20000,
        priceMax: 30000,
        note: "전문 감리 제외",
      },
      {
        brand: "기본 관리",
        name: "보험 확장형",
        spec: "산재·고용보험 포함",
        priceMin: 30000,
        priceMax: 40000,
        note: "마진 표기 방식 확인 필요",
      },
    ],
    mid: [
      {
        brand: "표준 관리",
        name: "감리 포함형",
        spec: "현장 감리 배치",
        priceMin: 40000,
        priceMax: 55000,
        note: "전담 감리인지 확인 필요",
      },
      {
        brand: "표준 관리",
        name: "보험·이윤 포함형",
        spec: "보험+감리+기업이윤",
        priceMin: 55000,
        priceMax: 70000,
        note: "계약서상 책임 범위 확인 권장",
      },
    ],
    premium: [
      {
        brand: "프리미엄 관리",
        name: "전담 감리형",
        spec: "전담 현장 관리자 배치",
        priceMin: 70000,
        priceMax: 95000,
        note: "제3자 감리는 별도일 수 있음",
      },
      {
        brand: "프리미엄 관리",
        name: "보험 완비형",
        spec: "전문 감리+보험 완비",
        priceMin: 95000,
        priceMax: 120000,
        note: "사고 보상 프로세스 문서화 권장",
      },
    ],
  },
};

const brandSourceMap = [
  {
    keywords: ["3M", "DI-NOC"],
    label: "3M DI-NOC 공식",
    url: "https://www.3m.com/3M/en_US/p/c/b/di-noc/",
  },
  {
    keywords: ["TOTO"],
    label: "TOTO Korea",
    url: "https://kr.toto.com/",
  },
  {
    keywords: ["리바트", "Livart"],
    label: "현대리바트",
    url: "https://company.hyundailivart.co.kr/ko/brandHistory",
  },
  {
    keywords: ["에넥스", "ENEX"],
    label: "에넥스",
    url: "https://www.enex.co.kr/",
  },
  {
    keywords: ["KCC"],
    label: "KCC",
    url: "https://www.kccworld.co.kr/",
  },
  {
    keywords: ["한샘", "Hanssem"],
    label: "한샘",
    url: "https://www.hanssem.com/",
  },
  {
    keywords: ["LX", "Z:IN", "지아"],
    label: "LX Z:IN",
    url: "https://www.z-in.com/",
  },
  {
    keywords: ["현대L&C", "보닥", "Bodaq"],
    label: "현대L&C",
    url: "https://www.hyundailnc.com/",
  },
  {
    keywords: ["신한벽지"],
    label: "신한벽지",
    url: "https://sinhan.kr/",
  },
  {
    keywords: ["개나리벽지", "개나리"],
    label: "개나리벽지",
    url: "http://www.g7.co.kr/",
  },
  {
    keywords: ["동화자연마루", "동화"],
    label: "동화자연마루",
    url: "https://www.greendongwha.com/home/",
  },
  {
    keywords: ["구정마루", "구정"],
    label: "구정마루",
    url: "https://www.kujungmaru.com/",
  },
  {
    keywords: ["이건창호", "이건마루", "이건"],
    label: "이건",
    url: "https://www.eagon.com/",
  },
  {
    keywords: ["LG", "휘센"],
    label: "LG전자 시스템에어컨",
    url: "https://www.lge.co.kr/system-air-conditioners",
  },
  {
    keywords: ["르그랑", "Legrand", "아펠라", "Affela"],
    label: "르그랑코리아",
    url: "https://www.legrand.co.kr/ko/소식/르그랑코리아-아펠라’-제품군-확대…인테리어-시장-공략",
  },
  {
    keywords: ["영림", "YOUNGLIM"],
    label: "영림",
    url: "https://www.yl.co.kr/",
  },
  {
    keywords: ["힘펠", "HIMPEL"],
    label: "힘펠",
    url: "https://www.himpel.com/2019/about/about_010100.html",
  },
  {
    keywords: ["하츠", "HAATZ"],
    label: "하츠",
    url: "https://www.haatz.com/Main/",
  },
  {
    keywords: ["노루"],
    label: "노루페인트",
    url: "https://www.noroopaint.com/",
  },
  {
    keywords: ["삼화"],
    label: "삼화페인트",
    url: "https://www.samhwa.com/",
  },
  {
    keywords: ["Grohe", "GROHE"],
    label: "GROHE",
    url: "https://www.grohe.co.kr/",
  },
  {
    keywords: ["대림바스", "대림"],
    label: "대림바스",
    url: "https://www.daelimbath.com/",
  },
  {
    keywords: ["American Standard", "아메리칸스탠다드"],
    label: "American Standard Korea",
    url: "https://www.americanstandard.co.kr/",
  },
  {
    keywords: ["Rehau"],
    label: "REHAU",
    url: "https://www.rehau.com/kr-ko",
  },
];

function findBrandSource(reference) {
  const haystack = `${reference.brand} ${reference.name} ${reference.spec}`;
  return (
    brandSourceMap.find((entry) =>
      entry.keywords.some((keyword) => haystack.includes(keyword))
    ) || null
  );
}

function enrichReference(reference, processName, gradeLabel) {
  const source = findBrandSource(reference);

  return {
    ...reference,
    specSummary: `${processName} · ${gradeLabel} · ${reference.spec}`,
    sourceLabel: source ? source.label : "시장 평균 기준",
    sourceUrl: source ? source.url : null,
    updatedAt: "2026-05-01",
  };
}

Object.entries(prices).forEach(([processName, processData]) => {
  const referenceByGrade = referenceCatalog[processName] || {};
  processData.missingChecklist = missingItemCatalog[processName] || { common: [] };
  processData.relatedChecks = processDependencyCatalog[processName] || [];
  Object.entries(processData.grades).forEach(([gradeKey, gradeData]) => {
    const baseReferences =
      referenceByGrade[gradeKey] ||
      [
        {
          brand: "기본 기준",
          name: gradeData.material,
          spec: "대표 기준",
          priceMin: gradeData.priceMin,
          priceMax: gradeData.priceMax,
          note: "대표 범위 기준",
        },
      ];

    gradeData.references = baseReferences.map((reference) =>
      enrichReference(reference, processName, gradeData.label)
    );
  });
});

window.prices = prices;
