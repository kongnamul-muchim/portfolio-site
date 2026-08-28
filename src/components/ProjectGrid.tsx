'use client'

import { useState } from 'react'
import { projects } from '@/data/projects'
import Reveal from './Reveal'
import ProjectCard from './ProjectCard'

export default function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { value: 'all', label: 'All', count: projects.length },
    { value: 'unity', label: 'Unity', count: projects.filter(p => p.type === 'unity').length },
    { value: 'web', label: 'Web', count: projects.filter(p => p.type === 'web').length },
    { value: 'server', label: 'Server', count: projects.filter(p => p.type === 'server').length },
  ]

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.type === activeFilter)

  return (
    <>
      <Reveal delay={60}>
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
      </Reveal>
      <div className="play-grid">
        {filteredProjects.map((project, i) => (
          <Reveal key={project.id} delay={Math.min(i * 40, 300)}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <p className="text-center py-12 text-sm" style={{ color: 'var(--color-neutral)' }}>
          이 필터에 해당하는 작품이 없습니다.
        </p>
      )}
    </>
  )
}