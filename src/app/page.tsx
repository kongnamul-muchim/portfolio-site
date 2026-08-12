'use client'

import Link from 'next/link'
import { useState } from 'react'
import { projects, getFeaturedProjects, getOtherProjects, projectTypes } from '@/data/projects'
import GithubActivityBadge from '@/components/GithubActivityBadge'

export default function Home() {
  const featuredProjects = getFeaturedProjects()
  const otherProjects = getOtherProjects()
  const allProjects = [...featuredProjects, ...otherProjects]
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { value: 'all', label: 'All', count: allProjects.length },
    { value: 'unity', label: 'Unity', count: allProjects.filter(p => p.type === 'unity').length },
    { value: 'web', label: 'Web', count: allProjects.filter(p => p.type === 'web').length },
    { value: 'server', label: 'Server', count: allProjects.filter(p => p.type === 'server').length },
    { value: 'docs', label: 'Docs', count: allProjects.filter(p => p.type === 'docs').length },
    { value: 'wip', label: '제작중', count: allProjects.filter(p => p.type === 'wip').length },
  ]

  const filteredOtherProjects = activeFilter === 'all'
    ? otherProjects
    : otherProjects.filter(p => p.type === activeFilter)

  return (
    <div className="portfolio-page min-h-screen">
      {/* Marquee Hero — 게임 타이틀 화면 */}
      <section className="marquee-hero px-8 sm:px-12">
        <h1 className="marquee-display">
          게임, AI, 인프라.<br />
          <span className="accent-word">세 영역을 직접 잇는</span><br />
          개발자.
        </h1>
        <p className="marquee-lede">
          고등학교 졸업 후 독학으로 시작해 Unity 게임 8종을 직접 만들며 개발을 배웠습니다.
          클라이언트에서 백엔드, AI, 인프라까지 전 스택을 다루는,<br />
          <strong>견고하고 확장 가능한 게임 시스템을 설계하는 개발자</strong>입니다.
        </p>
        <div className="marquee-badges">
          <span className="marquee-badge hot">독학 개발자</span>
          <span className="marquee-badge">🎮 8개 Unity 게임</span>
          <span className="marquee-badge">🤖 RAG AI 챗봇</span>
          <span className="marquee-badge">🐳 Docker 자체 운영</span>
          <span className="marquee-badge">☁️ Cloudflare + nginx</span>
        </div>
      </section>

      {/* About */}
      <section className="play-section px-8 sm:px-12 pt-0">
        <div className="max-w-6xl mx-auto">
          <div className="play-section-head">
            <h2>About</h2>
            <span className="count">독학 스토리</span>
          </div>
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
        </div>
      </section>

      {/* Featured Works — 카드 그리드 */}
      {featuredProjects.length > 0 && (
        <section className="play-section px-8 sm:px-12 pt-0">
          <div className="max-w-6xl mx-auto">
            <div className="play-section-head">
              <h2>대표 작품</h2>
              <span className="count">{featuredProjects.length}</span>
            </div>
            <div className="play-grid">
              {featuredProjects.map((project) => (
                <PlayCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Works — 필터 + 카드 그리드 */}
      <section className="play-section px-8 sm:px-12 pt-0">
        <div className="max-w-6xl mx-auto">
          <div className="play-section-head">
            <h2>모든 작품</h2>
            <span className="count">{allProjects.length}</span>
          </div>
          <div className="filter-tabs">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`filter-tab ${activeFilter === f.value ? 'active' : ''}`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="play-grid">
            {filteredOtherProjects.map((project) => (
              <PlayCard key={project.id} project={project} />
            ))}
          </div>
          {filteredOtherProjects.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--color-neutral)' }}>
              이 필터에 해당하는 작품이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function PlayCard({ project }: { project: typeof projects[0] }) {
  const typeInfo = projectTypes.find(t => t.value === project.type)
  const defaultImage = '/images/default.jpeg'
  const hasRealImage = project.image !== '/images/placeholder.svg' && project.image !== defaultImage
  const displayImage = hasRealImage ? project.image : defaultImage

  return (
    <Link href={`/projects/${project.id}`} className="play-card">
      <div className="card-thumb">
        <img src={displayImage} alt={project.title} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3>{project.title}</h3>
          <span className={`play-chip type-${project.type}`}>
            {typeInfo?.icon} {typeInfo?.label || project.type}
          </span>
        </div>
        <p className="card-desc">{project.description}</p>
        <div className="card-meta">
          {project.devPeriod && (
            <span className="work-period">📅 {project.devPeriod}</span>
          )}
          {project.github && (
            <GithubActivityBadge repo={project.github} />
          )}
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="play-chip">{tech}</span>
          ))}
          {project.technologies.length > 4 && (
            <span className="more-tags">+{project.technologies.length - 4}</span>
          )}
        </div>
        <span className="card-cta">View Project →</span>
      </div>
    </Link>
  )
}
