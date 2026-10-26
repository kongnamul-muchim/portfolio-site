import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI를 어떻게 썼나 | GuGu.dev',
  description:
    'AI에게 맡긴 일과 내가 판단한 일을 구분해서 적었습니다. AI가 틀렸을 때 잡아낸 사례도 함께 적었습니다.',
}

const SPLIT = [
  {
    head: 'AI에게 맡긴 일',
    tone: 'ai',
    items: [
      '반복되는 코드 골격 작성 (DI 등록, 보일러플레이트)',
      '로그 파일에서 에러 줄만 뽑아 요약하기',
      '테스트 케이스 목록의 초안 만들기',
      '문서·주석 초안',
      '모르는 API의 사용법을 빠르게 훑기',
    ],
  },
  {
    head: '내가 판단한 일',
    tone: 'me',
    items: [
      '시스템 경계를 어디서 자를지 (Core / Presentation 분리)',
      '"무엇을 검증할 것인가"를 정하는 일',
      '밸런스 수치와 게임 규칙의 최종 결정',
      '버그의 진짜 원인이 무엇인지 확정하는 일',
      'AI가 준 답을 채택할지 버릴지',
    ],
  },
]

const CASES = [
  {
    n: '01',
    title: 'AI는 "코드 완벽"이라 했지만, 실행하니 null이었다',
    body:
      '힌트 반짝임 효과가 안 나오는 문제를 AI에게 물었더니 "코드는 문제없다"는 답이 왔습니다. 그래서 Unity를 Play 모드로 돌려 직접 확인했고, highlightSprite가 비어 있는 걸 찾았습니다. AI가 코드만 읽고 판단한 결론이 틀린 경우였습니다. 이후로 AI 답은 "실행해서 확인한 것"만 채택합니다.',
    verdict: 'AI 판정 → 틀림. 실행이 잡아냄.',
  },
  {
    n: '02',
    title: 'AI 제안을 거부하고 구조를 다시 짰다',
    body:
      'Spirit Merge를 시작할 때 AI는 "MonoBehaviour 하나에 다 넣으면 빠르다"고 했습니다. 빠르긴 하지만, 그러면 게임 규칙이 Unity에 묶여서 테스트를 못 합니다. Core(순수 C#)와 Presentation(Unity)을 나누는 쪽을 택했고, 그 덕분에 검증 명령 67개로 같은 상황을 반복 재현할 수 있었습니다.',
    verdict: 'AI 제안 → 거부. 이유를 설명할 수 있음.',
  },
  {
    n: '03',
    title: '설명 못 하는 코드는 쓰지 않는다',
    body:
      'AI가 짜준 코드가 돌아가더라도, 왜 그렇게 동작하는지 제가 설명하지 못하면 그 코드는 쓰지 않습니다. 나중에 그 부분에서 버그가 나면 고칠 수가 없기 때문입니다. 지금 사이트에 올린 프로젝트는 전부 "이 결정을 왜 했나"를 말할 수 있는 것들입니다.',
    verdict: '채택 기준 → 설명 가능 여부.',
  },
]

export default function AiPage() {
  return (
    <div className="portfolio-page min-h-screen">
      <section className="play-section px-8 sm:px-12 pt-10">
        <div className="max-w-4xl mx-auto">
          <p className="ev-label">How I Use AI</p>
          <h1 className="role-title">AI를 어디까지 쓰고, 어디서 멈추는가.</h1>
          <p className="role-lead">
            결론부터: <strong>AI를 씁니다.</strong> 안 썼다고 말하면 거짓말입니다.
            대신 <strong>맡긴 일과 내가 판단한 일을 구분</strong>해서 말할 수 있습니다.
            아래는 실제로 있었던 일만 적었습니다.
          </p>

          <div className="ai-split">
            {SPLIT.map((col) => (
              <div key={col.head} className={`ai-col ai-col-${col.tone}`}>
                <p className="ev-label">{col.head}</p>
                <ul className="ai-list">
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="role-proofs" style={{ marginTop: '2.5rem' }}>
            {CASES.map((c) => (
              <div key={c.n} className="role-proof">
                <div className="ev-decision-q">
                  <span className="ev-num">{c.n}</span>
                  <span className="role-proof-title">{c.title}</span>
                </div>
                <p className="ev-decision-why">{c.body}</p>
                <p className="role-proof-ev">{c.verdict}</p>
              </div>
            ))}
          </div>

          <p className="role-lead" style={{ marginTop: '2rem', marginBottom: 0 }}>
            이 사이트의 프로젝트 상세 페이지에는 <strong>왜 그 결정을 했는지</strong>와{' '}
            <strong>어디까지 검증했는지, 무엇이 아직 안 되는지</strong>를 같이 적어뒀습니다.
            좋은 말만 적으면 그게 AI가 쓴 글처럼 보이기 때문입니다.
          </p>

          <div className="role-foot">
            <Link href="/game" className="masthead-link">
              → 게임 클라이언트 직군으로 보기
            </Link>
            <Link href="/backend" className="masthead-link">
              → AI 백엔드 직군으로 보기
            </Link>
            <Link href="/projects" className="masthead-link">
              → 전체 프로젝트
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
