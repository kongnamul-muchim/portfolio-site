import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

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
