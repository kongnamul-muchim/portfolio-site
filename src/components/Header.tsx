'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from './ThemeProvider'
import { usePathname } from 'next/navigation'
import VisitorBadge from './VisitorBadge'

export default function Header() {
  const { data: session } = useSession()
  const { isDark, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projectTreeOpen, setProjectTreeOpen] = useState(false)

  const isCommunity = pathname.startsWith('/community')
  const isPlay = pathname.startsWith('/play')
  const isCrm = pathname.startsWith('/crm')
  const isJobs = pathname.startsWith('/admin/jobs')

  const projectTree = [
    { category: 'Unity', icon: '🎮', items: [
      { slug: 'chaincrush', label: 'ChainCrush', icon: '💎' },
      { slug: 'shotfire', label: 'ShotFire', icon: '🔫' },
      { slug: 'afk', label: 'AFK Idle RPG', icon: '🌙' },
      { slug: 'defencegame', label: 'DefenceGame', icon: '🎯' },
      { slug: 'greeddungeon', label: 'GreedDungeon', icon: '⚔️' },
      { slug: 'pathfinder', label: 'Pathfinder', icon: '🗺️' },
      { slug: 'shotup', label: 'ShotUp', icon: '🎯' },
    ]},
    { category: 'Web', icon: '🌐', items: [
      { slug: 'minigame-collection', label: 'Mini Game Collection', icon: '🎮' },
      { slug: 'community-board', label: 'Community Board', icon: '💬' },
    ]},
    { category: 'Server', icon: '🖥️', items: [
      { slug: 'cookie-clicker', label: 'Cookie Clicker', icon: '🍪' },
    ]},
    { category: 'Package', icon: '📦', items: [
      { slug: 'gamedevtoolkit', label: 'GameDevToolkit', icon: '🧰' },
    ]},
    { category: 'Docs', icon: '📄', items: [
      { slug: 'kirdia-simulator', label: 'Kirdia Simulator', icon: '📖' },
    ]},
  ]

  return (
    <header className="bg-white dark:bg-[#111827] shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-[#1F2937]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-[#E5E7EB] hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors">
              Portfolio
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  !isCommunity && !isPlay && pathname === '/'
                    ? 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-[#22D3EE]'
                    : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Projects
              </Link>
              <Link
                href="/community"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isCommunity
                    ? 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-[#22D3EE]'
                    : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Community
              </Link>
              <Link
                href="/crm"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isCrm
                    ? 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-[#22D3EE]'
                    : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                CRM
              </Link>
              <Link
                href="/admin/jobs"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isJobs
                    ? 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-[#22D3EE]'
                    : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Jobs
              </Link>
              <button
                onClick={() => setProjectTreeOpen(!projectTreeOpen)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  projectTreeOpen || isPlay
                    ? 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-[#22D3EE]'
                    : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Play Demo
              </button>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="테마 전환"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <VisitorBadge />

            {session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {session.user?.name?.charAt(0) || '?'}
                  </div>
                  <span>{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Project Tree Dropdown */}
        {projectTreeOpen && (
          <div className="hidden md:block absolute left-0 right-0 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-[#1F2937] shadow-lg"
            onMouseLeave={() => setProjectTreeOpen(false)}
          >
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="grid grid-cols-5 gap-4">
                {projectTree.map(cat => (
                  <div key={cat.category}>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-[#9CA3AF] mb-2 flex items-center gap-1">
                      <span>{cat.icon}</span> {cat.category}
                    </h3>
                    <div className="space-y-1">
                      {cat.items.map(item => (
                        <Link
                          key={item.slug}
                          href={`/projects/${item.slug}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-cyan-600 dark:hover:text-[#22D3EE] transition-colors"
                          onClick={() => setProjectTreeOpen(false)}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-[#1F2937]">
            <div className="space-y-2">
              <Link href="/" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                📂 Projects
              </Link>
              <Link href="/community" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                💬 Community
              </Link>
              <Link href="/crm" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                📊 CRM
              </Link>
              <Link href="/admin/jobs" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                📋 Jobs
              </Link>
              <div className="pl-4 space-y-1">
                <p className="text-xs text-gray-400 px-2 mt-2 mb-1">Play Demos</p>
                {projects.map(p => (
                  <Link key={p.slug} href={`/play/${p.slug}`} className="block px-4 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    ▶ {p.title}
                  </Link>
                ))}
              </div>
              {session ? (
                <>
                  <Link href="/profile" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    👤 Profile
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="block px-4 py-2 rounded-lg text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

const projects = [
  { slug: 'chaincrush', title: 'ChainCrush' },
  { slug: 'shotfire', title: 'ShotFire' },
  { slug: 'afk', title: 'AFK Idle RPG' },
  { slug: 'minigame-collection', title: 'Mini Game Collection' },
  { slug: 'cookie-clicker', title: 'Cookie Clicker' },
]
