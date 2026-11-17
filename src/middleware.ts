import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// ── 로그인 시도 제한 ─────────────────────────────────────────
// 같은 IP 가 짧은 시간에 비밀번호를 계속 넣는 것을 막는다(무차별 대입 방지).
const LOGIN_WINDOW_MS = 5 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8
const loginAttempts = new Map<string, { count: number; first: number }>()

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now - entry.first > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, first: now })
    return false
  }

  entry.count += 1

  // 오래된 기록이 쌓이지 않도록 가끔 정리
  if (loginAttempts.size > 5000) {
    loginAttempts.forEach((value, key) => {
      if (now - value.first > LOGIN_WINDOW_MS) loginAttempts.delete(key)
    })
  }

  return entry.count > LOGIN_MAX_ATTEMPTS
}

const protectedPaths = [
  '/profile',
  '/community/write',
  '/community/edit',
]

const adminPaths = [
  '/community/admin',
  '/admin/jobs',
  '/admin',
  '/crm',
]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // 로그인 콜백(POST) 만 시도 횟수를 센다
  if (pathname === '/api/auth/callback/credentials' && req.method === 'POST') {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    if (isLoginRateLimited(ip)) {
      return NextResponse.json(
        { error: '로그인 시도가 너무 많습니다. 5분 뒤에 다시 시도해 주세요.' },
        { status: 429, headers: { 'Retry-After': '300' } }
      )
    }
  }

  // API routes authenticate internally via JWT token/session
  // But we still protect /api/admin/ paths at middleware level for defense-in-depth
  if (pathname.startsWith('/_next') || pathname.startsWith('/images/')) {
    return NextResponse.next()
  }

  const token = await getToken({ req })

  // Check admin-only paths (pages + admin API)
  if (adminPaths.some(path => pathname.startsWith(path)) ||
      pathname.startsWith('/api/admin/') ||
      pathname.startsWith('/api/crm/') ||
      pathname.startsWith('/api/jobs/')) {
    if (!token || token.role !== 'admin') {
      // For API routes, return JSON error instead of redirect
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 })
      }
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check protected paths
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
