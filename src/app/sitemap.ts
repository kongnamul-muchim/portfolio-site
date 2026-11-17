import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

const BASE = 'https://portfolio.olivilo.shop'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/community`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/chat`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p.featured ? 0.8 : 0.5,
  }))

  return [...staticRoutes, ...projectRoutes]
}
