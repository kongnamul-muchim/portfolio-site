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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0E] text-gray-900 dark:text-[#E5E7EB]">
      {/* Hero Section */}
      <section className="hero-section pt-20 pb-12 px-4 text-center">
        {/* Avatar + Stats */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 p-[3px]">
          <div className="w-full h-full rounded-full bg-gray-50 dark:bg-[#0D0D0E] flex items-center justify-center text-3xl">
            🎮
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-2 break-keep leading-tight">
          게임 + AI + 인프라 <br className="sm:hidden" />
          <span className="hero-gradient">세 영역을 직접 연결하는 개발자</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-[#9CA3AF] max-w-2xl mx-auto px-2 leading-relaxed mb-3">
          Unity 게임 8종, RAG AI 챗봇, Docker 기반 자체 서버 운영까지.
          <br />클라이언트에서 백엔드, AI, 인프라까지 전 스택을 직접 다루는 <strong className="text-gray-700 dark:text-gray-300">프로덕트 엔지니어</strong>입니다.
        </p>
        {/* Quick Stats */}
        <div className="flex justify-center gap-6 sm:gap-10 mt-6 mb-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#22D3EE]">{allProjects.length}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#22D3EE]">{allProjects.filter(p => p.type === 'unity').length}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">Unity Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#22D3EE]">{allProjects.filter(p => p.demo).length}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">Live Demos</div>
          </div>
        </div>
        {/* Social Links */}
        <div className="flex justify-center gap-3 mt-3">
          <a
            href="https://github.com/kongnamul-muchim"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1F2937] text-gray-600 dark:text-[#9CA3AF] text-sm font-medium hover:text-cyan-500 dark:hover:text-[#22D3EE] transition-colors border border-gray-200 dark:border-[#1F2937]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            href="#contact-section"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#22D3EE] text-[#0D0D0E] text-sm font-semibold hover:shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all"
          >
            Contact
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 pb-8 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👋</span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#E5E7EB]">
              About
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-[#9CA3AF] leading-relaxed">
            <p>
              고등학교 졸업 후 <strong className="text-gray-800 dark:text-gray-200">독학</strong>으로 개발을 시작했습니다.
              Unity 게임 개발로 처음 코드를 배웠지만, <strong className="text-cyan-600 dark:text-[#22D3EE]">"서버 없이 완성된 게임은 없다"</strong>는 생각에
              Next.js와 Docker를 공부했고, <strong className="text-cyan-600 dark:text-[#22D3EE]">"데이터 없이 AI는 없다"</strong>는 생각에
              RAG와 pgvector까지 확장했습니다.
            </p>
            <p>
              지금은 <strong className="text-gray-800 dark:text-gray-200">클라이언트 → 백엔드 → AI → 인프라</strong>까지
              전 스택을 직접 다루는 <strong className="text-gray-800 dark:text-gray-200">프로덕트 엔지니어</strong>로서,
              SOLID 원칙과 DI Container로 유지보수 가능한 아키텍처를 설계하는 것을 가장 중요하게 생각합니다.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                🎮 8개 Unity 게임
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                🤖 RAG AI 챗봇
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                🐳 Docker 자체 운영
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ☁️ Cloudflare + nginx
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 pl-3 border-l-4 border-[#22D3EE] text-gray-900 dark:text-[#E5E7EB]">
              Featured Projects
            </h2>
            <div className="card-grid flex flex-wrap gap-6 justify-center sm:justify-start">
              {featuredProjects.map((project) => (
                <div key={project.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-0">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter + All Projects */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-semibold pl-3 border-l-4 border-[#22D3EE] text-gray-900 dark:text-[#E5E7EB]">
              All Projects
            </h2>
            <div className="flex gap-1.5 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeFilter === f.value
                      ? 'bg-[#22D3EE] text-[#0D0D0E]'
                      : 'bg-gray-100 dark:bg-[#1F2937] text-gray-500 dark:text-[#9CA3AF] hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-[#1F2937]'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
          <div className="card-grid flex flex-wrap gap-6 justify-center sm:justify-start">
            {filteredOtherProjects.map((project) => (
              <div key={project.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-0">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          {filteredOtherProjects.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-600 py-12 text-sm">
              No projects match this filter.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const defaultImage = '/images/default.jpeg'
  const hasRealImage = project.image !== '/images/placeholder.svg' && project.image !== defaultImage
  const displayImage = hasRealImage ? project.image : defaultImage

  const typeInfo = projectTypes.find(t => t.value === project.type)

  // Determine project scope badge
  const getScopeBadge = () => {
    if (!project.devPeriod) return null
    const days = project.devPeriod.includes('~')
      ? (() => {
          const parts = project.devPeriod.split('~').map(s => s.trim())
          if (parts.length === 2) {
            const start = new Date(parts[0])
            const end = new Date(parts[1])
            if (isNaN(end.getTime())) return '진행중'
            return Math.round((end.getTime() - start.getTime()) / (86400000)) + 1
          }
          return null
        })()
      : 1
    if (days === null) return null
    if (days === '진행중') return { label: '진행중', class: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' }
    if (days >= 30) return { label: `${Math.floor(days/30)}mo`, class: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' }
    if (days >= 7) return { label: `${days}d`, class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' }
    return { label: `${days}d`, class: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' }
  }

  const scopeBadge = getScopeBadge()

  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-card block bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#22D3EE] dark:hover:border-[#22D3EE] hover:shadow-lg"
    >
      <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-2">
        <img
          src={displayImage}
          alt={project.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/35 transition-opacity duration-200 group-hover:opacity-0" />
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2 py-1 rounded-md bg-black/50 text-white/90 backdrop-blur-sm">
            {typeInfo?.icon} {typeInfo?.label || project.type}
          </span>
        </div>
        {/* Scope badge */}
        {scopeBadge && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2 py-1 rounded-md font-medium backdrop-blur-sm ${scopeBadge.class}`}>
              {scopeBadge.label}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 min-w-0">
        <div className="flex items-center gap-2 mb-3 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-[#E5E7EB] truncate text-sm sm:text-base">
            {project.title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-[#9CA3AF] mb-3 line-clamp-2 break-words leading-relaxed">
          {project.description}
        </p>
        {project.devPeriod && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            📅 {project.devPeriod}
          </p>
        )}
        {project.github && (
          <GithubActivityBadge repo={project.github} />
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937]"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-gray-400">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
        <span className="block w-full text-center py-2.5 bg-[#22D3EE] text-[#0D0D0E] font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          View Project
        </span>
      </div>
    </Link>
  )
}
