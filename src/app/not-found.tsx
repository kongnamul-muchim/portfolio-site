import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="portfolio-page min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        <p
          className="text-xs font-bold tracking-[0.18em] uppercase mb-4"
          style={{ color: 'var(--color-muted)' }}
        >
          404 — Not Found
        </p>

        <h1
          className="text-2xl sm:text-3xl mb-3"
          style={{
            fontFamily: 'var(--font-display), Pretendard, sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          이 페이지는 없습니다
        </h1>

        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-neutral)' }}>
          주소가 바뀌었거나 오타일 수 있습니다. 아래에서 원하는 곳으로 이동해 주세요.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--color-accent)', color: '#0D0D0E' }}
          >
            처음으로
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ border: '1px solid var(--color-rule)', color: 'var(--color-ink)' }}
          >
            전체 프로젝트
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ border: '1px solid var(--color-rule)', color: 'var(--color-ink)' }}
          >
            AI 챗봇
          </Link>
        </div>
      </div>
    </div>
  )
}
