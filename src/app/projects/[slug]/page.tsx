import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects, getProjectBySlug, projectTypes } from '@/data/projects'
import GithubActivityBadge from '@/components/GithubActivityBadge'

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
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2">
              {typeInfo && (
                <span className="text-lg shrink-0">{typeInfo.icon}</span>
              )}
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937]">
                {typeInfo?.label || project.type}
              </span>
            </div>
            {/* Scope badge */}
            {project.devPeriod && (
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                📅 {project.devPeriod}
              </span>
            )}
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

        {/* GitHub Activity Badge */}
        {project.github && (
          <div className="mb-6">
            <GithubActivityBadge repo={project.github} />
          </div>
        )}

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
          {/* Key Achievement Card */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border border-cyan-200 dark:border-cyan-800/30">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">💡</span>
              <div>
                <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1 uppercase tracking-wider">Key Achievement</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <KeyAchievement slug={project.id} />
                </p>
              </div>
            </div>
          </div>
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
        </div>

        {/* Live Preview — 썸네일 미리보기 (클릭 시 새창) */}
        {project.demo && (project.type === 'web' || project.type === 'server') && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#E5E7EB] mb-4">
              Live Preview
            </h2>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              title={`${project.title} 데모 실행 (새창)`}
              className="relative block w-full overflow-hidden rounded-xl border border-gray-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] shadow-lg group"
            >
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                  src={displayImage}
                  alt={`${project.title} 미리보기`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-[#0D0D0E]/55 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#0D0D0E]/35">
                <div className="flex flex-col items-center gap-2 text-white">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                    데모 실행하기 (새창)
                  </span>
                </div>
              </div>
            </a>
          </section>
        )}
      </article>
    </div>
  )
}

function KeyAchievement({ slug }: { slug: string }) {
  const highlights: Record<string, string> = {
    'chaincrush': '2일 만에 Core/Shell 분리 아키텍처 + BFS AI 힌트 엔진 완성. 순수 C# DI Container로 Unity 의존성 없이 게임 로직 테스트 가능.',
    'shotfire': 'Behavior Tree 적 AI + 절차적 맵 생성으로 5일 만에 완성. Fog of War, 소음 시스템 등 스텔스 메카닉 전면 구현.',
    'afk': '6주 장기 프로젝트. DI Container + Event-driven 구조로 자동 전투/장비 합성/환생 시스템 구현. CSV 파이프라인으로 100+ 스테이지 밸런스 조절.',
    'match3': '하루 만에 완성. BlockPuzzle의 Core/Shell 아키텍처를 재사용하여 빠르게 프로토타입 → 리더보드까지 확장.',
    'aichat': 'DeepSeek V4 + pgvector 기반 RAG 시스템. Docker 컨테이너 분리 + VPS 직배포 운영. Cloudflare Proxy로 백엔드 IP 은닉.',
    'cookie-clicker': 'Docker + PostgreSQL 풀스택 운영. Cloudflare Full(strict) SSL + fail2ban 보안 직접 구성. 서버사이드 저장으로 진행 유지.',
    'minigame-collection': 'Blazor WebAssembly + SOLID 원칙. 6종 게임 공통 Core 라이브러리로 코드 재사용 40% 달성.',
    'community-board': 'Next.js + Prisma 풀스택. 포트폴리오 사이트 자체가 이 프로젝트의 확장판. 실제 회원가입/로그인/게시글 운영 중.',
    'defencegame': '4종 타워 × 3단계 강화 × 특수 능력 해금. 타워 간 시너지 시스템으로 전략적 깊이 확보.',
    'greeddungeon': '턴제 로그라이트. 행동 게이지 + 랜덤 장비 파밍 + 스킬 조합 시스템. 랜덤성과 전략의 균형 설계.',
    'pathfinder': '메트로바니아 스타일. Custom DI Container로 Unity 의존성 분리. 능력 해금 기반 백트래킹 맵 설계.',
    'shotup': '물리엔진 기반 공 발사 퍼즐. 각도/파워 조절로 골인. 2일 초고속 프로토타이핑.',
    'kirdia-simulator': 'AI GM 시스템 + 분기 스토리. 마크다운 기반 세계관 구축으로 기술 없이도 스토리 확장 가능.',
    'resonance': '3,000줄 Vanilla JS 턴제 전략 RPG. 6개 직업, 68종 유물(직업전용 18종), 잔향 레벨5+자동합성 시스템. 매주 업데이트 중.',
    'hide-and-ink': '4인 팀 프로젝트의 시스템 아키텍트 & 코어 프로그래머. 전체 아키텍처 설계, DI Container 기반 의존성 분리, 핵심 상태머신(FSM) 구현. README에 팀원 역할 바운더리 정의로 Git 충돌 최소화. 800+ 커밋의 장기 팀 협업 경험.',
    'spirit-merge': '10일 만에 기획부터 완성까지. 머지+자동전투+파견 3개 루프가 맞물리는 방치형 RPG. 88개 스크립트를 Core/Systems 13개 서비스로 SRP 분리, 원자적 쓰기+백업 자동 저장(오프라인 경과 반영), Unity TCP CLI로 14개 시스템 통합 검증, WebGL 브라우저 실기동.',
  }
  return <>{highlights[slug] || '자세한 정보는 아래 Project Details를 확인해주세요.'}</>
}

