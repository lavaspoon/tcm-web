// TDS 필수안내 시스템 - 화면 초안용 목업 데이터
// 실제 파이프라인(UiPath STT → 프롬프트 체크 → DB 적재) 산출물을 흉내낸 형태.
// STT 원문은 저장 불가 → AI가 생성한 인사이트 텍스트만 보유한다는 제약을 반영.

// 필수안내 대분류 3개 × 세부항목 4개 = 총 12개
export const CATEGORIES = [
  {
    key: 'contract',
    name: '계약 조건 안내',
    items: [
      { key: 'c1', name: '요금제 명칭·월 납부액' },
      { key: 'c2', name: '약정 기간·위약금' },
      { key: 'c3', name: '단말 할부원금·할부이자' },
      { key: 'c4', name: '공시지원금/선택약정 구분' },
    ],
  },
  {
    key: 'rights',
    name: '고객 권리 안내',
    items: [
      { key: 'r1', name: '청약철회 가능 기간' },
      { key: 'r2', name: '개통 철회 시 비용' },
      { key: 'r3', name: '명의도용 방지 확인' },
      { key: 'r4', name: '분실·파손 보험 고지' },
    ],
  },
  {
    key: 'consent',
    name: '동의·확인 절차',
    items: [
      { key: 's1', name: '개인정보 수집·이용 동의' },
      { key: 's2', name: '마케팅 수신 동의 여부' },
      { key: 's3', name: '녹취 진행 고지' },
      { key: 's4', name: '최종 계약 내용 재확인' },
    ],
  },
];

// 상담사별 대분류 이행률(%) — 전일 배치로 적재된 집계값
export const CONSULTANTS = [
  {
    id: 'a01',
    name: '김하늘',
    calls: 42,
    scores: { contract: 96, rights: 71, consent: 92 },
    // 세부항목별 이행률 (미이행 원인 진단용)
    itemScores: {
      c1: 100, c2: 95, c3: 93, c4: 96,
      r1: 62, r2: 58, r3: 88, r4: 74,
      s1: 98, s2: 90, s3: 95, s4: 85,
    },
    trend: +4,
  },
  {
    id: 'a02',
    name: '박서준',
    calls: 38,
    scores: { contract: 74, rights: 88, consent: 61 },
    itemScores: {
      c1: 92, c2: 70, c3: 65, c4: 69,
      r1: 90, r2: 86, r3: 89, r4: 87,
      s1: 72, s2: 55, s3: 60, s4: 57,
    },
    trend: -6,
  },
  {
    id: 'a03',
    name: '이도윤',
    calls: 51,
    scores: { contract: 91, rights: 94, consent: 90 },
    itemScores: {
      c1: 95, c2: 90, c3: 88, c4: 91,
      r1: 93, r2: 95, r3: 96, r4: 92,
      s1: 92, s2: 89, s3: 90, s4: 89,
    },
    trend: +2,
  },
  {
    id: 'a04',
    name: '최유나',
    calls: 33,
    scores: { contract: 68, rights: 65, consent: 70 },
    itemScores: {
      c1: 78, c2: 60, c3: 62, c4: 72,
      r1: 66, r2: 61, r3: 70, r4: 63,
      s1: 74, s2: 68, s3: 71, s4: 67,
    },
    trend: -3,
  },
  {
    id: 'a05',
    name: '정민재',
    calls: 45,
    scores: { contract: 88, rights: 79, consent: 84 },
    itemScores: {
      c1: 90, c2: 85, c3: 88, c4: 89,
      r1: 80, r2: 76, r3: 82, r4: 78,
      s1: 86, s2: 80, s3: 85, s4: 85,
    },
    trend: +1,
  },
];

