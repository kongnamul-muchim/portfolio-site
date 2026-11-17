import { getToken, JWT } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'

/**
 * App Router 라우트용 세션 검증.
 *
 * getToken() 은 JWT 를 디코드만 할 뿐 DB 상태를 보지 않는다.
 * 그래서 다른 기기에서 로그인해도(또는 비밀번호가 바뀌어도) 예전 토큰이
 * 만료(기본 30일)까지 계속 통과하는 문제가 있었다.
 *
 * 토큰의 sid 와 User.activeSession 이 일치할 때만 유효한 토큰을 돌려준다.
 * 불일치/사용자 없음/DB 오류는 모두 null(=미인증)로 처리한다.
 */
export async function getValidToken(req: NextRequest, options?: { raw?: boolean }): Promise<JWT | null> {
  let token: JWT | null = null
  try {
    token = await getToken({ req })
  } catch {
    return null
  }
  if (!token?.id || !token?.sid) return null

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { activeSession: true },
    })
    if (!dbUser || dbUser.activeSession !== token.sid) return null
  } catch {
    return null
  }

  return token
}

/** 토큰이 관리자이고 세션이 살아있는지. */
export async function getValidAdminToken(req: NextRequest): Promise<JWT | null> {
  const token = await getValidToken(req)
  if (!token || token.role !== 'admin') return null
  return token
}
