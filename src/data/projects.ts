export type ProjectType = 'unity' | 'web' | 'package' | 'server' | 'docs' | 'wip'
export type RoleTag = 'game' | 'backend' | 'infra'

/** 한 줄 결정 카드 — "무엇을 고민했고, 무엇을 골랐고, 왜" */
export interface Decision {
  /** 고민한 지점 */
  q: string
  /** 고른 것 */
  chose: string
  /** 고른 이유 */
  why: string
  /** 버린 대안 (있으면) */
  alt?: string
}

/** 검증 숫자 — 실측값만 넣는다. 추정치 금지. */
export interface Evidence {
  label: string
  value: string
  note?: string
}

export interface Project {
  id: string
  title: string
  type: ProjectType
  description: string
  image: string
  technologies: string[]
  github?: string
  demo?: string
  featured: boolean
  devPeriod?: string
  content?: string
  hasPlayableDemo?: boolean

  /* ── 직군 맞춤용 필드 ── */
  /** 어느 직군 페이지에 노출할지 */
  roles?: RoleTag[]
  /** 이 프로젝트를 시작한 이유 (문제 정의) */
  problem?: string
  /** 내가 내린 결정들 */
  decisions?: Decision[]
  /** 실측 검증 숫자 */
  evidence?: Evidence[]
  /** 솔직한 한계 — 면접에서 먼저 꺼내는 편이 낫다 */
  limits?: string[]
}

