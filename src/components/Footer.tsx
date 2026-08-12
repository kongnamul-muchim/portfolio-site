// Ft8 마퀴 스크롤 푸터 — 게임 크레딧 느낌
const MARQUEE_ITEMS = [
  'Unity', 'C#', 'Next.js', 'TypeScript', 'Docker', 'PostgreSQL',
  'RAG', 'pgvector', 'SOLID', 'DI Container', 'nginx', 'Cloudflare',
]

export default function Footer() {
  const track = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS] // 두 번 반복 → -50% 애니메이션

  return (
    <footer id="contact-section" className="marquee-footer">
      {/* 마퀴 스크롤 */}
      <div className="marquee-track" aria-hidden="true">
        {track.map((item, i) => (
          <span key={i}>
            {item} <span className="sep">✦</span>
          </span>
        ))}
      </div>

      <div className="marquee-footer-inner">
        <h2 className="wordmark">GuGu<span className="dot">.</span>dev</h2>
        <p className="tagline">
          독학으로 Unity에서 시작해 게임 · AI · 인프라까지 확장한 프로덕트 엔지니어.
          만들고, 운영하고, 기록합니다.
        </p>
        <div className="meta">
          <a
            href="https://github.com/kongnamul-muchim"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="#contact-section">Contact</a>
          <span className="copyright">
            © {new Date().getFullYear()} GuGu · Built with Next.js & Tailwind CSS
          </span>
        </div>
      </div>
    </footer>
  )
}
