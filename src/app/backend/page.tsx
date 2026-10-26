import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectBySlug } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'AI 백엔드 지원용 | GuGu.dev',
  description:
    'AI 백엔드 개발자로 지원합니다. 스키마를 먼저 그리고, 검색과 생성을 분리하고, 서버를 직접 운영한 기록.',
}

const ORDER = ['portfolio-site', 'aichat', 'autoflow', 'community-board', 'cookie-clicker']

const PROOFS = [
  {
    n: '01',
    title: '데이터 구조를 먼저 정하고 코드를 씁니다',
    body: '화면부터 만들면 나중에 스키마를 뜯어야 합니다. 어떤 데이터가 어떤 관계로 묶이는지를 먼저 정하고, 그 위에 API와 화면을 얹습니다. 지금 이 사이트도 그렇게 만들었습니다.',
    ev: '운영 중인 스키마 7개 모델 · API 라우트 11개',
  },
  {
    n: '02',
    title: 'AI 답변은 "먼저 찾고, 그 다음 생성"',
    body: 'LLM에게 그냥 물으면 없는 내용을 지어냅니다. 문서를 조각내 벡터로 저장하고, 질문과 가까운 조각을 먼저 찾은 뒤 그 조각만 근거로 답하게 만들었습니다. 근거를 함께 보여주니 틀렸을 때 어디서 틀렸는지 추적됩니다.',
    ev: 'AIChat — API 4,196줄 · pgvector 검색 · 근거 표시',
  },
  {
    n: '03',
    title: '만든 서버를 직접 굴립니다',
    body: '배포를 맡기지 않고 VPS에서 Docker로 운영합니다. 포트 스캔을 발견해 SSH를 잠그고, 502가 나면 로그를 보고 원인을 찾습니다. 수정은 테스트 포트에서 먼저 확인하고 운영으로 넘깁니다.',
    ev: '이 사이트 — 컨테이너 운영 · 2단계 배포 · 4중 보안',
  },
]

export default function BackendRolePage() {
  const list = ORDER.map(getProjectBySlug).filter(Boolean) as NonNullable<
    ReturnType<typeof getProjectBySlug>
  >[]

  return (
    <div className="portfolio-page min-h-screen">
      <section className="play-section px-8 sm:px-12 pt-10">
        <div className="max-w-6xl mx-auto">
          <p className="ev-label">For AI Backend</p>
          <h1 className="role-title">AI 백엔드 개발자로 지원합니다.</h1>
          <p className="role-lead">
            모델을 붙이는 일보다 <strong>데이터가 어떻게 흐르는지</strong>를 먼저 보는 쪽입니다.
            스키마 설계 → API → AI 연동 → 서버 운영까지 한 사람이 끝까지 해본 기록만 모았습니다.
            이 페이지는 AI 백엔드 직무에 맞춰 순서를 다시 배열한 것입니다.
          </p>

          <div className="role-proofs">
            {PROOFS.map((p) => (
              <div key={p.n} className="role-proof">
                <div className="ev-decision-q">
                  <span className="ev-num">{p.n}</span>
                  <span className="role-proof-title">{p.title}</span>
                </div>
                <p className="ev-decision-why">{p.body}</p>
                <p className="role-proof-ev">{p.ev}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="play-section px-8 sm:px-12 pt-2">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="play-section-head">
              <h2>백엔드 · AI 프로젝트</h2>
              <span className="count">{list.length}</span>
            </div>
          </Reveal>
          <div className="play-grid">
            {list.map((project, i) => (
              <Reveal key={project.id} delay={Math.min(i * 60, 300)}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          <div className="role-foot">
            <Link href="/game" className="masthead-link">
              → 게임 클라이언트 직군으로 보기
            </Link>
            <Link href="/ai" className="masthead-link">
              → AI를 어디까지 썼나
            </Link>
            <Link href="/projects" className="masthead-link">
              → 전체 프로젝트
            </Link>
            <Link href="/" className="masthead-link">
              → 처음으로
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
