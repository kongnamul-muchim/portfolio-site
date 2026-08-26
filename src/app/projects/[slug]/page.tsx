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
    <div className="project-detail-page min-h-screen bg-gray-50 dark:bg-[#0D0D0E]">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="detail-back inline-flex items-center gap-1 text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-[#22D3EE] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <header className="detail-header-card bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl p-5 sm:p-7 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2">
              {typeInfo && (
                <span className="text-lg shrink-0">{typeInfo.icon}</span>
              )}
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937]">
                {typeInfo?.label || project.type}
              </span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#E5E7EB] mb-4 break-words leading-tight">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-[#9CA3AF] mb-5 break-words leading-relaxed">
            {project.description}
          </p>

          {/* Spec Sheet — 행 목록 (게임 패키지 뒷면 느낌) */}
          <dl className="detail-spec border-t border-gray-100 dark:border-gray-800 pt-4">
            {project.devPeriod && (
              <div className="flex py-1.5">
                <dt className="w-20 sm:w-24 shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500">개발 기간</dt>
                <dd className="text-xs text-gray-600 dark:text-[#9CA3AF]">{project.devPeriod}</dd>
              </div>
            )}
            <div className="flex py-1.5">
              <dt className="w-20 sm:w-24 shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500">게임 타입</dt>
              <dd className="text-xs text-gray-600 dark:text-[#9CA3AF]">{typeInfo?.label || project.type}</dd>
            </div>
            <div className="flex py-1.5">
              <dt className="w-20 sm:w-24 shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500">주요 기술</dt>
              <dd className="text-xs text-gray-600 dark:text-[#9CA3AF] leading-relaxed">{project.technologies.join(' · ')}</dd>
            </div>
          </dl>
        </header>

        {/* GitHub Activity Badge */}
        {project.github && (
          <div className="mb-6">
            <GithubActivityBadge repo={project.github} />
          </div>
        )}

        {/* Image */}
        <div className="detail-image relative w-full rounded-xl overflow-hidden mb-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] shadow-lg group">
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-auto max-h-[540px] object-contain transition-all duration-300 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-[#0D0D0E]/65 transition-opacity duration-300 group-hover:bg-[#0D0D0E]/10 pointer-events-none" />
        </div>

        {/* Detail Content */}
        <div className="detail-content bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl p-5 sm:p-7 mb-6 max-w-full min-w-0 overflow-hidden">
          {/* Key Achievement — 숫자 스탯 (데이터 있는 프로젝트) / 문단 (나머지) */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border border-cyan-200 dark:border-cyan-800/30">
            {keyStats[project.id] ? (
              <div className="detail-stats grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {keyStats[project.id].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white dark:bg-[#0D0D0E] border border-gray-200 dark:border-[#1F2937] rounded-lg p-3 text-center"
                  >
                    <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#E5E7EB] leading-tight">
                      {s.value}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">💡</span>
                <div>
                  <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1 uppercase tracking-wider">Key Achievement</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <KeyAchievement slug={project.id} />
                  </p>
                </div>
              </div>
            )}
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
              className="detail-demo-btn inline-flex items-center gap-2 px-5 sm:px-7 py-3 bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-[#0D0D0E] font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/40"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
              <span className="truncate">게임 실행</span>
            </a>
          )}
        </div>

        {/* Live Preview — 썸네일 미리보기 (클릭 시 새창) */}
        {project.demo && (project.type === 'web' || project.type === 'server') && (
          <section className="detail-preview mb-6">
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

/* 핵심 수치 스탯 — 페이지 본문에서 확인되는 실제 수치만 사용 */
const keyStats: Record<string, { value: string; label: string }[]> = {
  'chaincrush': [
    { value: '2일', label: '프로토타입 → 완성' },
    { value: '10×10', label: '퍼즐 보드' },
    { value: '6색', label: '블록 지원' },
    { value: '오프라인', label: 'AI 힌트 엔진' },
  ],
  'shotfire': [
    { value: '5일', label: '개발 기간' },
    { value: '4종', label: '무기 시스템' },
    { value: 'BTree', label: '적 AI' },
    { value: '절차적', label: '맵 생성' },
  ],
  'afk': [
    { value: '6주', label: '기획 → 완성' },
    { value: '100+', label: '스테이지' },
    { value: '4종', label: '장비 × 5단계' },
    { value: 'CSV', label: '밸런스 파이프라인' },
  ],
  'match3': [
    { value: '1일', label: '프로토타입 → 완성' },
    { value: '8×8', label: '퍼즐 보드' },
    { value: 'BFS', label: '매치 탐지' },
    { value: '재사용', label: 'Core/Shell 아키텍처' },
  ],
  'unity-minigames': [
    { value: '7종', label: '장르별 미니게임' },
    { value: '1개', label: '공통 Core/Shell' },
    { value: 'DI', label: '순수 C# 의존성' },
  ],
  'minigame-collection': [
    { value: '6종', label: '미니게임' },
    { value: '2종', label: 'AI 대전 (오목/체스)' },
    { value: '40%', label: '코드 재사용률' },
  ],
  'aichat': [
    { value: 'RAG', label: '문서 검색 채팅' },
    { value: 'SSE', label: '실시간 스트리밍' },
    { value: '10회/일', label: '사용량 제한' },
  ],
  'resonance': [
    { value: '3,000줄', label: 'Vanilla JS' },
    { value: '6개', label: '직업' },
    { value: '68종', label: '유물' },
    { value: '40+', label: '스킬' },
  ],
  'hide-and-ink': [
    { value: '4인', label: '팀 프로젝트' },
    { value: '3개월', label: '협업 기간' },
    { value: '800+', label: '커밋' },
  ],
  'spirit-merge': [
    { value: '10일', label: '기획 → 완성' },
    { value: '30종', label: '정령' },
    { value: '88개', label: '스크립트' },
    { value: '13개', label: '서비스 (SRP)' },
  ],
  'portfolio-site': [
    { value: '1개', label: '풀스택 앱 (이 사이트)' },
    { value: '3영역', label: '게임·AI·서버 운영' },
    { value: 'Docker', label: '컨테이너 운영' },
    { value: 'webhook', label: '자동 배포' },
  ],
}

/* 코드 트리 접이식 — 긴 아키텍처 블록을 클릭 시 펼침 (스크롤 벽 제거) */
function CollapsibleCode({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="code-tree group rounded-lg border border-gray-200 dark:border-[#1F2937] bg-gray-50 dark:bg-gray-900/50">
      <summary className="cursor-pointer select-none px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-[#9CA3AF] hover:text-[#22D3EE] transition-colors list-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <svg className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {summary}
        </span>
      </summary>
      <div className="px-3 sm:px-4 pb-3 overflow-x-auto">
        {children}
      </div>
    </details>
  )
}

function KeyAchievement({ slug }: { slug: string }) {
  const highlights: Record<string, string> = {
    'afk': '6주 장기 프로젝트. DI Container + Event-driven 구조로 자동 전투/장비 합성/환생 시스템 구현. CSV 파이프라인으로 100+ 스테이지 밸런스 조절.',
    'unity-minigames': '블록퍼즐부터 매치3까지 7개 장르를 동일한 Core/Shell + DI 아키텍처로 구현. 순수 C# 게임 로직을 Unity View와 분리해 장르가 달라도 재사용 가능한 구조를 증명.',
    'aichat': 'DeepSeek V4 + pgvector 기반 RAG 시스템. Docker 컨테이너 분리 + VPS 직배포 운영. Cloudflare Proxy로 백엔드 IP 은닉.',
    'cookie-clicker': '강화·스킬트리·프레스티지로 진짜 성장 사이클을 설계한 인크리멘털 게임. 새로고침해도 진행도가 유지되는 저장 구조를 직접 구현.',
    'minigame-collection': 'Blazor WebAssembly + SOLID 원칙. 6종 게임 공통 Core 라이브러리로 코드 재사용 40% 달성.',
    'community-board': 'Next.js + Prisma 풀스택. 포트폴리오 사이트 자체가 이 프로젝트의 확장판. 실제 회원가입/로그인/게시글 운영 중.',
    'resonance': '3,000줄 Vanilla JS 턴제 전략 RPG. 6개 직업, 68종 유물(직업전용 18종), 잔향 레벨5+자동합성 시스템. 매주 업데이트 중.',
    'hide-and-ink': '4인 팀 프로젝트의 시스템 아키텍트 & 코어 프로그래머. 전체 아키텍처 설계, DI Container 기반 의존성 분리, 핵심 상태머신(FSM) 구현. README에 팀원 역할 바운더리 정의로 Git 충돌 최소화. 800+ 커밋의 장기 팀 협업 경험.',
    'spirit-merge': '10일 만에 기획부터 완성까지. 머지+자동전투+파견 3개 루프가 맞물리는 방치형 RPG. 88개 스크립트를 Core/Systems 13개 서비스로 SRP 분리, 원자적 쓰기+백업 자동 저장(오프라인 경과 반영), Unity TCP CLI로 14개 시스템 통합 검증, WebGL 브라우저 실기동.',
    'portfolio-site': '지금 보고 있는 이 사이트 자체. Next.js App Router + Prisma + PostgreSQL + Docker로 직접 구축·운영. 커뮤니티부터 RAG AI 챗봇, 채용공고 관리까지 전 기능을 통합한 풀스택 앱.',
  }
  return <>{highlights[slug] || '자세한 정보는 아래 Project Details를 확인해주세요.'}</>
}

function ProjectDetailContent({ slug }: { slug: string }) {
  const details: Record<string, React.ReactNode> = {

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
    'unity-minigames': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Collection Overview</h3>
        <p>서로 다른 7개 장르의 Unity 6 미니게임을 하나의 검증된 Core/Shell + DI 아키텍처로 빠르게 프로토타이핑한 컬렉션입니다. 모든 게임은 순수 C#으로 로직을 작성하고 Unity View 레이어만 분리해, 로직 전체를 엔진 의존성 없이 검증할 수 있습니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1F2937]">
                <th className="text-left py-2 pr-4">Game</th>
                <th className="text-left py-2 pr-4">Genre</th>
                <th className="text-left py-2">Key System</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['BlockPuzzle', '블록퍼즐', 'BFS 연쇄 + AI 힌트'],
                ['ShotFire', '스텔스 슈터', 'Behavior Tree + 절차적 맵'],
                ['DefenceGame', '타워디펜스', '4종 타워 시너지'],
                ['GreedDungeon', '로그라이트', '행동 게이지 + 스킬 조합'],
                ['Pathfinder', '메트로바니아', 'Custom DI + 백트래킹 맵'],
                ['ShotUp', '물리퍼즐', '2D 물리 각도/파워'],
                ['Match3', '매치-3', 'BFS 매치 + 캐스케이드'],
              ].map(([g, genre, key]) => (
                <tr key={g} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 font-medium">{g}</td>
                  <td className="py-2 pr-4 text-gray-500 dark:text-[#9CA3AF]">{genre}</td>
                  <td className="py-2 text-gray-500 dark:text-[#9CA3AF]">{key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Why Grouped</h3>
        <p>7개 장르를 별도 카드로 나열하면 "게임을 많이 만들었다"는 인상만 남지만, 하나로 묶으면 <strong>어떤 장르든 동일한 아키텍처로 설계·구현할 수 있다는 전문성</strong>을 보여줍니다. 공통적으로 순수 C# DI Container, SOLID, Event-driven 패턴을 사용합니다.</p>
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
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>클릭으로 시작해 자동 생산까지 성장하는 인크리멘털 클리커 게임입니다. 단순한 클릭 게임이 아니라 <strong>진짜 성장 사이클</strong>을 설계하는 데 집중했습니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Systems</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>강화(Enhancement)</strong> — 클릭당 생산량을 결정적으로 올리는 핵심 성장 축</li>
          <li><strong>스킬트리</strong> — CPS(초당 쿠키)와 클릭당 쿠키를 전략적으로 분배</li>
          <li><strong>프레스티지</strong> — 리셋 + 영구 보너스로 깊이 있는 반복 플레이 유도</li>
          <li><strong>진행도 유지</strong> — 새로고침/재접속해도 진행 상태가 그대로 유지되는 쾌적한 저장</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Why This Project</h3>
        <p>숫자와 비례 관계를 다루는 경제 설계의 기본기를 익히기 위해 직접 설계·구현했습니다.</p>
      </div>
    ),

    'aichat': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>RAG(Retrieval-Augmented Generation) 기반 AI 채팅 시스템입니다. 사용자가 업로드한 문서를 기반으로 LLM이 검색하여 답변하는 지능형 채팅 인터페이스를 제공합니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">System Architecture</h3>
        <CollapsibleCode summary="아키텍처 트리 보기">
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
        </CollapsibleCode>
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

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Why This Project</h3>
        <p>실제 방문자가 사용하는 운영 중인 서비스로, 단순 기능 구현이 아니라 <strong>VPS 직배포 + Docker 컨테이너 분리 + Cloudflare Proxy 보안</strong>까지 전체 운영 사이클을 직접 설계·구축했습니다. RAG 파이프라인 구성부터 인프라 보안, 모니터링까지 백엔드 운영의 전 과정을 경험한 프로젝트입니다.</p>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Key Architecture Decisions</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>컨테이너 네트워크 통합</strong> — 프론트(portfolio)와 백엔드(aichat)를 동일 Docker 네트워크로 연결해 안정적으로 통신</li>
          <li><strong>백엔드 IP 은닉</strong> — Cloudflare Proxy + Vercel Edge 프록시로 원본 서버 IP 노출 최소화</li>
          <li><strong>방어 계층화</strong> — fail2ban + nginx 보안 규칙으로 스캐너/공격 IP 자동 차단, 한국 이용자 예외 처리</li>
          <li><strong>안정적 제공</strong> — 캐시 정책을 조정해 수정사항이 방문자에게 즉시 반영되도록 운영</li>
        </ul>
      </div>
    ),
    'resonance': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Game Overview</h3>
        <p>Vanilla JavaScript로 제작 중인 턴제 전략 RPG입니다. 6개 직업(⚔️기사/🗡️추적자/🔮메아리술사/🌑어둠의메아리/✨잊혀진서약/🩸영원한악몽), 40+ 스킬, 7종 잔향 시스템, 68종 유물 시스템을 갖추고 있습니다. DI 패턴 + Event-driven 아키텍처로 3,000줄 내외의 코드에 게임 로직을 체계적으로 구성했습니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Current Features (v2.0)</h3>
        <CollapsibleCode summary="프로젝트 구조 보기">
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
        </CollapsibleCode>

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
        <CollapsibleCode summary="아키텍처 트리 보기">
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
        </CollapsibleCode>

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
    'portfolio-site': (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Project Overview</h3>
        <p>지금 보고 있는 이 포트폴리오 사이트 자체입니다. Next.js App Router + TypeScript + Prisma + PostgreSQL로 설계하고, VPS에서 Docker 컨테이너로 직접 운영하는 풀스택 앱입니다.</p>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Full-stack Composition</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Frontend</strong> — Next.js App Router + TypeScript, 반응형 다크/라이트 테마</li>
          <li><strong>Backend</strong> — Prisma ORM + PostgreSQL, 인증/권한, REST API 라우트</li>
          <li><strong>Infrastructure</strong> — VPS + Docker 컨테이너 운영, nginx 리버스 프록시</li>
          <li><strong>Security</strong> — Cloudflare Proxy, fail2ban, Let&apos;s Encrypt SSL</li>
          <li><strong>CD</strong> — GitHub webhook + systemd 자동 빌드/배포</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-900 dark:text-[#E5E7EB]">Included Services</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>유저 시스템</strong> — 회원가입/로그인/프로필</li>
          <li><strong>커뮤니티 게시판</strong> — 글/댓글/좋아요/알림</li>
          <li><strong>RAG AI 챗봇</strong> — DeepSeek + pgvector 문서 검색 채팅 (/chat)</li>
          <li><strong>채용공고 관리</strong> — 어드민 크롤링/관리 (/admin)</li>
          <li><strong>GitHub 활동 배지</strong> — 서버리스로 레포 활동 실시간 표시</li>
        </ul>
      </div>
    ),
  }

  return <>{details[slug] || <p>자세한 프로젝트 정보를 준비 중입니다.</p>}</>
}
