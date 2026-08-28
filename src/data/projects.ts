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
    id: 'afk',
    title: 'AFK Idle RPG',
    type: 'unity',
    description: '방치형 RPG — 6주 동안 기획부터 완성까지. 자동 전투, 4종 장비 합성, 환생 시스템을 DI Container + Event-driven 아키텍처로 구현. CSV 데이터 파이프라인으로 100+ 스테이지 밸런스를 코드 수정 없이 조절 가능.',
    image: '/images/afk.webp',
    technologies: ['Unity 6', 'C#', 'DI Container', 'SOLID Principles', 'Event-driven Architecture', 'CSV Data Pipeline'],
    github: 'https://github.com/kongnamul-muchim/AFK',
    featured: false,
    devPeriod: '2026-03-27 ~ 2026-05-07',
    hasPlayableDemo: false,
  },
  {
    id: 'spirit-merge',
    title: 'Spirit Merge (숲의 정령사)',
    type: 'unity',
    description: '정령 머지 + 자동 전투 방치형 RPG. 6속성×5성급 30종 정령을 4×4 머지 보드에서 합성해 진화시키고, 파티 통합 HP 기반 자동 전투로 스테이지를 밀어 올리는 무한 성장 구조. 25노드 업그레이드 트리, 파견/미션/레이드 의뢰 시스템, 원자적 쓰기+백업 자동 저장(오프라인 경과 반영). Unity TCP CLI로 14개 시스템 통합 검증 + WebGL 브라우저 실기동.',
    image: '/images/spirit-merge.webp',
    technologies: ['Unity 6', 'C#', 'Merge System', 'Auto Battle', 'SOLID Principles', 'Save System', 'WebGL', 'CLI Automation'],
    github: 'https://github.com/kongnamul-muchim/SpiritMerge',
    demo: 'https://kongnamul-muchim.github.io/SpiritMerge/',
    featured: true,
    devPeriod: '2026-07-28 ~ 2026-08-06',
    hasPlayableDemo: false,
  },
  {
    id: 'hide-and-ink',
    title: 'Hide & Ink (문어의 먹물꿈질)',
    type: 'unity',
    description: '4인 팀 프로젝트. 종이 질감 문어가 환경에 자동 의태하고 포식자 능력을 복사하는 로그라이크 성장 어드벤처. 시스템 아키텍트 & 코어 프로그래머로서 전체 아키텍처 설계 및 핵심 상태머신(FSM) 구현, 4인 팀 협업 구조 설계.',
    image: '/images/hide-and-ink.webp',
    technologies: ['Unity 6', 'C#', 'DI Container', 'FSM', '협업 설계', 'Git 800+ Commits'],
    github: 'https://github.com/kongnamul-muchim/TeamProject',
    featured: false,
    devPeriod: '2026-03 ~ 2026-05',
  },
  {
    id: 'unity-minigames',
    title: 'Unity 미니게임 프로토타입 7종',
    type: 'unity',
    description: '블록퍼즐·스텔스 슈터·타워디펜스·로그라이트·메트로바니아·매치3·물리퍼즐 — 서로 다른 7개 장르의 Unity 6 미니게임을 공통 Core/Shell + DI 아키텍처로 빠르게 프로토타이핑한 컬렉션. 순수 C# 게임 로직과 Unity View를 분리해 로직 전부를 의존성 없이 검증했습니다.',
    image: '/images/match3.webp',
    technologies: ['Unity 6', 'C#', 'DI Container', 'SOLID Principles', 'BFS', 'Behavior Tree', 'Procedural Generation', '2D Physics'],
    featured: false,
    devPeriod: '2026-03 ~ 2026-05',
  },
  {
    id: 'resonance',
    title: '잔향 (Resonance)',
    type: 'web',
    description: 'Vanilla JS 턴제 전략 RPG — 완성! 6개 직업, 각각 고유 엔딩과 레거시 시스템. 40+ 스킬, 20+ 잔향, 18+ 유물. DI 패턴 + 이벤트 기반 아키텍처.',
    image: '/images/resonance.webp',
    technologies: ['Vanilla JS', 'CSS3', 'HTML5', 'Turn-based RPG', 'DI Pattern', 'Event System', 'Ending x6', 'Legacy Boss'],
    github: 'https://github.com/kongnamul-muchim/resonance-rpg',
    demo: 'https://games.olivilo.shop/resonance/',
    featured: false,
    devPeriod: '2026-05-29 ~ 2026-06-21',
    hasPlayableDemo: true,
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    type: 'web',
    description: '강화·스킬트리·프레스티지 시스템을 갖춘 인크리멘털 클리커 게임. 클릭 한 번부터 자동 생산까지, 새로고침해도 진행도가 유지되는 성장 사이클을 구현했습니다.',
    image: '/images/cookie-clicker.webp',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/kongnamul-muchim/CookieClicker',
    demo: 'https://cookieclicker.olivilo.shop',
    featured: false,
    devPeriod: '2026-03-30 ~ 2026-03-31',
    hasPlayableDemo: true,
  },
  {
    id: 'minigame-collection',
    title: 'Mini Game Collection',
    type: 'web',
    description: '6가지 게임을 한 곳에! 지뢰찾기, 스도쿠, 테트리스, 오목, 체스를 브라우저에서 바로 플레이. 혼자 두뇌싸움 하거나 AI와 대전 가능. (Blazor WebAssembly + SOLID)',
    image: '/images/minigame-collection.webp',
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
    image: '/images/community-board.webp',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 'NextAuth'],
    github: 'https://github.com/kongnamul-muchim/community-board',
    demo: '/community',
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
    featured: false,
    hasPlayableDemo: true,
    devPeriod: '2026-05-19',
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
    id: 'portfolio-site',
    title: '이 포트폴리오 사이트 (Portfolio Site)',
    type: 'server',
    description: '지금 보고 있는 이 사이트 자체입니다. Next.js App Router + Prisma + PostgreSQL + Docker로 설계·구축·운영하는 풀스택 앱. 회원가입/로그인, 커뮤니티 게시판, RAG AI 챗봇, 채용공고 관리를 하나로 통합. VPS에서 Docker 컨테이너 운영, Cloudflare Proxy 보안, webhook 자동 배포까지 직접 구성.',
    image: '/images/portfolio-site.webp',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker', 'RAG (pgvector)', 'Cloudflare', 'nginx'],
    github: 'https://github.com/kongnamul-muchim/portfolio-site',
    featured: true,
    devPeriod: '2026-05 ~ 현재',
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