// AI가 클러스터링한 팀 반복 미이행 패턴 (개인 나열보다 우선 노출)
export const TEAM_PATTERNS = [
  {
    id: 'p1',
    severity: 'high',
    title: '약정·위약금 안내를 개통 직전 생략하는 패턴',
    affected: ['박서준', '최유나'],
    coverage: 34, // 팀 통화 중 해당 유형이 관측된 비율(%)
    insight:
      '단말 할부원금까지는 안내가 이뤄지지만, 약정 기간과 위약금 조건을 개통 확정 단계에서 빠뜨리는 흐름이 반복 관측됩니다. 고객이 "그럼 진행할게요"라고 답한 직후 안내가 종료되는 경향이 있습니다.',
    likelyCause: '습관성 생략 (절차 압박)',
  },
  {
    id: 'p2',
    severity: 'medium',
    title: '마케팅 수신 동의를 묶음 동의로 뭉뚱그리는 패턴',
    affected: ['박서준', '김하늘'],
    coverage: 21,
    insight:
      '개인정보 수집 동의와 마케팅 수신 동의를 하나의 문장으로 처리하여, 마케팅 수신에 대한 개별 의사 확인이 누락됩니다. 동의 항목을 분리 고지하는 스크립트 정착이 필요합니다.',
    likelyCause: '절차 이해 부족',
  },
  {
    id: 'p3',
    severity: 'low',
    title: '청약철회 기간을 수치 없이 "가능합니다"로만 안내',
    affected: ['김하늘'],
    coverage: 12,
    insight:
      '청약철회가 "가능하다"는 사실은 전달되나, 구체적 가능 기간(일수)이 함께 고지되지 않는 사례가 소수 관측됩니다.',
    likelyCause: '단순 실수',
  },
];

