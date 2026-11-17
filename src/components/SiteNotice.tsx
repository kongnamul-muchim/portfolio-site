'use client'

import { useEffect, useState } from 'react'

/**
 * 페이지 이동 후 한 번만 뜨는 안내 토스트.
 * sessionStorage 의 site_notice 값을 읽어 5초간 보여주고 지운다.
 * (예: 다른 기기 로그인으로 이전 기기가 로그아웃됨)
 */
export default function SiteNotice() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('site_notice')
      if (!saved) return
      sessionStorage.removeItem('site_notice')
      setMessage(saved)
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    } catch {
      // sessionStorage 접근 차단 환경(사생활 보호 모드 등)에서는 조용히 넘어간다
    }
  }, [])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm shadow-lg"
    >
      {message}
    </div>
  )
}
