import Link from 'next/link'
import { projects, getFeaturedProjects, getOtherProjects, projectTypes } from '@/data/projects'

export default function Home() {
  const featuredProjects = getFeaturedProjects()
  const otherProjects = getOtherProjects()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0E] text-gray-900 dark:text-[#E5E7EB]">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-2 break-keep">
          My <span className="hero-gradient">Projects</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-[#9CA3AF] px-2">
          Unity Games, Web Applications, and Tools
        </p>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 pl-3 border-l-4 border-[#22D3EE] text-gray-900 dark:text-[#E5E7EB]">
              Featured Projects
            </h2>
            <div className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 pl-3 border-l-4 border-[#22D3EE] text-gray-900 dark:text-[#E5E7EB]">
            All Projects
          </h2>
          <div className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const defaultImage = '/images/defult.jpeg'
  const hasRealImage = project.image !== '/images/placeholder.svg' && project.image !== defaultImage
  const displayImage = hasRealImage ? project.image : defaultImage

  const typeInfo = projectTypes.find(t => t.value === project.type)

  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-card block bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1F2937] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#22D3EE] dark:hover:border-[#22D3EE] hover:shadow-lg"
    >
      <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={displayImage}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/35 transition-opacity duration-200 group-hover:opacity-0" />
      </div>
      <div className="p-4 min-w-0">
        <div className="flex items-center gap-2 mb-2 min-w-0">
          {typeInfo && (
            <span className="text-xs text-gray-400 shrink-0">{typeInfo.icon}</span>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-[#E5E7EB] truncate">
            {project.title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-[#9CA3AF] mb-2 line-clamp-2 break-words">
          {project.description}
        </p>
        {project.devPeriod && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            📅 {project.devPeriod}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#1F2937]"
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
        <span className="block w-full text-center py-2 bg-[#22D3EE] text-[#0D0D0E] font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          View Project
        </span>
      </div>
    </Link>
  )
}