// 오늘 실장이 처리해야 할 코칭 액션 (위험도 순으로 정렬된 "할 일 목록")
// 각 항목 = 상담사 1명 + 미이행 근거 + AI가 완성한 코칭 초안
// causeType: learning(학습 부족) | habit(습관성) | mistake(단순 실수)
export const COACHING_DRAFTS = [
  {
    id: 'd1',
    consultantId: 'a04',
    consultant: '최유나',
    calls: 33,
    riskScore: 92, // 위험도 (높을수록 위)
    missRate: 33,
    headline: '계약 조건 전반이 통화마다 조금씩 누락',
    focus: '계약 조건 4개 항목 + 동의 절차',
    // 미이행 근거 (STT 원문 대신 AI 인사이트만)
    evidence: [
      { item: '약정 기간·위약금', miss: 13, of: 33 },
      { item: '단말 할부원금', miss: 12, of: 33 },
      { item: '마케팅 수신 동의', miss: 15, of: 33 },
    ],
    cause: '학습 부족 (스크립트 순서 미정착)',
    causeType: 'learning',
    tone: '재교육 연계형',
    // AI가 STT를 해석해 재구성한 대표 통화 흐름 (원문 저장 X, 인사이트만)
    replay: {
      callId: '2026-07-06 14:22 · 통화 #17 (대표 사례)',
      steps: [
        { t: '00:41', who: 'agent', text: '요금제랑 월 납부액 안내드렸고요', ok: true, label: '요금제·월납부액' },
        { t: '02:15', who: 'agent', text: '단말기는 이 색상으로 준비해드릴게요', ok: true, label: '단말 확인' },
        { t: '03:02', who: 'customer', text: '네 그럼 그걸로 진행할게요', ok: null, label: '고객 개통 동의' },
        { t: '03:08', who: 'agent', text: '네 바로 개통 접수 도와드리겠습니다', ok: false, label: '약정·위약금 안내 누락', gap: true },
        { t: '03:20', who: 'agent', text: '개통 완료되면 문자 드릴게요', ok: false, label: '할부원금 고지 누락', gap: true },
      ],
      aiNote: '고객이 "진행할게요"라고 답한 직후(03:02) 약정·위약금·할부원금 안내 없이 곧바로 개통 접수로 넘어가는 흐름이 33건 중 18건에서 동일하게 관측됩니다.',
    },
    // 이 코칭을 보냈을 때의 예측 효과
    impact: {
      currentRate: 67,
      predictedRate: 89,
      confidence: 'AI 예측 신뢰도 높음',
      penaltyGuard: 148000, // 방어 가능한 월 보상비 감소액(원)
      basis: '동일 유형 코칭 후 평균 회복 곡선 기준',
    },
    // 지난 코칭 효과 추적 (before/after)
    lastCoaching: null, // 최초 코칭 대상 → 이력 없음
  },
  {
    id: 'd2',
    consultantId: 'a02',
    consultant: '박서준',
    calls: 38,
    riskScore: 78,
    missRate: 30,
    headline: '개통 직전 약정·위약금 안내를 반복 생략',
    focus: '약정 기간·위약금 (계약 조건)',
    evidence: [
      { item: '약정 기간·위약금', miss: 11, of: 38 },
      { item: '마케팅 수신 동의 분리', miss: 17, of: 38 },
    ],
    cause: '습관성 생략 (절차 압박)',
    causeType: 'habit',
    tone: '리마인드형',
    replay: {
      callId: '2026-07-06 11:07 · 통화 #09 (대표 사례)',
      steps: [
        { t: '01:12', who: 'agent', text: '할부원금은 이렇게 잡히시고요', ok: true, label: '할부원금 안내' },
        { t: '01:40', who: 'customer', text: '아 네 그럼 진행해주세요', ok: null, label: '고객 개통 동의' },
        { t: '01:44', who: 'agent', text: '네 개통 진행하겠습니다', ok: false, label: '약정 기간·위약금 누락', gap: true },
      ],
      aiNote: '"진행해주세요" 응답 직후 약정 기간·위약금 고지 없이 개통으로 넘어가는 흐름이 반복됩니다. 안내 순서상 마지막 한 스텝만 습관적으로 생략되는 전형적 패턴입니다.',
    },
    impact: {
      currentRate: 70,
      predictedRate: 92,
      confidence: 'AI 예측 신뢰도 높음',
      penaltyGuard: 96000,
      basis: '습관성 생략은 리마인드 코칭 후 회복률이 특히 높음',
    },
    lastCoaching: {
      date: '2026-06-29',
      topic: '마케팅 수신 동의 분리',
      before: 55,
      after: 84,
      verdict: 'improved', // improved | flat | worse
      aiNote: '지난 코칭 후 마케팅 동의 분리 고지 이행률이 55% → 84%로 개선됐습니다. 코칭이 실제로 작동한 상담사입니다.',
    },
  },
  {
    id: 'd3',
    consultantId: 'a01',
    consultant: '김하늘',
    calls: 42,
    riskScore: 41,
    missRate: 20,
    headline: '청약철회를 기간 수치 없이 "가능합니다"로만 안내',
    focus: '청약철회 기간 (고객 권리)',
    evidence: [
      { item: '청약철회 가능 기간', miss: 8, of: 42 },
    ],
    cause: '단순 실수',
    causeType: 'mistake',
    tone: '리마인드형',
    draft:
      '하늘님, 전체적으로 안내 아주 꼼꼼해요. 딱 하나, 청약철회 안내할 때 "가능합니다"로 끝나는 경우가 몇 번 있었어요. "개통일로부터 O일 이내 철회 가능합니다"처럼 기간을 같이 말해주면 고객 문의도 줄어들 거예요. 사소하지만 이것만 챙기면 거의 완벽합니다!',
    replay: {
      callId: '2026-07-06 16:31 · 통화 #24 (대표 사례)',
      steps: [
        { t: '04:55', who: 'customer', text: '혹시 나중에 취소도 되나요?', ok: null, label: '고객 청약철회 문의' },
        { t: '04:58', who: 'agent', text: '네 청약철회 가능하십니다', ok: false, label: '기간(일수) 미고지', gap: true },
      ],
      aiNote: '청약철회 "가능" 사실은 전달되나 구체적 기간(일수)이 빠지는 사례가 42건 중 8건. 안내 자체를 빠뜨리는 게 아니라 수치 한 조각만 누락되는 경미한 유형입니다.',
    },
    impact: {
      currentRate: 80,
      predictedRate: 96,
      confidence: 'AI 예측 신뢰도 보통',
      penaltyGuard: 32000,
      basis: '단순 실수 유형은 리마인드 1회로 대부분 해소',
    },
    lastCoaching: null,
  },
];

