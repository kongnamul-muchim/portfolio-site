import type { Metadata } from 'next'

// /projects 는 'use client' 페이지라 metadata 를 직접 못 내보낸다 → 레이아웃에서 지정.
// (이전에는 홈과 title·description 이 완전히 같아서 검색·공유에서 구분이 안 됐다)
export const metadata: Metadata = {
  title: '프로젝트 11개 — Unity 게임 · AI 백엔드 · 서버 운영 | GuGu.dev',
  description:
    'Unity 게임 4개, 웹 5개, 서버 2개. 각 프로젝트마다 문제 정의·내린 결정·실측 숫자·한계를 기록했습니다. 6개는 브라우저에서 바로 플레이할 수 있습니다.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: '프로젝트 11개 — Unity 게임 · AI 백엔드 · 서버 운영',
    description: 'Unity 게임 4개, 웹 5개, 서버 2개. 6개는 브라우저에서 바로 플레이할 수 있습니다.',
    url: '/projects',
    images: ['/images/og.png'],
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