function ProjectDetailContent({ slug }: { slug: string }) {
  const details: Record<string, React.ReactNode> = {
    'chaincrush': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Unity 6 기반 10×10 블록 연계 퍼즐 게임. 순수 C# Core와 Unity View 레이어를 완전히 분리한 DI 아키텍처가 특징입니다. 연속으로 블록을 제거하여 점수를 올리는 방식으로, BFS 기반 연쇄 제거 시스템과 <strong>AI Hint System</strong>이 핵심입니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">AI Hint System</h3>
        <p>자체 개발한 로컬 AI 힌트 엔진이 보드 상태를 분석하여 최적의 수를 추천합니다. 서버 의존성 제로, 완전 오프라인 동작.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>BFS Chain Detection</strong> — 상하좌우 BFS로 동일 색상 블록 그룹 탐색, 6가지 색상 지원</li>
          <li><strong>전략 분류 (Strategy Classification)</strong> — Chain(&gt;=5개 대형 연계), Setup(중형), Survival(위기 상황) 세 가지 전략 자동 분류</li>
          <li><strong>자연어 힌트 생성</strong> — 전략별 4종 템플릿, 결정적 해시 기반 균일 분배로 같은 보드=같은 힌트</li>
          <li><strong>시각적 하이라이트</strong> — 연계된 모든 블록 위치에 하얀색 오버레이 + 알파 펄스 애니메이션</li>
          <li><strong>무활동 감지</strong> — 5초 무입력 시 자동 힌트 표시, 클릭 시 즉시 취소</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Architecture (Core / Unity 분리)</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`Assets/
├── Core/                          # Pure C# (no UnityEngine)
│   ├── Game/
│   │   ├── HintEngine.cs          # BFS + 전략 분류 + 템플릿 엔진
│   │   ├── Grid.cs                # 게임 로직
│   │   └── GameStateMachine.cs
│   └── Interfaces/
│       └── IAIHintService.cs      # HintResult + 이벤트 정의
├── Unity/                         # Unity Adapter Layer
│   ├── Adapters/
│   │   ├── UnityAIHintService.cs  # HintEngine 호출 + DI 등록
│   │   ├── BlockHighlighter.cs    # 오브젝트 풀 기반 시각적 하이라이트
│   │   ├── HintTimer.cs           # 무활동 감지 + 힌트 트리거
│   │   └── UnityGridRenderer.cs   # 블록 렌더링
│   └── UI/
│       └── HintUI.cs              # 말풍선 형태 힌트 패널
└── Editor/
    └── AIHintSetupEditor.cs       # 원클릭 셋업 툴`}</pre>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>DI Container</strong> — 순수 C# DIContainer (Castle Windsor 의존성 제로), 모든 서비스는 인터페이스를 통해 주입</li>
          <li><strong>BFS Chain System</strong> — Flood-fill BFS로 연결 블록 탐색, 12가지 연계 패턴</li>
          <li><strong>Gravity + Column Shift</strong> — 블록 제거 후 중력 낙하 + 열 이동 + 새 행 추가</li>
          <li><strong>Event-driven Architecture</strong> — OnStateChanged, OnBlocksRemoved, OnGravityApplied 등 7개 이벤트로 Core-View 완전 분리</li>
          <li><strong>Vercel Leaderboard</strong> — Serverless + Prisma + Neon PostgreSQL, 닉네임 기반 점수 저장</li>
          <li><strong>Webhook Auto-Deploy</strong> — GitHub Webhook + systemd로 푸시 시 자동 빌드/배포</li>
        </ul>
      </div>
    ),
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
        <p>Next.js + Prisma + PostgreSQL 기반의 쿠키클리커 인크리멘털 게임입니다. 자체 서버에서 PostgreSQL에 게임 상태를 저장합니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Features</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>클릭당 쿠키 획득</li>
          <li>자동 생산 업그레이드</li>
          <li>스킬 트리 시스템</li>
          <li>PostgreSQL 기반 영구 저장</li>
          <li>프레스티지 시스템</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB] mt-6">🔧 Troubleshooting</h3>
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">1. 통계(Stats) 항상 0으로 표시</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> 프론트엔드가 stats.total_clicks(snake_case)를 요청하지만, 백엔드 stats/route.ts가 totalClicks(camelCase)로 반환해서 필드명 불일치 발생. 모든 통계가 undefined → 0으로 표시됨</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> stats/route.ts 응답 키를 snake_case로 통일</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">2. 업적(Achievements) 잠금 해제 불가</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> /api/click 등에서 newAchievements: []를 하드코딩으로 반환. 서버 어디에도 Achievement 테이블을 쓰는 로직이 없어서 업적 조건 체크 자체가 구현되지 않음</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> 클릭 수/쿠키 수/업그레이드 수 등의 조건을 체크해서 업적 해제를 기록하는 로직 구현</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">3. 강화(Enhancement) 효과 없음</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> 강화 비용 1000쿠키는 정상 차감되고 DB에 enhancementCount는 증가하지만, statsCalculator.ts가 CPS/클릭당 계산에 enhancementCount를 전혀 참조하지 않아서 강화를 해도 아무 효과 없음</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> calculateStats()에 enhancementCount를 CPS/클릭당 계산식에 반영</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">4. Cloudflare SSL 526 + Brotli 압축 문제</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> Let's Encrypt 인증서에 cookieclicker.olivilo.shop이 없어서 Cloudflare Full(strict) SSL 검증 실패 → 526 에러. 또한 Cloudflare가 .br 파일의 Content-Encoding 헤더를 제거해서 브라우저가 압축 해제 못 함</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> certbot으로 인증서 확장 + .br 파일은 압축 풀어서 배포</p>
          </div>
        </div>
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
    'kirdia-simulator': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>웹소설 세계관 시뮬레이터. AI GM 시스템, 캐릭터 Role-play, 분기 스토리 시스템.</p>
      </div>
    ),
    'match3': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Unity 6 기반 Match-3 퍼즐 게임. 8×8 보드에서 3개 이상 같은 색상의 보석을 매치시켜 제거하는 방식입니다. ChainCrush(BlockPuzzle)와 동일한 순수 C# Core + Unity Shell 분리 아키텍처를 채용하여 DI, Event-driven 패턴을 재사용했습니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Architecture (Core / Unity 분리)</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`Assets/
