import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        nickname: { label: 'Nickname', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.nickname || !credentials?.password) return null

        const { UserService } = await import('@/services/user.service')
        const userService = new UserService()

        const user = await userService.validateUser(credentials.nickname, credentials.password)
        if (!user) return null

        // 단일 세션: 로그인할 때마다 식별자를 새로 발급하고 DB 값을 교체한다.
        // 이전 기기의 토큰은 sid 가 달라져 다음 요청에서 무효 처리된다.
        // 예외: 공용 데모 계정은 여러 방문자가 동시에 쓴다. sid 를 고정해
        //       서로 세션을 끊지 않게 한다(끊기면 "다른 기기가 로그인..." 경고가 뜬다).
        const isSharedDemo = user.nickname === 'demo'
        const sid = isSharedDemo ? 'demo-shared' : randomUUID()
        await prisma.user.update({ where: { id: user.id }, data: { activeSession: sid } })

        return {
          id: user.id,
          email: user.email,
          // 화면에 보이는 이름은 표시 이름, 없으면 로그인 아이디
          name: user.displayName || user.nickname,
          role: user.role,
          sid
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.sid = user.sid
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string

        // 단일 세션 검증 — DB 의 activeSession 과 토큰의 sid 가 다르면
        // 다른 기기에서 로그인했거나 비밀번호가 바뀐 것이므로 세션을 끝낸다.
        if (token.id && token.sid) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { activeSession: true, nickname: true, displayName: true }
          })
          session.user.sessionReplaced = !dbUser || dbUser.activeSession !== token.sid
          if (dbUser) session.user.name = dbUser.displayName || dbUser.nickname
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}