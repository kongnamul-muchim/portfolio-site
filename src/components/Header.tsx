'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from './ThemeProvider'
import { usePathname } from 'next/navigation'
import { projects } from '@/data/projects'

// 브라우저에서 바로 플레이 가능한 데모만 (Unity WebGL 제외)
const playableDemos = projects.filter(p => p.hasPlayableDemo && p.demo)

export default function Header() {
  const { data: session } = useSession()
  const { isDark, toggleTheme } = useTheme()
  const pathname = usePathname() ?? '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projectTreeOpen, setProjectTreeOpen] = useState(false)

  const isCommunity = pathname?.startsWith('/community')
  const isPlay = pathname?.startsWith('/play')
  const isCrm = pathname?.startsWith('/crm')
  const isJobs = pathname?.startsWith('/admin/jobs')
  const isAdminUsers = pathname?.startsWith('/admin/users')
  const isProjects = pathname?.startsWith('/projects')

  const linkClass = (active: boolean) =>
    `masthead-link ${active ? 'active' : ''}`

  return (
    <header className="masthead">
      <div className="masthead-inner">
        {/* 좌측 — 워드마크 */}
        <Link href="/" className="masthead-wordmark">
          GuGu<span className="dot">.</span>dev
        </Link>

        {/* 우측 — 링크 + 액션 (데스크톱) */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="masthead-nav">
            <Link href="/projects" className={linkClass(!!isProjects)}>
              Projects
            </Link>
            <Link href="/community" className={linkClass(!!isCommunity)}>
              Community
            </Link>
            {session?.user?.role === 'admin' && (
              <>
                <Link href="/crm" className={linkClass(!!isCrm)}>
                  CRM
                </Link>
                <Link href="/admin/jobs" className={linkClass(!!isJobs)}>
                  Jobs
                </Link>
                <Link href="/admin/users" className={linkClass(!!isAdminUsers)}>
                  Users
                </Link>
              </>
            )}
            <button
              onClick={() => setProjectTreeOpen(!projectTreeOpen)}
              className={`masthead-link ${projectTreeOpen || isPlay ? 'active' : ''}`}
            >
              Play Demo
            </button>
          </nav>
          <button
            onClick={toggleTheme}
            className="masthead-icon-btn"
            aria-label="테마 전환"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {session ? (
            <>
              <Link href="/profile" className="masthead-link">
                {session.user?.name}
              </Link>
              <button onClick={() => signOut()} className="masthead-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="masthead-link">
                Login
              </Link>
              <Link href="/signup" className="masthead-cta">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* 모바일 — 버거 + 테마 */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="masthead-icon-btn"
            aria-label="테마 전환"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="masthead-burger"
            aria-label="메뉴"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Play Demo 드롭다운 */}
      {projectTreeOpen && (
        <div
          className="hidden md:block absolute left-0 right-0 bg-transparent"
          style={{ background: 'var(--color-paper)' }}
          onMouseLeave={() => setProjectTreeOpen(false)}
        >
          <div className="max-w-6xl mx-auto px-6 py-4">
            <p className="text-xs mb-2" style={{ color: 'var(--color-neutral)' }}>
              브라우저에서 바로 플레이할 수 있는 데모예요
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {playableDemos.map(item => (
                <a
                  key={item.id}
                  href={item.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="masthead-link"
                  onClick={() => setProjectTreeOpen(false)}
                >
                  ▶ {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="masthead-mobile md:hidden">
          <Link href="/projects" onClick={() => setMobileMenuOpen(false)}>
            📂 Projects
          </Link>
          <Link href="/community" onClick={() => setMobileMenuOpen(false)}>
            💬 Community
          </Link>
          {session?.user?.role === 'admin' && (
            <>
              <Link href="/crm" onClick={() => setMobileMenuOpen(false)}>
                📊 CRM
              </Link>
              <Link href="/admin/jobs" onClick={() => setMobileMenuOpen(false)}>
                📋 Jobs
              </Link>
              <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)}>
                👥 Users
              </Link>
            </>
          )}
          <p className="text-xs mt-2 mb-1" style={{ color: 'var(--color-neutral)' }}>
            Play Demos
          </p>
          {playableDemos.map(p => (
            <a key={p.id} href={p.demo} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
              ▶ {p.title}
            </a>
          ))}
          {session ? (
            <>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                👤 Profile
              </Link>
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