// 상담사 개인 화면 - 받은 코칭 히스토리
export const COACHING_HISTORY = [
  {
    id: 'h1',
    date: '2026-07-06',
    from: '이수정 실장',
    topic: '약정·위약금 안내',
    message:
      '개통 직전에 약정 기간이랑 위약금 안내 한 줄만 붙여주세요. 오늘부터 신경 써봐요.',
    status: '확인',
  },
  {
    id: 'h2',
    date: '2026-06-29',
    from: '이수정 실장',
    topic: '마케팅 수신 동의 분리 고지',
    message:
      '개인정보 동의랑 마케팅 수신 동의는 따로 여쭤봐 주세요. 스크립트 다시 공유했어요.',
    status: '개선 확인됨',
  },
  {
    id: 'h3',
    date: '2026-06-20',
    from: '이수정 실장',
    topic: '할부원금 고지',
    message: '할부원금 안내는 잘 되고 있어요. 계속 유지해주세요!',
    status: '완료',
  },
];

// 로그인한 상담사(상담사 화면용) — 박서준 기준
export const CURRENT_MEMBER = CONSULTANTS[1];

export const TEAM_SUMMARY = {
  date: '2026-07-06',
  totalCalls: 209,
  overallCompliance: 82,
  weeklyDelta: -1.5,
  atRiskCount: 2,
  // AI가 오늘의 상황을 한 문장으로 요약한 브리핑
  aiBriefing:
    '어제 209건을 전수 분석했어요. 계약 조건 안내 누락이 어제 하루 팀 전체에서 21건 늘었고, 특히 개통 확정 직전 약정·위약금 고지가 집중적으로 빠지고 있어요. 최유나·박서준 두 분 코칭을 오늘 보내면 이번 주 보상비 감소 약 24만원을 막을 수 있을 것으로 예측됩니다.',
  // 이 화면이 실장 대신 처리한 작업량 (충격 지표)
  aiWorkload: {
    callsListened: 209,
    minutesSaved: 174, // 사람이 전수 청취 시 걸릴 시간 대비 절감(분)
    draftsWritten: 3,
    penaltyGuarded: 244000,
  },
};

// 자연어 질문 예시 (실장이 타이핑하면 AI가 데이터로 답하는 검색창)
export const ASK_SUGGESTIONS = [
  '이번 주 가장 위험한 상담사는?',
  '계약 조건 안내가 왜 이렇게 떨어졌어?',
  '지난달보다 나아진 사람 있어?',
];

// 위 질문에 대한 미리 준비된 AI 응답 (데모용)
export const ASK_ANSWERS = {
  '이번 주 가장 위험한 상담사는?':
    '최유나 상담사예요. 계약 조건 4개 항목이 통화마다 조금씩 빠지고 있고(미이행 33%), 원인이 습관보다 스크립트 미숙지 쪽이라 재교육 연계를 추천해요. 오른쪽 1번 카드에 코칭 초안을 준비해뒀어요.',
  '계약 조건 안내가 왜 이렇게 떨어졌어?':
    '고객이 "진행할게요"라고 개통에 동의한 직후, 약정·위약금·할부원금 안내가 통째로 생략되는 흐름이 어제만 34건 관측됐어요. 상담사가 개통 접수로 급하게 넘어가는 타이밍이 공통 원인입니다. 팀 반복 패턴 1번과 같은 현상이에요.',
  '지난달보다 나아진 사람 있어?':
    '박서준 상담사예요. 6/29 마케팅 동의 분리 코칭 이후 해당 항목 이행률이 55% → 84%로 올랐어요. 코칭이 실제로 먹히는 상담사라, 이번 약정·위약금 코칭도 효과가 클 것으로 예측합니다.',
};
