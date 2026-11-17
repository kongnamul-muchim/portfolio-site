import { getServerSession, Session } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/lib/auth/auth'

/**
 * Pages Router 라우트용 세션 검증.
 *
 * auth.ts 의 session 콜백이 DB 의 activeSession 과 비교해
 * sessionReplaced 를 채워주지만, 라우트가 `!session` 만 확인하면
 * 폐기된 세션도 그대로 통과한다. 여기서 한 번 더 막는다.
 */
export async function getValidSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  let session: Session | null = null
  try {
    session = await getServerSession(req, res, authOptions)
  } catch {
    return null
  }
  if (!session?.user) return null
  if (session.user.sessionReplaced) return null
  return session
}
