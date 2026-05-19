import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects, getProjectBySlug, projectTypes } from '@/data/projects'

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }))
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const defaultImage = '/images/defult.jpeg'
  const hasRealImage = project.image !== '/images/placeholder.svg' && project.image !== defaultImage
  const displayImage = hasRealImage ? project.image : defaultImage
  const typeInfo = projectTypes.find(t => t.value === project.type)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0E]">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-[#22D3EE] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <header className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl p-5 sm:p-7 mb-6">
          <div className="flex items-center gap-2 mb-4">
            {typeInfo && (
              <span className="text-lg shrink-0">{typeInfo.icon}</span>
            )}
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937]">
              {typeInfo?.label || project.type}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#E5E7EB] mb-4 break-words leading-tight">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-[#9CA3AF] mb-5 break-words leading-relaxed">
            {project.description}
          </p>
          {project.devPeriod && (
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4">
              📅 {project.devPeriod}
            </p>
          )}
          <div className="flex flex-wrap gap-2 min-w-0">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937] whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Image */}
        <div className="relative w-full rounded-xl overflow-hidden mb-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] shadow-lg group">
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-auto max-h-[540px] object-contain transition-all duration-300 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-[#0D0D0E]/65 transition-opacity duration-300 group-hover:bg-[#0D0D0E]/10 pointer-events-none" />
        </div>

        {/* Detail Content */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl p-5 sm:p-7 mb-6 max-w-full min-w-0 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#E5E7EB] mb-5">
            Project Details
          </h2>
          <div className="space-y-6 text-gray-600 dark:text-[#9CA3AF] text-sm leading-relaxed min-w-0">
            <ProjectDetailContent slug={project.id} />
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 min-w-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="truncate">GitHub</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0D0D0E] font-semibold text-xs sm:text-sm rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="truncate">Live Demo</span>
            </a>
          )}
          {project.hasPlayableDemo && project.demo && (
            <Link
              href={`/play/${project.id}`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">Play Demo</span>
            </Link>
          )}
        </div>

        {/* Demo Frame for web projects */}
        {project.demo && (project.type === 'web' || project.type === 'server') && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#E5E7EB] mb-4">
              Live Preview
            </h2>
            <iframe
              src={project.demo}
              title={project.title}
              className="w-full h-[500px] border border-gray-200 dark:border-[#1F2937] rounded-xl bg-white dark:bg-[#111827]"
              loading="lazy"
            />
          </section>
        )}
      </article>
    </div>
  )
}

