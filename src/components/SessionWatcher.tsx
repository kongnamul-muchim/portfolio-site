'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'

/**
 * 단일 세션 감시자.
 * 다른 기기에서 로그인하면 현재 기기의 토큰은 서버에서 무효가 된다.
 * 세션 응답의 sessionReplaced 를 보고 자동 로그아웃 + 안내 페이지로 보낸다.
 */
export default function SessionWatcher() {
  const { data: session } = useSession()
  const moved = useRef(false)

  useEffect(() => {
    const replaced = (session?.user as { sessionReplaced?: boolean } | undefined)?.sessionReplaced
    if (!replaced || moved.current) return

    moved.current = true
    signOut({ redirect: false }).finally(() => {
      window.location.href = '/login?notice=replaced'
    })
  }, [session])

  return null
}
