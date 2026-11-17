import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/community/post', '/community/write'],
      },
    ],
    sitemap: 'https://portfolio.olivilo.shop/sitemap.xml',
    host: 'https://portfolio.olivilo.shop',
  }
}
