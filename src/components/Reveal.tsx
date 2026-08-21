'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 스크롤 진입 시 fade-up 등장 효과 (영상 D 요소)
 * - IntersectionObserver로 뷰포트 진입 시 .reveal-visible 추가
 * - SSR/초기 상태는 숨김(opacity 0), JS 없으면 CSS noscript 폴백 없음 — Next.js이므로 JS 필수
 * - prefers-reduced-motion 사용자는 즉시 표시 (CSS에서 처리)
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
