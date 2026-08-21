'use client'

import { useEffect } from 'react'

/**
 * 메인 페이지 전용 — 항상 과한(ornate) 스타일 적용
 * (상세 페이지는 기본 스타일 고정)
 */
export default function OrnateDetector() {
  useEffect(() => {
    document.documentElement.classList.add('ornate')
  }, [])
  return null
}