function ProjectDetailContent({ slug }: { slug: string }) {
  const details: Record<string, React.ReactNode> = {
    'shotfire': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Unity 6 엔진으로 개발한 탑다운 2D 스텔스 액션 슈터입니다. 순수 C# 코어 로직과 Unity View 레이어를 분리한 클린 아키텍처가 특징입니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Stealth System</strong> - 시야 콘 기반 탐지, 소음 시스템, 앉기/서기 자세별 시인성</li>
          <li><strong>Behavior Tree AI</strong> - Guard(순찰/추격/사격), Heavy(고정 방어), 팀 협동 경보 시스템</li>
          <li><strong>4 Weapons</strong> - Pistol, SMG, Shotgun, Rifle (현장 습득, 탄약 소진 시 자동 드랍)</li>
          <li><strong>Procedural Map Generation</strong> - 방-복도 기반 랜덤 맵 생성</li>
          <li><strong>Fog of War</strong> - 글로벌 라이트 0, 플레이어 중심 포인트 라이트</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Architecture</h3>
         <div className="overflow-x-auto -mx-2 sm:mx-0">
           <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`Assets/
├── Core/                    # Pure C# (no UnityEngine)
│   ├── Interfaces/          # IPlayerController, IVisionSystem, etc.
│   ├── Managers/            # DI Container, GameStateMachine
│   ├── Entities/            # Player, Enemy
│   ├── Stealth/             # VisionSystem, NoiseSystem
│   ├── Combat/              # CombatSystem, 4 weapon types
│   ├── AI/                  # TeamCoordinator
│   └── Level/               # MapDataProvider, MapGenerator
├── Unity/                   # Unity-dependent adapters
│   ├── Adapters/            # Input, Physics, Renderer, Audio
│   └── UI/                  # HUD, MissionCompleteScreen`}</pre>
         </div>
      </div>
    ),
    'afk': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Unity 6 엔진으로 개발한 2D 방치형 RPG 게임입니다. 캐릭터가 자동으로 탑을 오르며 몬스터와 전투하고, 장비를 수집/합성하여 성장합니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Auto Battle</strong> - 페이즈 기반 전투 시스템 (이동 → 조우 → 전투 → 처치)</li>
          <li><strong>Stage Progression</strong> - 점진적 난이도 상승, 보스 클리어 시 보상</li>
          <li><strong>Equipment System</strong> - 4종 장비, 5단계 희귀도, 합성 시스템</li>
          <li><strong>Rebirth</strong> - 초기화 + 영구 보너스</li>
          <li><strong>Offline Rewards</strong> - 오프라인 시간 비례 자원 획득</li>
          <li><strong>Mission System</strong> - 일일/주간 미션</li>
        </ul>
      </div>
    ),
    'minigame-collection': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Collection Overview</h3>
        <p>Blazor WebAssembly 기반으로 개발된 6개의 미니게임 컬렉션입니다. SOLID 원칙과 DI를 준수한 순수 C# Core 게임 로직으로 구성되었습니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1F2937]">
                <th className="text-left py-2 pr-4">Game</th>
                <th className="text-left py-2 pr-4">Description</th>
                <th className="text-left py-2">AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Pattern Memory', '패턴 기억 게임', '❌'],
                ['Minesweeper', '지뢰찾기', '❌'],
                ['Sudoku', '스도쿠 퍼즐', '❌'],
                ['Tetris', '테트리스', '❌'],
                ['Gomoku', '오목', '✅ Heuristic'],
                ['Chess', '체스', '✅ Minimax'],
              ].map(([game, desc, ai]) => (
                <tr key={game} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 font-medium">{game}</td>
                  <td className="py-2 pr-4 text-gray-500 dark:text-[#9CA3AF]">{desc}</td>
                  <td className="py-2">{ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    'community-board': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>Next.js App Router 기반의 커뮤니티 게시판 시스템입니다. 이 포트폴리오 사이트 자체가 이 프로젝트를 기반으로 확장되었습니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Features</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Authentication</strong> - NextAuth 기반 사용자 인증</li>
          <li><strong>Post CRUD</strong> - 작성/조회/수정/삭제</li>
          <li><strong>Interaction</strong> - 댓글, 좋아요, 알림</li>
          <li><strong>Responsive UI</strong> - Tailwind CSS, 다크모드</li>
        </ul>
      </div>
    ),
    'cookie-clicker': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>Next.js + Prisma + Neon 기반으로 재구축된 쿠키클리커 인크리멘털 게임입니다. PostgreSQL에 게임 상태를 저장합니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Features</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>클릭당 쿠키 획득</li>
          <li>자동 생산 업그레이드</li>
          <li>스킬 트리 시스템</li>
          <li>PostgreSQL 기반 영구 저장</li>
          <li>프레스티지 시스템</li>
        </ul>
      </div>
    ),
    'defencegame': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>타워 디펜스 게임. 4종 타워 (궁수/마법사/레이저/메이지타워)를 배치하고 레벨업하여 적을 막아냅니다.</p>
      </div>
    ),
    'greeddungeon': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>2D 턴제 로그라이트 던전 크롤러. 행동 게이지 시스템, 장비/스킬/버프, 전투 비주얼 효과.</p>
      </div>
    ),
    'pathfinder': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>메트로바니아 2D 플랫포머. 능력 해금으로 백트래킹, 즉사 함정, Custom DI Container 적용.</p>
      </div>
    ),
    'shotup': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>공을 발사하여 골에 넣는 물리 기반 게임. 마우스 조준/파워 조절 시스템.</p>
      </div>
    ),
    'gamedevtoolkit': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Package Overview</h3>
        <p>Unity 게임 개발을 위한 툴킷 패키지. 공통 기능을 모듈화하여 재사용 가능하도록 설계.</p>
      </div>
    ),
    'kirdia-simulator': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>웹소설 세계관 시뮬레이터. AI GM 시스템, 캐릭터 Role-play, 분기 스토리 시스템.</p>
      </div>
    ),
    'aichat': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>RAG(Retrieval-Augmented Generation) 기반 AI 채팅 시스템입니다. 사용자가 업로드한 문서를 기반으로 LLM이 검색하여 답변하는 지능형 채팅 인터페이스를 제공합니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">System Architecture</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`User → kongfolio.vercel.app/chat
              ↓
        /api/rag (Vercel Proxy)
              ↓
        45.59.101.155:8000 (VPS)
        ├─ DeepSeek V4 Flash LLM
        ├─ pgvector 검색 엔진
        ├─ e5-base Embedding (로컬)
        └─ Valkey Rate Limit`}</pre>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">RAG Pipeline</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>Document Upload</strong> - PDF / Markdown / TXT 업로드</li>
          <li><strong>Chunking</strong> - RecursiveCharacterTextSplitter (1000자 단위)</li>
          <li><strong>Embedding</strong> - e5-base 모델 → pgvector 저장</li>
          <li><strong>Retrieval</strong> - 질문 임베딩 → Cosine Similarity 검색</li>
          <li><strong>Generation</strong> - 검색된 Context + 질문 → DeepSeek V4 Flash 답변</li>
        </ol>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Features</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>한국어 특화</strong> - e5-base 한국어 임베딩 + DeepSeek 한국어 지원</li>
          <li><strong>실시간 스트리밍</strong> - Server-Sent Events 기반 타이핑 효과</li>
          <li><strong>소스 인용</strong> - 답변에 사용된 문서 출처 표시</li>
          <li><strong>관리자 모드</strong> - 문서 업로드/삭제 관리</li>
          <li><strong>Rate Limit</strong> - Valkey 기반 일일 사용량 제한 (10회/일)</li>
          <li><strong>VPS IP 보호</strong> - Vercel Edge 프록시로 백엔드 IP 은닉</li>
        </ul>
      </div>
    ),
  }

  return <>{details[slug] || <p>자세한 프로젝트 정보를 준비 중입니다.</p>}</>
}
