'use client'

import { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 테마 클래스는 layout.tsx 의 인라인 스크립트가 첫 페인트 전에 이미 적용합니다.
    // 여기서는 localStorage 값이 없을 때만 시스템 설정을 따라가도록 보정합니다.
    const theme = localStorage.getItem('theme')
    if (theme) return
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  // 이전에는 mounted 전까지 null 을 반환해서 서버 렌더 HTML이 통째로 비었습니다.
  // (검색엔진·OG 스크래퍼가 본문을 못 읽는 원인) → 항상 children 을 렌더합니다.
  return <>{children}</>
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return { isDark, toggleTheme }
}