├── Core/                          # Pure C# (no UnityEngine)
│   ├── Game/
│   │   ├── Board.cs              # 8×8 그리드 + 타일 데이터
│   │   ├── MatchFinder.cs        # BFS 3연속 매치 감지
│   │   ├── SwapHandler.cs        # 스왑 + 유효성 검증
│   │   ├── CascadeHandler.cs     # 제거 → 중력 낙하 → 생성
│   │   ├── ScoreManager.cs       # 점수 / 콤보
│   │   ├── GameStateMachine.cs   # 상태 관리
│   │   └── GameController.cs     # 전체 오케스트레이션
│   └── Interfaces/
│       ├── IBoardRenderer.cs
│       └── IInputHandler.cs
├── Unity/                         # Unity Adapter Layer
│   ├── Adapters/
│   │   ├── UnityBoardRenderer.cs # DOTween 애니메이션
│   │   └── UnityInputHandler.cs  # 드래그/스와이프 입력
│   └── UI/
│       ├── ScoreUI.cs
│       └── GameOverUI.cs
└── Editor/
    └── Match3SetupEditor.cs`}
          </pre>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>DI Container</strong> — BlockPuzzle과 동일한 순수 C# DI, 인터페이스 기반 주입</li>
          <li><strong>BFS Match Detection</strong> — 가로/세로 스캔으로 3연속 이상 매치 그룹 탐색</li>
          <li><strong>Cascade System</strong> — 매치 제거 → 중력 낙하 → 새 타일 생성 무한 체인</li>
          <li><strong>GameOver Detection</strong> — 가능한 스왑이 없을 때 자동 게임 종료</li>
          <li><strong>AI Hint System</strong> — 모든 가능한 스왑 시뮬레이션 후 최적의 수 추천</li>
          <li><strong>Event-driven Architecture</strong> — OnMatchFound, OnCascadeComplete 등 6개 이벤트</li>
        </ul>
      </div>
    ),
    'aichat': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>RAG(Retrieval-Augmented Generation) 기반 AI 채팅 시스템입니다. 사용자가 업로드한 문서를 기반으로 LLM이 검색하여 답변하는 지능형 채팅 인터페이스를 제공합니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">System Architecture</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`User → portfolio.olivilo.shop/chat
              ↓
         /api/rag (Server Proxy)
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

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB] mt-6">🔧 Troubleshooting</h3>
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">1. RAG 챗봇 입력 비활성화 (quota 0/10)</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> 포트폴리오 웹(portfolio container)이 AI챗 백엔드(aichat container)와 다른 Docker 네트워크에 있어서 DNS 조회 불가 → rate-limit API 호출 실패 → fallback으로 0/10 반환 → 입력창 disabled</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> <code>docker network connect root_default portfolio</code>로 portfolio 컨테이너를 aichat과 동일한 네트워크에 연결</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">2. Valkey 연결 refused (host.docker.internal:6379)</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> aichat 컨테이너가 host.docker.internal(172.18.0.1)로 Valkey 접속 시도했으나, Valkey가 127.0.0.1에만 바인딩되어 있어 연결 거부 → rate-limit/챗봇 내부 오류</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> /etc/valkey/valkey.conf의 bind에 172.18.0.1 추가 → systemctl restart valkey</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">3. Cloudflare 521 (Web server is down)</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> fail2ban nginx-scanners가 Cloudflare 에지 IP들을 차단 (maxretry=2, bantime=14d). 차단된 Cloudflare IP가 요청을 프록시하려 하면 origin 연결 불가 → 521 에러</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> /etc/fail2ban/jail.d/cloudflare-whitelist.conf에 Cloudflare IP CIDR 대역 ignoreip 추가 + fail2ban 재시작</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">4. Portfolio 컨테이너 다운 (502 Bad Gateway)</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> portfolio Docker 컨테이너가 약 1시간 15분 동안 다운됨 (KST 10:50~12:05). nginx(80/443)는 살아있었지만 백엔드(3001)가 죽어서 방문자에게 502 에러 표시</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> Docker 컨테이너 재시작으로 복구. 모니터링 강화를 위해 server-status 페이지에 컨테이너 상태 체크 추가</p>
          </div>
          <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">5. Cache-Control 1년 설정 (수정 즉시 반영 안 됨)</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2"><strong>문제:</strong> next.config.mjs에 s-maxage=31536000(1년) 캐시 설정 → 프로젝트 페이지를 수정해도 Cloudflare가 1년간 캐시된 버전만 제공. 수정사항이 방문자에게 즉시 반영 안 됨</p>
            <p className="text-xs text-amber-700 dark:text-amber-400"><strong>해결:</strong> /projects/*와 /play/* 경로에 no-cache 헤더 적용. 메인 페이지도 no-cache로 변경</p>
          </div>
        </div>
      </div>
    ),
    'resonance': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Vanilla JavaScript로 제작 중인 턴제 전략 RPG입니다. 6개 직업(⚔️기사/🗡️추적자/🔮메아리술사/🌑어둠의메아리/✨잊혀진서약/🩸영원한악몽), 40+ 스킬, 7종 잔향 시스템, 68종 유물 시스템을 갖추고 있습니다. DI 패턴 + Event-driven 아키텍처로 3,000줄 내외의 코드에 게임 로직을 체계적으로 구성했습니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Current Features (v2.0)</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`resonance/
├── js/
│   ├── data/
│   │   ├── skills.js       # 40+ 스킬 (기본/강한공격/방어/버프)
│   │   ├── resonances.js   # 7종 잔향 + 합성 레시피 (Lv.10, 등급, 자동합성)
│   │   ├── monsters.js      # 30+ 일반몹/보스
│   │   ├── events.js        # 랜덤 이벤트 시스템
│   │   ├── characters.js  # 6개 직업군 정의
│   │   ├── relics.js        # 68종 유물 (일반/희귀/에픽/유일)
│   │   └── codex.js         # 도감 데이터
│   ├── game.js              # Core 엔진 (DI + Event system)
│   └── ui.js                # View 레이어 (DOM 조작)
├── css/style.css
└── index.html`}</pre>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>DI Pattern (Vanilla JS)</strong> — 순수 JavaScript로 의존성 주입 구현. GameEngine, UIManager 인터페이스 기반 분리</li>
          <li><strong>Event-driven Architecture</strong> — onTurnStart/onAttack/onEvade/onDamageTaken 등 15+ 이벤트 훅으로 로직 분리</li>
          <li><strong>6 Playable Classes</strong> — 기사(탱커반격), 추적자(회피딜러), 메아리술사(마법사), 어둠의메아리(암살자), 잊혀진서약(힐러탱커), 영원한악몽(광전사) — 각각 고유 스킬셋 + 전용 유물 3종</li>
          <li><strong>Resonance System</strong> — 7종 잔향, 최대 레벨 10, 만렙 도달 시 자동 합성. 합성잔향은 슬롯을 소모하지 않음</li>
          <li><strong>Resonance Tier System</strong> — 잔향 획득 시 등급 롤링(🟢일반50%+1/🔵희귀30%+2/🟣에픽15%+3/🟡전설5%+4). 전설 등급은 한 방에 4레벨 상승!</li>
          <li><strong>Relic System (68종)</strong> — 🟢일반(스탯) / 🔵희귀(특수효과+디메리트) / 🟣에픽(게임체인저) / 🟡유일(직업전용×18) 4등급</li>
          <li><strong>Class Unique Relics</strong> — 각 직업별 3개 전용 유물. 해당 직업으로 플레이 시에만 이벤트에서 등장 (예: 기사 전용 유물은 기사만 획득 가능)</li>
          <li><strong>Codex/Encyclopedia</strong> — 몬스터/스킬/잔향/유물 도감 자동 기록 (localStorage)</li>
          <li><strong>Save/Load</strong> — localStorage 기반 세이브/로드, 이어하기 지원</li>
          <li><strong>Turn-based Battle</strong> — 450ms 딜레이 턴 시스템, 적 AI 자동 행동, 보스 기믹</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Balance Philosophy</h3>
        <p>명확한 리스크/리턴 분배를 핵심 설계 원칙으로 합니다. 방어 스킬에 쿨타임을 두어 무한 방어를 방지하고, 고위력 스킬은 긴 쿨타임으로 밸런스를 맞춥니다. 데이터 기반 시뮬레이션으로 정량적 밸런스를 조정합니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Status</h3>
        <div className="bg-amber-50 dark:bg-[#1a1500] border border-amber-200 dark:border-[#3a2a00] rounded-lg p-4">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            🔨 <strong>제작중</strong> — 지속적인 밸런스 패치, 신규 스킬/직업/콘텐츠 업데이트 중입니다.<br />
            최신 변경사항은 게임 내 또는 GitHub Commit History를 참고해주세요.
          </p>
        </div>
      </div>
    ),
    'hide-and-ink': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Unity 6 기반 2.5D 로그라이크 성장 어드벤처. 종이 질감의 독특한 비주얼 스타일로, 플레이어 문어가 다양한 해양 생태계를 탐험하며 환경에 자동으로 의태(Camouflage)하고 포식자를 관찰해 능력을 복사하는 독창적인 게임플레이가 특징입니다. <strong>4인 팀(프로그래머 2인, 아티스트 1인, 기획자 1인)이 3개월간 협업</strong>하여 제작했습니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">My Role: System Architect &amp; Core Programmer</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>전체 시스템 아키텍처 설계</strong> — Core 시스템 인터페이스 정의, 게임 상태머신(FSM) 구조 설계</li>
          <li><strong>DI Container 기반 의존성 관리</strong> — 순수 C# DI Container로 Unity 의존성 분리, 서비스 인터페이스 기반 주입</li>
          <li><strong>ProjectSettings / Packages 환경 세팅</strong> — URP 2D 환경 구성, TransparencySortMode Custom Axis</li>
          <li><strong>협업 바운더리 설계</strong> — README에 팀원별 전담 구역(folder boundary) 정의로 Git 충돌 최소화</li>
          <li><strong>Git 브랜치 전략 및 문서화</strong> — 800+ 커밋을 안전하게 관리, 30+ 설계 문서를 Plans/ 디렉토리에서 관리</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Core Mechanics</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>자동 의태 시스템 (Auto-Camouflage)</strong> — 주변 오브젝트 근처 접근 시 자동 변신, 이동 시 즉시 해제</li>
          <li><strong>의심도 시스템 (Suspicion System)</strong> — 포식자 시야각/거리/의태 등급 기반 실시간 탐지 게이지 (0~100%)</li>
          <li><strong>의태 슬롯</strong> — 일반 의태(1슬롯)와 잉크 소모형 보스 능력(2슬롯)의 전략적 운용</li>
          <li><strong>포식자 AI</strong> — 등급(Tier) × 행동(Type) 매트릭스 기반 다양한 적 행동 패턴</li>
          <li><strong>사이드킥 시스템</strong> — 로봇 문어 치치 (길잡이/기록자/잉크 충전소 역할)</li>
          <li><strong>실패 도감 &amp; 진화</strong> — 유머러스한 패배 기록과 영구적 능력 강화 시스템</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Team Collaboration</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>팀 구성:</strong> 시스템 아키텍트 &amp; 코어 프로그래머(본인) / 게임플레이 &amp; 컴포넌트 통합 / 리드 아티스트 &amp; 비주얼 디렉터 / 테크니컬 기획 &amp; 레벨 디자이너</li>
          <li><strong>작업 파이프라인:</strong> 아트 에셋 세팅 → 코어 코드 구축 → 프리팹 조립/통합 → 레벨 배치/튜닝 (단계별 인계)</li>
          <li><strong>Git 규칙:</strong> 역할별 폴더 바운더리 설정, 타인 전담 구역 수정 시 사전 허락 필수</li>
          <li><strong>기획 문서화:</strong> 30+개의 기획/설계 문서를 Plans/에서 관리 (Boss 디자인, AI, 사운드, UI 등)</li>
        </ul>
      </div>
    ),
    'spirit-merge': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Unity 6 (6000.5.5f1)로 개발한 정령 머지 + 자동 전투 방치형 RPG입니다. 6속성 × 5성급 30종 정령을 4×4 머지 보드에서 합성해 진화시키고, 파티 통합 HP 기반 자동 전투로 스테이지를 밀어 올리는 무한 성장 구조입니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Core Loop</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`전투 클리어 → 골드 획득 → 정령 소환 → 머지 합성(성급↑) → 파티 강화
                                        ↓
                               더 높은 스테이지 도전 (반복)
                                        ↓
            안 쓰는 정령 → 파견(의뢰) → 루비 획득 → 영구 업그레이드
                                        ↓
                    소환/머지/전투 가속 → 절대 막히지 않는 성장`}</pre>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Merge System</strong> — 4×4 보드, 같은 속성 + 같은 성급 정령 합성 → 한 단계 상위 정령. 성급이 오르면 스프라이트 진화 + 스탯 실제 증가, 최대 성급은 노란 테두리 표시</li>
          <li><strong>Auto Battle</strong> — 파티 배치 정령이 자동 공격. 파티 통합 HP(개별 HP가 아닌 파티 전체 체력), 웨이브 기반 진행 + 보스 스테이지, 반복/등반 모드 선택</li>
          <li><strong>6속성 상성 &amp; 시너지</strong> — 불/물/땅 순환 상성 + 바람/어둠/빛 상성. 속성별 시너지(불 공격력 / 물 공격속도 / 바람 치명타 / 땅 통합 HP / 어둠 흡혈 / 빛 방어·회복), 물 스플래시·땅 광역 등 공격 방식 차별화</li>
          <li><strong>Party</strong> — 4슬롯 편성, 드래그/클릭 배치. 빛과 어둠은 함께 편성 불가(상성 설계)</li>
          <li><strong>Upgrade Tree (25노드)</strong> — 골드 탭(공격/방어/체력/치명타 10종), SP 탭(자동 소환/2성 확률/소환 할인/머지 보너스 5종), 루비 탭(프리미엄 스탯 10종)</li>
          <li><strong>의뢰 시스템 (3탭)</strong> — 파견(정령 2마리 → 루비, 보너스 조건 매칭 시 추가 보상), 미션(일일/주간 10종), 레이드(60초 페이즈 보스, 보스는 죽지 않고 강해지며 점수 기반 보상)</li>
          <li><strong>도감 (30종)</strong> — 6속성 × 5성급 수집 현황 + 진화 스프라이트 확인</li>
          <li><strong>자동 저장</strong> — 30초 주기 + 주요 이벤트(재화/소환/머지/파견/클리어/업그레이드) + 백그라운드/종료 시 저장. 원자적 쓰기(temp→rename) + 백업 파일로 강제종료에도 데이터 손실 방지, 오프라인 경과 반영</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Architecture</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs leading-tight min-w-0 whitespace-pre">
{`Assets/Scripts/
├── Battle/        # 전투 시스템 (WaveController, Monster, SpiritUnit, WaveCalculator)
├── Merge/         # 머지 보드, 파티, 업그레이드, 도감 UI
├── Manager/       # GameManager, BattleManager, DataManager (저장)
├── Core/Systems/  # 13개 서비스 — Player, Battle, Merge, Dispatch, Mission,
│                  #   Raid, Party, StageProgression, Currency, Inventory,
│                  #   Spirit, Codex, Data (SRP 분리)
├── Core/Interfaces/# 서비스 인터페이스 (IDataService 등)
├── Data/          # SpiritData, StageData, MonsterData, SaveData, Enums
├── Presentation/  # UI (RequestUI, RaidBattle, DispatchFormationUI, CliTestSuite)
└── Editor/        # 에디터 도구 (CliServer, ProjectSetup, UI 빌더)`}</pre>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Data &amp; Balance</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>ScriptableObject + Resources 로딩 — SpiritData 30종 / StageData 50종(5챕터 × 10스테이지) / MonsterData 12종</li>
          <li>WaveCalculator 공식 — totalMonsters = chapter × 5 + stage, 웨이브 수 = chapter + 4, 보스 HP 10배</li>
          <li>소환 비용 = 500 + (chapter-1) × 300 — 스테이지 진행과 경제 규모 동반 성장</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Testing &amp; Deployment</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Unity TCP CLI (5555)</strong> — CliServer로 게임 로직을 에디터 외부에서 구동, 14개 시스템 통합 검증 파이프라인 자동화</li>
          <li><strong>컴파일 검증</strong> — 배치 빌드 스크립트(unity.ps1 verify)로 GUI 없이 컴파일 에러 확인</li>
          <li><strong>WebGL 배포</strong> — GitHub Pages (master/docs) + GitHub Actions 자동 배포, 브라우저에서 바로 플레이 가능</li>
          <li><strong>캔버스 반응형</strong> — 창 크기에 맞춰 9:16 비율 유지 축소, 좁은 화면에서도 잘림 없음</li>
        </ul>
      </div>
    ),
  }

  return <>{details[slug] || <p>자세한 프로젝트 정보를 준비 중입니다.</p>}</>
}
