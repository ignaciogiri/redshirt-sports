import { baseUrl } from '@lib/constants'

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og'],
      disallow: ['/api/', '/studio/', '/_next/'],
    },
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  }
}