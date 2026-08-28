'use client'

import Link from 'next/link'
import type { Project } from '@/data/projects'
import { projectTypes } from '@/data/projects'
import GithubActivityBadge from './GithubActivityBadge'

export default function ProjectCard({ project }: { project: Project }) {
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