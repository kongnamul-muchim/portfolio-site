import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectBySlug } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: '게임 클라이언트 지원용 | GuGu.dev',
  description:
    '게임 클라이언트 개발자로 지원합니다. 게임 로직을 Unity에서 분리해 검증한 기록, 수치를 코드 밖으로 뺀 기록, 팀에서 합칠 수 있게 경계를 그은 기록.',
}

const ORDER = [
  'spirit-merge',
  'afk',
  'hide-and-ink',
  'unity-minigames',
  'resonance',
  'minigame-collection',
  'cookie-clicker',
]

const PROOFS = [
  {
    n: '01',
    title: '게임 규칙을 Unity 밖으로 꺼냅니다',
    body: '머지·전투·파견 규칙을 순수 C#으로 분리하고, Unity에는 화면만 남겼습니다. 규칙이 화면과 분리되면 같은 상황을 몇 번이든 다시 만들 수 있어서, 버그를 "재현 → 수정 → 같은 방법으로 재확인"으로 처리할 수 있습니다.',
    ev: 'Spirit Merge — 검증 명령 67개 · C# 스크립트 88개',
  },
  {
    n: '02',
    title: '밸런스 수치는 코드가 아니라 데이터에',
    body: '스테이지·아이템·설정값을 전부 CSV로 뺐습니다. 수치를 바꾸는 일이 코드 수정과 빌드를 거치지 않으니, 6주 동안 밸런스를 여러 번 다시 볼 수 있었습니다.',
    ev: 'AFK — 커밋 196 · 데이터 파일 5종 · 아이템 105종',
  },
  {
    n: '03',
    title: '여러 명이 붙어도 안 깨지는 경계',
    body: '4인 팀에서 시스템 경계를 먼저 긋고, 경계 사이는 이벤트로만 연결했습니다. 내 코드가 남의 코드를 직접 부르지 않으면, 상대가 바뀌어도 내 쪽은 그대로 돌아갑니다.',
    ev: 'Hide & Ink — 팀 커밋 801 · 담당 아키텍처·FSM',
  },
]

export default function GameRolePage() {
  const list = ORDER.map(getProjectBySlug).filter(Boolean) as NonNullable<
    ReturnType<typeof getProjectBySlug>
  >[]

  return (
    <div className="portfolio-page min-h-screen">
      <section className="play-section px-8 sm:px-12 pt-10">
        <div className="max-w-6xl mx-auto">
          <p className="ev-label">For Game Client</p>
          <h1 className="role-title">게임 클라이언트 개발자로 지원합니다.</h1>
          <p className="role-lead">
            Unity 6 · C#로 <strong>게임 루프를 끝까지 돌려본 사람</strong>입니다.
            기획 → 구현 → 검증 → 배포를 혼자서 한 바퀴씩 끝낸 프로젝트만 모았습니다.
            이 페이지는 게임 직무에 맞춰 순서를 다시 배열한 것입니다.
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
              <h2>게임 프로젝트</h2>
              <span className="count">
                전체 {list.length} · Unity {list.filter(p => p.type === 'unity').length} · 웹게임{' '}
                {list.filter(p => p.type !== 'unity').length}
              </span>
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
            <Link href="/backend" className="masthead-link">
              → AI 백엔드 직군으로 보기
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
