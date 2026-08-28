'use client'

import Link from 'next/link'
import { getFeaturedProjects, projects } from '@/data/projects'
import Reveal from '@/components/Reveal'
import ProjectCard from '@/components/ProjectCard'
import OrnateDetector from '@/components/OrnateDetector'

export default function Home() {
  const featuredProjects = getFeaturedProjects()

  return (
    <div className="portfolio-page min-h-screen">
      <OrnateDetector />
      {/* Marquee Hero — 게임 타이틀 화면 */}
      <section className="marquee-hero px-8 sm:px-12">
        <h1 className="marquee-display">
          <span className="line line-1">게임, AI, 인프라.</span>
          <span className="line accent-word line-2">세 영역을 직접 잇는</span>
          <span className="line line-3">개발자.</span>
        </h1>
        <p className="marquee-lede">
          고등학교 졸업 후 독학으로 시작해 Unity 게임과 미니게임 프로토타입을 직접 설계·개발하며 성장했습니다.
          클라이언트에서 백엔드, AI, 인프라까지 전 스택을 다루는,<br />
          <strong>견고하고 확장 가능한 게임 시스템을 설계하는 개발자</strong>입니다.
        </p>
        <div className="marquee-badges">
          <span className="marquee-badge hot">독학 개발자</span>
          <span className="marquee-badge">🎮 Unity 게임 아키텍처</span>
          <span className="marquee-badge">🤖 RAG AI 챗봇</span>
          <span className="marquee-badge">🐳 Docker 자체 운영</span>
          <span className="marquee-badge">☁️ Cloudflare + nginx</span>
        </div>
      </section>

      {/* About */}
      <section className="play-section px-8 sm:px-12 pt-0">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="play-section-head">
              <h2>About</h2>
              <span className="count">독학 스토리</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="about-card">
            <p>
              고등학교 졸업 후 <strong>독학</strong>으로 개발을 시작했습니다. Unity 게임 개발로 처음 코드를 배웠지만,
              <strong> “서버 없이 완성된 게임은 없다”</strong>는 생각에 Next.js와 Docker를 공부했고,
              <strong> “데이터 없이 AI는 없다”</strong>는 생각에 RAG와 pgvector까지 확장했습니다.
            </p>
            <p>
              지금은 <strong>클라이언트 → 백엔드 → AI → 인프라</strong>까지 전 스택을 직접 다루는
              <strong> 게임 개발자</strong>로서, SOLID 원칙과 DI Container로 유지보수 가능한
              게임 시스템 아키텍처를 설계하는 것을 가장 중요하게 생각합니다.
            </p>
            <div className="about-badges">
              <span className="about-badge">SOLID 원칙</span>
              <span className="about-badge">DI Container</span>
              <span className="about-badge">Event-driven</span>
              <span className="about-badge">RAG + pgvector</span>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Works — 대표 작품 (3개) */}
      {featuredProjects.length > 0 && (
        <section className="play-section px-8 sm:px-12 pt-0">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="play-section-head">
                <h2>대표 작품</h2>
                <span className="count">{featuredProjects.length}</span>
              </div>
            </Reveal>
            <div className="play-grid">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={Math.min(i * 70, 420)}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <div className="text-center mt-10">
                <Link href="/projects" className="play-card-cta">
                  전체 작품 보기 · {projects.filter(p => !p.featured).length}개 더
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}