'use client'

import { useEffect } from 'react'

/**
 * ?ornate=1 파라미터 감지 → <html>에 .ornate 클래스 추가 (테스트 비교용)
 * 서버 컴포넌트(상세 페이지 등)에서도 사용할 수 있도록 클라이언트 컴포넌트로 분리
 */
export default function OrnateDetector() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('ornate') === '1') {
      document.documentElement.classList.add('ornate')
    }
  }, [])
  return null
}
