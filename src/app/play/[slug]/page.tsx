import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects, getProjectBySlug } from '@/data/projects'

export function generateStaticParams() {
  return projects
    .filter(p => p.hasPlayableDemo && p.demo)
    .map((project) => ({
      slug: project.id,
    }))
}

export default function PlayDemoPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project || !project.hasPlayableDemo || !project.demo) notFound()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-sm font-medium text-white">{project.title}</h1>
          <span className="text-xs text-gray-500">|</span>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Open in new tab ↗
          </a>
        </div>
      </div>

      {/* Game iframe */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <iframe
          src={project.demo}
          title={`${project.title} Demo`}
          className="w-full h-full"
          allow="autoplay; fullscreen; clipboard-read; clipboard-write"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}