export const projects: Project[] = [
  {
    id: 'afk',
    title: 'AFK Idle RPG',
    type: 'unity',
    description: '6주 동안 기획부터 완성까지 혼자 만든 방치형 RPG. 자동 전투·장비 합성·환생까지 한 사이클을 끝냈고, 밸런스 수치는 전부 CSV로 빼서 코드를 고치지 않고 조절됩니다.',
    image: '/images/afk.webp',
    technologies: ['Unity 6', 'C#', 'DI Container', 'SOLID Principles', 'Event-driven Architecture', 'CSV Data Pipeline'],
    github: 'https://github.com/kongnamul-muchim/AFK',
    featured: false,
    devPeriod: '2026-03-27 ~ 2026-05-07',
    hasPlayableDemo: false,
    roles: ['game'],
    problem: '방치형 RPG는 "하루에 얼마나 성장했나"가 재미의 전부입니다. 그런데 수치를 코드에 박아두면 밸런스를 한 번 볼 때마다 빌드를 다시 해야 해서, 6주 안에 검증을 반복할 수가 없었습니다.',
    decisions: [
      {
        q: '밸런스 수치를 어디에 둘 것인가',
        chose: '스테이지·아이템·몬스터·설정·튜토리얼·사운드값을 전부 CSV로 분리 (data/ 폴더 6종)',
        why: '기획 수치를 바꾸는 일이 코드 수정 → 빌드 → 실행이 아니라, CSV 한 줄 고치고 다시 실행으로 끝납니다.',
        alt: 'ScriptableObject — Unity 안에서만 수정 가능하고, 값 비교가 눈에 안 들어와서 CSV를 택했습니다.',
      },
      {
        q: '전투 로직을 MonoBehaviour에 둘 것인가',
        chose: '전투 규칙은 순수 C# 클래스, 화면은 그 결과를 그리는 역할로 분리',
        why: '전투가 화면 없이도 돌아가야 밸런스를 빠르게 반복할 수 있습니다.',
      },
    ],
    evidence: [
      { label: '커밋', value: '196', note: '기획~완성 전 구간' },
      { label: '데이터 CSV', value: '6종', note: '스테이지·아이템·몬스터·설정·튜토리얼·사운드' },
      { label: '아이템', value: '100종', note: 'items.csv 실측' },
      { label: '스테이지', value: '20개', note: 'stages.csv 실측' },
    ],
    limits: [
      '스테이지 20개까지 만들고 6주가 끝났습니다. 원래 목표는 100개였는데, 늘리기 전에 "한 사이클이 재미있는가"를 먼저 확인하는 쪽을 택했습니다.',
      '사람 손으로 플레이한 테스트는 0명입니다. 밸런스는 데이터 수치로만 확인했습니다.',
    ],
  },
  {
    id: 'spirit-merge',
    title: 'Spirit Merge (숲의 정령사)',
    type: 'unity',
    description: '정령 머지 + 자동 전투 방치형 RPG. 4×4 보드에서 정령을 합성해 진화시키고, 파티 통합 HP로 자동 전투를 돌리는 무한 성장 구조입니다. 핵심은 게임 로직을 Unity 없이도 검증할 수 있게 떼어낸 점입니다.',
    image: '/images/spirit-merge.webp',
    technologies: ['Unity 6', 'C#', 'Merge System', 'Auto Battle', 'SOLID Principles', 'Save System', 'WebGL', 'CLI Automation'],
    github: 'https://github.com/kongnamul-muchim/SpiritMerge',
    demo: 'https://kongnamul-muchim.github.io/SpiritMerge/',
    featured: true,
    devPeriod: '2026-07-28 ~ 2026-08-06',
    hasPlayableDemo: false,
    roles: ['game'],
    problem: '머지 게임은 "합성 → 전투 → 보상 → 다시 합성"이 한 바퀴 도는지가 전부입니다. 그런데 머지·전투·파견·저장이 전부 씬에 붙어 있으면, 한 바퀴를 확인할 때마다 마우스로 30번은 클릭해야 했습니다.',
    decisions: [
      {
        q: 'AI가 "MonoBehaviour 하나에 다 넣으면 빠르다"고 제안했다',
        chose: '거부하고 Core(순수 C#) / Presentation(Unity) 분리 + DI 조립',
        why: '게임 규칙이 Unity에 묶이면 테스트를 못 합니다. 규칙을 떼어내야 30번 클릭 대신 명령 한 줄로 같은 상태를 만들 수 있습니다.',
      },
      {
        q: '검증을 눈으로 할 것인가, 명령으로 할 것인가',
        chose: 'Unity에 TCP CLI 서버를 붙여 검증 명령 67개를 만들었다',
        why: '파티 채우기·골드 지급·보드 상태 출력 같은 명령으로 원하는 상황을 즉시 재현할 수 있어서, 버그를 "재현 → 고침 → 같은 명령으로 재확인" 순서로 처리했습니다.',
        alt: '수동 플레이 테스트 — 같은 상황을 다시 만들기가 사실상 불가능했습니다.',
      },
      {
        q: '세이브가 중간에 끊기면?',
        chose: '임시 파일에 먼저 쓰고 → 검증 후 → 원본 교체 (원자적 쓰기 + 백업)',
        why: '앱이 강제 종료돼도 저장 파일이 반쯤 망가진 상태로 남지 않게 하려고요.',
      },
    ],
    evidence: [
      { label: 'CLI 검증 명령', value: '67개', note: 'CliTestSuite 실측' },
      { label: 'C# 스크립트', value: '88개', note: 'Assets/Scripts' },
      { label: '커밋', value: '32', note: '10일 집중 개발' },
      { label: 'WebGL 배포', value: '1', note: '브라우저 실기동 확인' },
    ],
    limits: [
      '자동 검증은 "상태가 맞는가"만 봅니다. 타격감·연출 타이밍 같은 재미 요소는 결국 직접 플레이로 봐야 했습니다.',
      '10일 안에 만든 프로토타입이라 사운드와 연출은 최소한만 넣었습니다.',
    ],
  },
  {
    id: 'hide-and-ink',
    title: 'Hide & Ink (문어의 먹물꿈질)',
    type: 'unity',
    description: '4인 팀 프로젝트. 환경에 의태하고 포식자 능력을 복사하는 로그라이크 성장 어드벤처입니다. 시스템 아키텍트 겸 코어 프로그래머로 전체 구조와 핵심 상태머신을 맡았습니다.',
    image: '/images/hide-and-ink.webp',
    technologies: ['Unity 6', 'C#', 'DI Container', 'FSM', '협업 설계', 'Git 800+ Commits'],
    github: 'https://github.com/kongnamul-muchim/TeamProject',
    featured: false,
    devPeriod: '2026-03 ~ 2026-05',
    roles: ['game'],
    problem: '4명이 각자 다른 시스템을 만들면, 중간에 합칠 때 서로의 코드가 안 맞아서 터집니다. 팀에서 제일 먼저 정해야 했던 건 "각자 어디까지 건드릴 수 있는가"였습니다.',
    decisions: [
      {
        q: '4인 협업에서 충돌을 어떻게 줄일 것인가',
        chose: '시스템 경계를 먼저 긋고, 경계 사이는 이벤트로만 연결',
        why: '내 시스템이 남의 코드를 직접 호출하면 그 사람 코드가 바뀔 때마다 내 것이 깨집니다. 이벤트로 연결하면 서로를 몰라도 됩니다.',
      },
      {
        q: '의태·능력복사 상태 전환을 어떻게 관리할 것인가',
        chose: 'FSM으로 상태를 명시적으로 분리',
        why: '"의태 중인데 피격됨" 같은 조합이 if문으로 얽히면 버그가 나옵니다. 상태를 표로 그려두면 빠진 조합이 눈에 보입니다.',
      },
    ],
    evidence: [
      { label: '팀 커밋', value: '801', note: '4인 합계 (Git 실측)' },
      { label: '개발 기간', value: '약 3개월', note: '' },
      { label: '내 역할', value: '아키텍처 · FSM', note: '코어 프로그래머' },
    ],
    limits: [
      '801 커밋은 4인 합계입니다. 제가 직접 쓴 범위는 아키텍처 설계와 FSM·코어 시스템입니다.',
      '팀 프로젝트라 아트·사운드는 다른 팀원 담당이라 제 작업 범위가 아닙니다.',
    ],
  },
  {
    id: 'unity-minigames',
    title: 'Unity 미니게임 프로토타입 7종',
    type: 'unity',
    description: '블록퍼즐·스텔스 슈터·타워디펜스·로그라이트·메트로바니아·매치3·물리퍼즐 — 7개 장르를 같은 Core/Shell + DI 구조로 빠르게 찍어낸 컬렉션입니다.',
    image: '/images/match3.webp',
    technologies: ['Unity 6', 'C#', 'DI Container', 'SOLID Principles', 'BFS', 'Behavior Tree', 'Procedural Generation', '2D Physics'],
    featured: false,
    devPeriod: '2026-03 ~ 2026-05',
    roles: ['game'],
    problem: '장르마다 코드를 새로 짜면, 두 번째 게임부터는 항상 같은 부분(입력·상태·저장·사운드)을 다시 만들게 됩니다. 그 반복을 없애는 게 목적이었습니다.',
    decisions: [
      {
        q: '7개 장르를 각각 따로 만들 것인가',
        chose: '공통 Core/Shell + DI를 먼저 만들고 장르는 그 위에 얹기',
        why: '2번째부터는 게임 규칙만 작성하면 되니, 같은 시간에 7개를 확인할 수 있었습니다.',
      },
      {
        q: '게임 로직을 어떻게 검증할 것인가',
        chose: '로직은 순수 C#으로 두고 의존성 없이 실행',
        why: 'Unity 에디터를 열지 않고도 규칙이 맞는지 확인할 수 있습니다.',
      },
    ],
    evidence: [
      { label: '장르', value: '7종', note: '서로 다른 규칙' },
      { label: '공통 구조', value: '1개', note: 'Core/Shell + DI' },
    ],
    limits: [
      '7종 모두 "한 판 굴러가는 것"까지가 목표였습니다. 콘텐츠 양보다 구조 검증이 목적이라 각 게임의 분량은 적습니다.',
    ],
  },
  {
    id: 'resonance',
    title: '잔향 (Resonance)',
    type: 'web',
    description: 'Vanilla JS 턴제 전략 RPG — 완성. 6개 직업, 스킬 54종, 잔향 54종, 유물 129종. 각 직업마다 고유 엔딩이 갈립니다. 프레임워크 없이 DI 패턴과 이벤트 버스로 조립했습니다.',
    image: '/images/resonance.webp',
    technologies: ['Vanilla JS', 'CSS3', 'HTML5', 'Turn-based RPG', 'DI Pattern', 'Event System', 'Ending x6', 'Legacy Boss'],
    demo: 'https://games.olivilo.shop/resonance/',
    featured: false,
    devPeriod: '2026-05-29 ~ 2026-06-21',
    hasPlayableDemo: true,
    roles: ['game'],
    problem: 'Unity 없이 브라우저에서 바로 열리는 게임을 만들고 싶었습니다. 설치도, 빌드도 없이 링크만 누르면 시작되는 형태요.',
    decisions: [
      {
        q: 'React를 쓸 것인가, 순수 JS로 갈 것인가',
        chose: '프레임워크 없이 Vanilla JS + 자체 이벤트 버스',
        why: '게임 상태가 한 곳에서만 바뀌어야 턴 순서 버그가 안 납니다. 라이브러리 없이 상태 흐름을 직접 통제하는 편이 디버깅에 유리했습니다.',
      },
      {
        q: '직업 6개를 각각 따로 구현할 것인가',
        chose: '스킬을 데이터로 정의하고 효과는 핸들러로 분리',
        why: '새 스킬을 추가할 때 기존 코드를 안 건드려도 됩니다.',
      },
    ],
    evidence: [
      { label: '직업', value: '6종', note: '각각 고유 엔딩' },
      { label: '스킬 / 잔향', value: '54 / 54', note: '데이터 파일 실측' },
      { label: '유물', value: '129종', note: '' },
      { label: '커밋', value: '109', note: '' },
    ],
    limits: [
      '그래픽은 전부 CSS와 텍스트입니다. 아트 리소스 없이 규칙과 재미만으로 승부한 프로젝트입니다.',
    ],
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    type: 'web',
    description: '강화·스킬트리·프레스티지가 있는 인크리멘털 클리커. 새로고침해도 진행도가 유지되고, 서버에 기록이 남습니다.',
    image: '/images/cookie-clicker.webp',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/CookieClicker',
    demo: 'https://cookieclicker.olivilo.shop',
    featured: false,
    devPeriod: '2026-03-30 ~ 2026-03-31',
    hasPlayableDemo: true,
    roles: ['game', 'backend'],
    problem: '클리커 게임의 재미는 "숫자가 커지는 것"인데, 새로고침 한 번에 다 사라지면 그 재미가 끊깁니다. 저장을 서버에 두는 게 처음부터 목표였습니다.',
    decisions: [
      {
        q: '진행도를 어디에 저장할 것인가',
        chose: 'localStorage가 아니라 PostgreSQL + Prisma',
        why: '기기를 바꿔도 이어서 할 수 있고, 나중에 순위표를 붙일 때 구조를 안 바꿔도 됩니다.',
      },
    ],
    evidence: [
      { label: '개발 기간', value: '2일', note: '' },
      { label: '커밋', value: '13', note: '' },
      { label: '저장', value: '서버 DB', note: 'PostgreSQL' },
    ],
    limits: [
      '2일 안에 만든 프로토타입이라 콘텐츠는 적습니다. 구조(저장·성장 사이클)를 확인하는 게 목적이었습니다.',
    ],
  },
  {
    id: 'minigame-collection',
    title: 'Mini Game Collection',
    type: 'web',
    description: '지뢰찾기·스도쿠·테트리스·오목·체스·패턴기억 6종을 한 곳에. 혼자서도, AI와 대전도 가능합니다. C#을 WebAssembly로 돌리는 Blazor 위에서 게임마다 테스트 프로젝트를 따로 두었습니다.',
    image: '/images/minigame-collection.webp',
    technologies: ['Blazor WebAssembly', '.NET 8.0', 'C# 12', 'SOLID Architecture', 'xUnit'],
    github: 'https://github.com/kongnamul-muchim/MiniGameCollection',
    demo: 'https://games.olivilo.shop/minigame/',
    featured: false,
    devPeriod: '2026-03-15 ~ 2026-04-02',
    hasPlayableDemo: true,
    roles: ['game'],
    problem: 'C#을 브라우저에서 그대로 돌릴 수 있는지 직접 확인하고 싶었습니다. Unity 말고 다른 길도 있는지 보는 게 목적이었습니다.',
    decisions: [
      {
        q: '게임마다 로직을 따로 둘 것인가',
        chose: '공통 보드·턴·AI 인터페이스를 먼저 정의',
        why: '6개 게임이 사실 "보드 + 턴 + 상대"라는 같은 뼈대를 씁니다. 뼈대를 공유하면 검증도 한 곳에서 됩니다.',
      },
      {
        q: '테스트를 한 프로젝트에 몰아둘 것인가',
        chose: '게임별로 테스트 프로젝트를 따로',
        why: '한 게임을 고쳤을 때 다른 게임이 깨졌는지 바로 알 수 있습니다.',
      },
    ],
    evidence: [
      { label: '게임', value: '6종', note: '지뢰찾기·스도쿠·테트리스·오목·체스·패턴기억' },
      { label: '테스트 프로젝트', value: '7개', note: 'Core + 게임별 6개' },
      { label: '커밋', value: '57', note: '' },
      { label: '실행 환경', value: 'WebAssembly', note: '설치 없이 브라우저' },
    ],
    limits: [
      'AI 대전은 미니맥스/휴리스틱 수준입니다. 강한 상대를 만드는 게 목표는 아니었습니다.',
    ],
  },
  {
    id: 'community-board',
    title: 'Community Board',
    type: 'web',
    description: '실제 운영 중인 커뮤니티 게시판. 회원가입·로그인, 글쓰기, 댓글, 좋아요, 알림까지 붙어 있습니다. 이 포트폴리오 사이트의 출발점이 된 프로젝트입니다.',
    image: '/images/community-board.webp',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 'NextAuth'],
    github: 'https://github.com/kongnamul-muchim/community-board',
    demo: '/community',
    featured: false,
    devPeriod: '2026-03-30',
    roles: ['backend'],
    problem: '게시판은 "로그인한 사람만 쓰기"가 되어야 하는데, 권한을 화면에서만 막으면 API를 직접 호출해 우회할 수 있습니다.',
    decisions: [
      {
        q: '권한 검사를 어디에 둘 것인가',
        chose: '화면이 아니라 API 라우트와 미들웨어에서 검사',
        why: '화면은 숨기는 것이고, 서버가 막아야 실제로 막힙니다.',
      },
    ],
    evidence: [
      { label: '기능', value: '6종', note: '가입·로그인·글·댓글·좋아요·알림' },
      { label: '권한', value: '서버 검사', note: 'NextAuth + 미들웨어' },
      { label: '상태', value: '운영 중', note: '이 사이트 /community' },
    ],
    limits: [
      '신고·차단 같은 운영 기능은 없습니다. 실제 회원이 적어서 필요해지지 않았습니다.',
    ],
  },
  {
    id: 'aichat',
    title: 'AIChat',
    type: 'web',
    description: '문서를 올리면 그 내용을 근거로 답하는 RAG 챗봇. 한국어 문서를 넣고, 과거 대화를 기억하고, 검색된 근거를 함께 보여줍니다. (FastAPI + pgvector + DeepSeek)',
    image: '/images/aichat.svg',
    technologies: ['Next.js 14', 'TypeScript', 'Python FastAPI', 'pgvector', 'DeepSeek V4', 'RAG', 'PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/AIChatBot',
    demo: '/chat',
    featured: false,
    hasPlayableDemo: true,
    devPeriod: '2026-05-19',
    roles: ['backend'],
    problem: 'LLM에게 그냥 물으면 없는 내용을 그럴듯하게 지어냅니다. 내 문서 안에서만 답하게 하려면 "먼저 찾고, 그 다음 생성"하는 구조가 필요했습니다.',
    decisions: [
      {
        q: '검색과 생성을 어떻게 나눌 것인가',
        chose: 'pgvector로 문서 조각을 먼저 검색 → 그 조각만 프롬프트에 넣고 생성',
        why: '모델이 참고한 근거를 화면에 같이 보여줄 수 있어서, 답이 틀렸을 때 어디서 틀렸는지 추적됩니다.',
      },
      {
        q: '대화 기억을 어디까지 넣을 것인가',
        chose: '전체 대화가 아니라 요약 + 최근 턴만 컨텍스트에 포함',
        why: '대화가 길어지면 토큰이 터지고, 앞부분이 뒤쪽 답변을 오염시킵니다.',
      },
    ],
    evidence: [
      { label: 'API 코드', value: '4,196줄', note: 'Python 32개 파일' },
      { label: '검색', value: 'pgvector', note: 'PostgreSQL 확장' },
      { label: '데모', value: '운영 중', note: '이 사이트 /chat' },
    ],
    limits: [
      '문서 청킹은 고정 크기로 잘라서, 표나 코드가 중간에 끊기면 검색 품질이 떨어집니다.',
      '한국어 위주로만 검증했습니다.',
    ],
  },
  {
    id: 'autoflow',
    title: 'AutoFlow',
    type: 'server',
    description: 'AI 업무 자동화 엔진. 이커머스 상품 설명·마케팅 리포트와 문서 요약·업무 리포트를 하나의 구조로 처리합니다. 새 업무는 코드 수정 없이 핸들러 등록만으로 추가됩니다.',
    image: '/images/autoflow.svg',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Clean Architecture', 'DI Container', 'SOLID Principles', 'Claude API'],
    github: 'https://github.com/kongnamul-muchim/autoflow',
    demo: 'https://games.olivilo.shop/autoflow/',
    featured: true,
    hasPlayableDemo: true,
    devPeriod: '2026-06-14 ~ 현재',
    roles: ['backend'],
    problem: 'AI로 업무를 자동화하는 코드는 업무마다 거의 똑같습니다. 다른 건 "무엇을 시킬지"뿐인데, 그걸 매번 새 파일로 만들면 10번째 업무에서 코드가 10벌이 됩니다.',
    decisions: [
      {
        q: '업무가 늘어날 때마다 코드를 고칠 것인가',
        chose: 'TaskHandlerRegistry 패턴 — 업무를 등록만 하면 붙는 구조',
        why: '기존 코드를 열지 않고 새 업무를 추가할 수 있어야, AI 모델을 바꾸거나 업무를 늘릴 때 기존 것이 안 깨집니다.',
        alt: 'if/switch 분기 — 업무 10개만 넘어가도 읽을 수 없게 됩니다.',
      },
      {
        q: 'AI 호출부를 업무마다 따로 둘 것인가',
        chose: 'IAiService로 제네릭화해서 업무 코드가 특정 모델을 모르게',
        why: 'Claude를 다른 모델로 바꿀 때 업무 코드 10개를 고치는 대신, 구현체 1개만 갈아끼우면 됩니다.',
      },
      {
        q: 'API 키 없이도 보여줄 수 있는가',
        chose: 'Mock 모드 내장',
        why: '면접관이 키를 넣지 않아도 데모가 실제로 돌아가야 구조를 확인할 수 있습니다.',
      },
    ],
    evidence: [
      { label: '업무 모듈', value: '2종', note: 'Commerce · Office' },
      { label: '커밋', value: '6', note: '짧게 만든 프로토타입' },
      { label: '데모', value: 'Mock 모드', note: '키 없이 실행 가능' },
    ],
    limits: [
      '실제 고객사에 적용한 적은 없습니다. 구조 검증용 프로토타입이고 커밋도 6개로 적습니다.',
      '업무 모듈이 2종뿐이라, 3번째 업무를 붙일 때 구조가 정말 버티는지는 아직 증명 전입니다.',
    ],
  },
  {
    id: 'portfolio-site',
    title: '이 포트폴리오 사이트 (Portfolio Site)',
    type: 'server',
    description: '지금 보고 있는 이 사이트입니다. Next.js App Router + Prisma + PostgreSQL + Docker로 직접 설계·구축·운영 중입니다. 게시판·RAG 챗봇·채용공고 관리가 한 앱에 들어 있고, VPS에서 컨테이너로 돌아갑니다.',
    image: '/images/portfolio-site.webp',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker', 'RAG (pgvector)', 'Cloudflare', 'nginx'],
    github: 'https://github.com/kongnamul-muchim/portfolio-site',
    featured: true,
    devPeriod: '2026-05 ~ 현재',
    roles: ['backend', 'infra'],
    problem: '포트폴리오를 남의 플랫폼에 올리면 "그 플랫폼이 사라지면 끝"입니다. 직접 서버를 굴려보는 것 자체가 증명이 되도록, 이 사이트를 스스로 운영하기로 했습니다.',
    decisions: [
      {
        q: '배포를 어디에 맡길 것인가',
        chose: '직접 VPS + Docker + nginx + Cloudflare',
        why: '장애를 직접 겪어야 서버를 압니다. 실제로 포트 스캔, 502, 컨테이너 다운을 전부 겪고 고쳤습니다.',
      },
      {
        q: '서버가 인터넷에 그대로 노출되는 문제',
        chose: 'SSH 포트 변경 + root 원격 로그인 차단(키만) + UFW + Fail2Ban(3회 실패 시 7일 차단)',
        why: '열어둔 채로 두면 몇 시간 안에 자동 공격이 들어옵니다. 접속 기록에서 먼저 발견하고 막았습니다.',
      },
      {
        q: '수정할 때마다 서비스가 죽으면?',
        chose: '테스트 포트(3002) → 운영 포트(3001) 2단계 배포',
        why: '바로 운영에 올리면 사이트가 깨진 채로 면접관이 볼 수 있습니다. 먼저 확인하고 넘깁니다.',
      },
    ],
    evidence: [
      { label: '커밋', value: '40', note: '' },
      { label: '운영', value: '직접 운영', note: '컨테이너 + nginx + Cloudflare' },
      { label: '배포 절차', value: '2단계', note: '테스트 → 운영' },
      { label: '보안', value: '4중', note: 'SSH·UFW·Fail2Ban·프록시' },
    ],
    limits: [
      '트래픽이 거의 없는 개인 사이트라, 대규모 부하 상황은 검증하지 못했습니다.',
      '백업은 수동 스크립트입니다. 자동 백업·복구 훈련은 아직 안 했습니다.',
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.id === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured)
}

export function getOtherProjects(): Project[] {
  return projects.filter(p => !p.featured)
}

export function getProjectsByRole(role: RoleTag): Project[] {
  return projects.filter(p => p.roles?.includes(role))
}

export const projectTypes: { value: string; label: string; icon: string }[] = [
  { value: 'unity', label: 'Unity', icon: '🎮' },
  { value: 'web', label: 'Web', icon: '🌐' },
  { value: 'package', label: 'Package', icon: '📦' },
  { value: 'server', label: 'Server', icon: '🖥️' },
  { value: 'docs', label: 'Docs', icon: '📄' },
  { value: 'wip', label: '제작중', icon: '🔨' },
]
