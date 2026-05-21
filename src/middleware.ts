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

  // API routes don't need middleware protection (they handle auth themselves)
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.startsWith('/images/')) {
    return NextResponse.next()
  }

  const token = await getToken({ req })

  // Check admin-only paths
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!token || token.role !== 'admin') {
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
