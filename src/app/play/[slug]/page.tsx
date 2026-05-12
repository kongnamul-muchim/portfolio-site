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

  const isMobileGame = project.id === 'afk'

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
      {/* Top bar - absolute minimum height */}
      <div className="shrink-0 bg-gray-800 border-b border-gray-700 px-3 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href={`/projects/${project.id}`}
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-sm font-medium text-white truncate">{project.title}</h1>
          <span className="text-xs text-gray-500 hidden sm:inline">|</span>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 hidden sm:inline"
          >
            Open in new tab ↗
          </a>
        </div>
      </div>

      {/* Game area - fills remaining space, NO scrollbars */}
      <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
        {isMobileGame ? (
          /* Portrait (mobile) game: 9:16 ratio, height-constrained */
          <div className="h-full max-h-full overflow-hidden flex items-center justify-center">
            <div
              className="relative overflow-hidden rounded-lg shadow-2xl"
              style={{
                height: 'min(100%, calc(100vw * 16 / 9))',
                aspectRatio: '9 / 16',
                maxHeight: '100%',
              }}
            >
              <iframe
                src={project.demo}
                title={`${project.title} Demo`}
                className="absolute inset-0 w-full h-full border-0 overflow-hidden"
                scrolling="no"
                allow="autoplay; fullscreen; clipboard-read; clipboard-write"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          /* Landscape game: 16:9 ratio, fills without overflow */
          <div className="w-full h-full overflow-hidden flex items-center justify-center p-2 sm:p-4">
            <div
              className="relative overflow-hidden rounded-lg shadow-2xl"
              style={{
                width: 'min(100%, calc(100vh * 16 / 9))',
                aspectRatio: '16 / 9',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                src={project.demo}
                title={`${project.title} Demo`}
                className="absolute inset-0 w-full h-full border-0 overflow-hidden"
                scrolling="no"
                allow="autoplay; fullscreen; clipboard-read; clipboard-write"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
