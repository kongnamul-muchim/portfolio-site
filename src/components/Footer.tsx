export default function Footer() {
  return (
    <footer id="contact-section" className="border-t border-gray-200 dark:border-[#1F2937] bg-white dark:bg-[#111827]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E5E7EB] mb-3">About</h3>
            <p className="text-sm text-gray-500 dark:text-[#9CA3AF] leading-relaxed">
              독학으로 Unity/C#부터 시작해<br />
              Next.js, Docker, AI RAG까지 확장한<br />
              <strong className="text-gray-700 dark:text-gray-300">프로덕트 엔지니어</strong>입니다.<br /><br />
              SOLID 원칙 + DI Container로<br />
              유지보수 가능한 아키텍처를<br />
              설계하는 것을 지향합니다.
            </p>
          </div>
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E5E7EB] mb-3">Links</h3>
            <div className="space-y-2">
              <a href="https://github.com/kongnamul-muchim" target="_blank"
                className="block text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors">
                GitHub
              </a>
              <a href="https://games.olivilo.shop/resonance/" target="_blank"
                className="block text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors">
                잔향 (Resonance) RPG
              </a>
              <a href="https://cookieclicker.olivilo.shop" target="_blank"
                className="block text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors">
                Cookie Clicker
              </a>
              <a href="https://games.olivilo.shop/autoflow/" target="_blank"
                className="block text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors">
                AutoFlow
              </a>
              <a href="https://games.olivilo.shop" target="_blank"
                className="block text-sm text-gray-500 dark:text-[#9CA3AF] hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors">
                Match3 Game
              </a>
            </div>
          </div>
          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E5E7EB] mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {['Unity', 'C#', 'Next.js', 'TypeScript', 'React', 'Tailwind', 'Python', 'Blazor'].map(tech => (
                <span key={tech}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-[#1F2937] pt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-[#6B7280]">
            © {new Date().getFullYear()} GuGu. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
