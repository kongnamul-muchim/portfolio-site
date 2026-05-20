export type ProjectType = 'unity' | 'web' | 'package' | 'server' | 'docs'

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
    title: 'ChainCrush',
    type: 'unity',
    description: '10×10 블록 연계 퍼즐 (ChainCrush). 순수 C# Core + Unity Shell 분리 아키텍처, DI 컨테이너, BFS 연쇄 제거, Vercel Serverless 리더보드.',
    image: '/images/chaincrush.png',
    technologies: ['Unity 6', 'C#', 'DI Container', 'BFS', 'SOLID Principles', 'Vercel Serverless', 'Neon PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/BlockPuzzle',
    demo: 'https://kongnamul-muchim.github.io/BlockPuzzle/',
    featured: true,
    devPeriod: '2026-05-13 ~ 2026-05-14',
    hasPlayableDemo: true,
  },
  {
    id: 'shotfire',
    title: 'ShotFire',
    type: 'unity',
    description: 'Top-Down 2D Stealth-Action Shooter. 시야/소음 기반 잠입 시스템, Behavior Tree AI, 4종 무기, 절차적 맵 생성.',
    image: '/images/shotfire.png',
    technologies: ['Unity 6', 'C#', 'DI Container', 'Behavior Tree', 'Procedural Generation', 'URP 2D'],
    github: 'https://github.com/kongnamul-muchim/ShotFire',
    demo: 'https://kongnamul-muchim.github.io/ShotFire',
    featured: true,
    devPeriod: '2026-05-08 ~ 2026-05-12',
    hasPlayableDemo: true,
  },
  {
    id: 'afk',
    title: 'AFK Idle RPG',
    type: 'unity',
    description: 'Unity 6 방치형 RPG. 자동 전투, 스테이지 진행, 장비 합성, 환생, 오프라인 보상 시스템. DI 컨테이너 및 SOLID 원칙 적용.',
    image: '/images/afk.png',
    technologies: ['Unity 6', 'C#', 'DI Container', 'SOLID Principles', 'Event-driven Architecture', 'CSV Data Pipeline'],
    github: 'https://github.com/kongnamul-muchim/AFK',
    demo: 'https://kongnamul-muchim.github.io/AFK/',
    featured: true,
    devPeriod: '2026-03-27 ~ 2026-05-07',
    hasPlayableDemo: true,
  },
  {
    id: 'minigame-collection',
    title: 'Mini Game Collection',
    type: 'web',
    description: 'Blazor WebAssembly 기반 미니게임 컬렉션. 6개의 게임 (지뢰찾기, 스도쿠, 테트리스, 오목, 체스 등), SOLID 원칙, AI 포함.',
    image: '/images/minigame-collection.png',
    technologies: ['Blazor WebAssembly', '.NET 8.0', 'C# 12', 'SOLID Architecture', 'Vercel'],
    github: 'https://github.com/kongnamul-muchim/MiniGameCollection',
    demo: 'https://mini-game-collection-five.vercel.app/',
    featured: true,
    devPeriod: '2026-03-15 ~ 2026-04-02',
    hasPlayableDemo: true,
  },
  {
    id: 'community-board',
    title: 'Community Board',
    type: 'web',
    description: 'Next.js 커뮤니티 게시판. NextAuth 인증, Prisma ORM, CRUD, 반응형 UI.',
    image: '/images/community-board.png',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 'NextAuth'],
    github: 'https://github.com/kongnamul-muchim/community-board',
    demo: 'https://community-board-nu.vercel.app',
    featured: false,
    devPeriod: '2026-03-30',
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    type: 'server',
    description: 'Next.js + Prisma + Neon 쿠키클리커. Vercel 배포, PostgreSQL 세션 저장, 자동 생산 업그레이드.',
    image: '/images/cookie-clicker.png',
    technologies: ['Next.js 16', 'TypeScript', 'Prisma', 'Neon (PostgreSQL)', 'Vercel'],
    github: 'https://github.com/kongnamul-muchim/CookieClicker',
    demo: 'https://cookie-clicker-rosy-xi.vercel.app',
    featured: false,
    devPeriod: '2026-03-30 ~ 2026-03-31',
    hasPlayableDemo: true,
  },
  {
    id: 'defencegame',
    title: 'DefenceGame',
    type: 'unity',
    description: '타워 디펜스 게임. 4종 타워 (궁수/마법사/레이저/메이지타워) 배치, 레벨업, 특수 능력 해금 시스템.',
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
    description: '2D 턴제 로그라이트 던전 크롤러. 행동 게이지 시스템, 장비/스킬/버프, 전투 비주얼 효과.',
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
    description: '메트로바니아 2D 플랫포머. 능력 해금으로 백트래킹, 즉사 함정, DI Container.',
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
    description: '공을 발사하여 골에 넣는 게임. 마우스 조준/파워 조절, 물리 기반 공 운동.',
    image: '/images/shotup.png',
    technologies: ['Unity', 'C#', 'Physics-based', '2D Physics'],
    github: 'https://github.com/kongnamul-muchim/ShotUp',
    featured: false,
    devPeriod: '2026-03-09 ~ 2026-03-10',
  },
  {
    id: 'gamedevtoolkit',
    title: 'GameDevToolkit',
    type: 'package',
    description: 'Unity 게임 개발을 위한 툴킷 패키지. 공통 기능을 모듈화하여 재사용 가능.',
    image: '/images/gamedevtoolkit.png',
    technologies: ['Unity', 'C#', 'Unity Package', 'Modular Design'],
    github: 'https://github.com/kongnamul-muchim/GameDevToolkit',
    featured: false,
    devPeriod: '2026-03-26',
  },
  {
    id: 'kirdia-simulator',
    title: 'Kirdia Simulator',
    type: 'docs',
    description: '웹소설 세계관 시뮬레이터. AI GM 시스템, 캐릭터 Role-play, 분기 스토리.',
    image: '/images/kirdia-simulator.png',
    technologies: ['Markdown', 'Worldbuilding', 'AI Agent System', 'Event-driven Design'],
    github: 'https://github.com/kongnamul-muchim/KirdiaSimulator',
    featured: false,
    devPeriod: '2026-03-30',
  },
  {
    id: 'aichat',
    title: 'AIChat',
    type: 'web',
    description: 'RAG(Retrieval-Augmented Generation) 기반 AI 채팅 시스템. 문서를 업로드하면 LLM이 검색해서 답변. DeepSeek V4 Flash + pgvector + 한국어 특화.',
    image: '/images/aichat.svg',
    technologies: ['Next.js 14', 'TypeScript', 'Python FastAPI', 'pgvector', 'DeepSeek V4', 'RAG', 'PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/AIChatBot',
    demo: '/chat',
    featured: true,
    hasPlayableDemo: true,
    devPeriod: '2026-05-19',
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
]
