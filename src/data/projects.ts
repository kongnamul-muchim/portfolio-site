export type ProjectType = 'unity' | 'web' | 'package' | 'server' | 'docs' | 'wip'

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
}

export const projects: Project[] = [
  {
    id: 'chaincrush',
    title: 'BlockPuzzle',
    type: 'unity',
    description: 'Core/Shell 완전 분리 아키텍처의 10×10 블록 퍼즐. BFS 연쇄 제거 + 오프라인 AI 힌트 엔진 자체 개발. 순수 C# DI Container로 Unity 의존성 제로. 2일 만에 프로토타입 → 지속적인 리팩토링으로 아키텍처 완성.',
    image: '/images/chaincrush.svg',
    technologies: ['Unity 6', 'C#', 'DI Container', 'BFS', 'AI Hint System', 'SOLID Principles'],
    github: 'https://github.com/kongnamul-muchim/BlockPuzzle',
    demo: 'https://kongnamul-muchim.github.io/BlockPuzzle/',
    featured: true,
    devPeriod: '2026-05-13 ~ 2026-05-14',
    hasPlayableDemo: false,
  },
  {
    id: 'shotfire',
    title: 'ShotFire',
    type: 'unity',
    description: 'Top-Down 2D 스텔스 액션. 적의 시야를 피해 그림자 속을 이동하고, 소음에 주의하며 은밀히 제거하세요. 4종 무기, 적 AI와의 심리전이 포인트! (Behavior Tree + 절차적 맵)',
    image: '/images/shotfire.svg',
    technologies: ['Unity 6', 'C#', 'DI Container', 'Behavior Tree', 'Procedural Generation', 'URP 2D'],
    github: 'https://github.com/kongnamul-muchim/ShotFire',
    demo: 'https://kongnamul-muchim.github.io/ShotFire',
    featured: false,
    devPeriod: '2026-05-08 ~ 2026-05-12',
    hasPlayableDemo: false,
  },
  {
    id: 'afk',
    title: 'AFK Idle RPG',
    type: 'unity',
    description: '방치형 RPG — 6주 동안 기획부터 완성까지. 자동 전투, 4종 장비 합성, 환생 시스템을 DI Container + Event-driven 아키텍처로 구현. CSV 데이터 파이프라인으로 100+ 스테이지 밸런스를 코드 수정 없이 조절 가능.',
    image: '/images/afk.png',
    technologies: ['Unity 6', 'C#', 'DI Container', 'SOLID Principles', 'Event-driven Architecture', 'CSV Data Pipeline'],
    github: 'https://github.com/kongnamul-muchim/AFK',
    featured: false,
    devPeriod: '2026-03-27 ~ 2026-05-07',
    hasPlayableDemo: false,
  },
  {
    id: 'minigame-collection',
    title: 'Mini Game Collection',
    type: 'web',
    description: '6가지 게임을 한 곳에! 지뢰찾기, 스도쿠, 테트리스, 오목, 체스를 브라우저에서 바로 플레이. 혼자 두뇌싸움 하거나 AI와 대전 가능. (Blazor WebAssembly + SOLID)',
    image: '/images/minigame-collection.png',
    technologies: ['Blazor WebAssembly', '.NET 8.0', 'C# 12', 'SOLID Architecture'],
    github: 'https://github.com/kongnamul-muchim/MiniGameCollection',
    demo: 'https://games.olivilo.shop/minigame/',
    featured: false,
    devPeriod: '2026-03-15 ~ 2026-04-02',
    hasPlayableDemo: true,
  },
  {
    id: 'community-board',
    title: 'Community Board',
    type: 'web',
    description: '실제 운영 중인 커뮤니티 게시판. 회원가입/로그인, 글쓰기, 댓글, 좋아요, 알림까지! 포트폴리오 사이트의 기반이 된 프로젝트예요. (NextAuth + Prisma + 반응형)',
    image: '/images/community-board.png',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 'NextAuth'],
    github: 'https://github.com/kongnamul-muchim/community-board',
    demo: '/community',
    featured: false,
    devPeriod: '2026-03-30',
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    type: 'server',
    description: 'Docker + PostgreSQL로 직접 운영하는 풀스택 인크리멘털 게임. 강화/스킬트리/프레스티지 시스템 자체 구현. Next.js 서버사이드 저장으로 새로고침해도 진행도 유지. Cloudflare + nginx + fail2ban으로 직접 보안 구성.',
    image: '/images/cookie-clicker.png',
    technologies: ['Next.js 16', 'TypeScript', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/CookieClicker',
    demo: 'https://cookieclicker.olivilo.shop',
    featured: true,
    devPeriod: '2026-03-30 ~ 2026-03-31',
    hasPlayableDemo: true,
  },
  {
    id: 'defencegame',
    title: 'DefenceGame',
    type: 'unity',
    description: '4종 타워를 전략적으로 배치하는 타워 디펜스. 궁수/마법사/레이저/메이지타워 각각 특성이 달라요. 타워 레벨업 + 특수 능력 해금으로 몰려오는 적을 막아내는 재미!',
    image: '/images/defencegame.png',
    technologies: ['Unity', 'C#', 'Tower Defense', 'Special Ability System'],
    github: 'https://github.com/kongnamul-muchim/DefenceGame',
    featured: false,
    devPeriod: '2026-03-09 ~ 2026-03-12',
  },
  {
    id: 'greeddungeon',
    title: 'GreedDungeon',
    type: 'unity',
    description: '턴제 로그라이트 던전 탐험. 행동 게이지를 잘 관리하며 한 턴 한 턴 전략적으로 플레이! 랜덤 장비 파밍 + 스킬 조합으로 매번 다른 던전 경험을.',
    image: '/images/greeddungeon.png',
    technologies: ['Unity', 'C#', 'Roguelite', 'Turn-based Combat'],
    github: 'https://github.com/kongnamul-muchim/GreedDungeon',
    featured: false,
    devPeriod: '2026-03-19 ~ 2026-03-27',
  },
  {
    id: 'pathfinder',
    title: 'Pathfinder',
    type: 'unity',
    description: '메트로바니아 스타일 2D 플랫포머. 새로운 능력을 얻을 때마다 열리는 길, 이전엔 못 가던 곳을 탐험하는 재미! 즉사 함정을 피하며 스테이지를 클리어하세요.',
    image: '/images/pathfinder.png',
    technologies: ['Unity', 'C#', 'Metroidvania', 'Custom DI Container'],
    github: 'https://github.com/kongnamul-muchim/Pathfinder',
    featured: false,
    devPeriod: '2026-03-16 ~ 2026-03-19',
  },
  {
    id: 'shotup',
    title: 'ShotUp',
    type: 'unity',
    description: '물리엔진 기반 공 발사 게임. 마우스로 드래그해서 조준하고 힘 조절! 각도와 파워를 계산해서 골인시키는 성취감. 간단하지만 중독성 강한 물리 퍼즐.',
    image: '/images/shotup.png',
    technologies: ['Unity', 'C#', 'Physics-based', '2D Physics'],
    github: 'https://github.com/kongnamul-muchim/ShotUp',
    featured: false,
    devPeriod: '2026-03-09 ~ 2026-03-10',
  },

  {
    id: 'kirdia-simulator',
    title: 'Kirdia Simulator',
    type: 'docs',
    description: 'AI GM이 진행하는 웹소설 세계관 시뮬레이터. 내 선택으로 스토리가 바뀌고 캐릭터와 관계가 발전해요. 직접 세계관을 만들어가는 롤플레잉 경험!',
    image: '/images/kirdia-simulator.svg',
    technologies: ['Markdown', 'Worldbuilding', 'AI Agent System', 'Event-driven Design'],
    github: 'https://github.com/kongnamul-muchim/KirdiaSimulator',
    featured: false,
    devPeriod: '2026-03-30',
  },
  {
    id: 'aichat',
    title: 'AIChat',
    type: 'web',
    description: 'AI 사서 루나와 대화하는 RAG 챗봇. 문서를 업로드하면 그 내용을 바탕으로 지능적으로 답변해요. 한국어 특화, 과거 대화 기억, 사용자 취향 학습! (DeepSeek V4 + pgvector)',
    image: '/images/aichat.svg',
    technologies: ['Next.js 14', 'TypeScript', 'Python FastAPI', 'pgvector', 'DeepSeek V4', 'RAG', 'PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/AIChatBot',
    demo: '/chat',
    featured: true,
    hasPlayableDemo: true,
    devPeriod: '2026-05-19',
  },
  {
    id: 'match3',
    title: 'Match3',
    type: 'unity',
    description: '하루 만에 완성한 8×8 매치-3 퍼즐. BFS 연쇄 캐스케이드 + AI 힌트 시스템 탑재. BlockPuzzle과 동일한 Core/Shell + DI 아키텍처를 재사용하여 빠르게 프로토타이핑. Vercel Leaderboard로 실시간 점수 경쟁 지원.',
    image: '/images/match3.png',
    technologies: ['Unity 6', 'C#', 'DI Container', 'BFS Match Detection', 'Cascade System', 'AI Hint System', 'SOLID Principles'],
    github: 'https://github.com/kongnamul-muchim/Match3',
    demo: 'https://games.olivilo.shop/match3/',
    hasPlayableDemo: false,
    featured: false,
    devPeriod: '2026-05-26',
  },
  {
    id: 'resonance',
    title: '잔향 (Resonance)',
    type: 'web',
    description: 'Vanilla JS 턴제 전략 RPG — 완성! 6개 직업, 각각 고유 엔딩과 레거시 시스템. 40+ 스킬, 20+ 잔향, 18+ 유물. DI 패턴 + 이벤트 기반 아키텍처.',
    image: '/images/resonance.png',
    technologies: ['Vanilla JS', 'CSS3', 'HTML5', 'Turn-based RPG', 'DI Pattern', 'Event System', 'Ending x6', 'Legacy Boss'],
    github: 'https://github.com/kongnamul-muchim/resonance-rpg',
    demo: 'https://games.olivilo.shop/resonance/',
    featured: true,
    devPeriod: '2026-05-29 ~ 2026-06-21',
    hasPlayableDemo: true,
  },
  {
    id: 'hide-and-ink',
    title: 'Hide & Ink (문어의 먹물꿈질)',
    type: 'unity',
    description: '4인 팀 프로젝트. 종이 질감 문어가 환경에 자동 의태하고 포식자 능력을 복사하는 로그라이크 성장 어드벤처. 시스템 아키텍트 & 코어 프로그래머로서 전체 아키텍처 설계 및 핵심 상태머신(FSM) 구현, 4인 팀 협업 구조 설계.',
    image: '/images/hide-and-ink.png',
    technologies: ['Unity 6', 'C#', 'DI Container', 'FSM', '협업 설계', 'Git 800+ Commits'],
    github: 'https://github.com/kongnamul-muchim/TeamProject',
    featured: true,
    devPeriod: '2026-03 ~ 2026-05',
  },
  {
    id: 'autoflow',
    title: 'AutoFlow',
    type: 'server',
    description: 'AI 기반 업무 자동화 시스템 — 모듈형 Clean Architecture. 이커머스 상품 설명/마케팅 리포트(Commerce Module)와 문서 요약/업무 리포트(Office Module)를 하나의 엔진으로 통합. TaskHandlerRegistry 패턴으로 OCP 준수, IAiService 제네릭화로 DIP 달성. Mock 모드로 API 키 없이 즉시 데모 가능.',
    image: '/images/autoflow.svg',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Clean Architecture', 'DI Container', 'SOLID Principles', 'Claude API'],
    github: 'https://github.com/kongnamul-muchim/autoflow',
    demo: 'https://games.olivilo.shop/autoflow/',
    featured: true,
    hasPlayableDemo: true,
    devPeriod: '2026-06-14 ~ 현재',
  },
  {
    id: 'spirit-merge',
    title: 'Spirit Merge (숲의 정령사)',
    type: 'unity',
    description: '정령 머지 + 자동 전투 방치형 RPG. 6속성×5성급 30종 정령을 4×4 머지 보드에서 합성해 진화시키고, 파티 통합 HP 기반 자동 전투로 스테이지를 밀어 올리는 무한 성장 구조. 25노드 업그레이드 트리, 파견/미션/레이드 의뢰 시스템, 원자적 쓰기+백업 자동 저장(오프라인 경과 반영). Unity TCP CLI로 14개 시스템 통합 검증 + WebGL 브라우저 실기동.',
    image: '/images/spirit-merge.png',
    technologies: ['Unity 6', 'C#', 'Merge System', 'Auto Battle', 'SOLID Principles', 'Save System', 'WebGL', 'CLI Automation'],
    github: 'https://github.com/kongnamul-muchim/SpiritMerge',
    demo: 'https://kongnamul-muchim.github.io/SpiritMerge/',
    featured: true,
    devPeriod: '2026-07-28 ~ 2026-08-06',
    hasPlayableDemo: false,
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

export const projectTypes: { value: string; label: string; icon: string }[] = [
  { value: 'unity', label: 'Unity', icon: '🎮' },
  { value: 'web', label: 'Web', icon: '🌐' },
  { value: 'package', label: 'Package', icon: '📦' },
  { value: 'server', label: 'Server', icon: '🖥️' },
  { value: 'docs', label: 'Docs', icon: '📄' },
  { value: 'wip', label: '제작중', icon: '🔨' },
]
