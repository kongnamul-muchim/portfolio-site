'use client'

import { projects } from '@/data/projects'
import Reveal from '@/components/Reveal'
import ProjectGrid from '@/components/ProjectGrid'

export default function ProjectsPage() {
  return (
    <div className="portfolio-page min-h-screen">
      {/* 목록 헤더 */}
      <section className="play-section px-8 sm:px-12 pt-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="play-section-head">
              <h1>프로젝트</h1>
              <span className="count">전체 {projects.length}</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-neutral)' }}>
              Unity 게임부터 AI 시스템, 자체 서버 운영까지 — 직접 설계·개발·배포한 전체 작품 목록입니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 모든 작품 — 필터 + 카드 그리드 */}
      <section className="play-section px-8 sm:px-12 pt-0">
        <div className="max-w-6xl mx-auto">
          <ProjectGrid />
        </div>
      </section>
    </div>
  )
}