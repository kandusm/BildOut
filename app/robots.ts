import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bildout.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/features',
          '/about',
          '/support',
          '/privacy',
          '/terms',
          '/login',
          '/signup',
          '/guides',
          '/templates',
          '/blog',
          // Add your SEO pages here:
          // '/invoice-templates/',
          // '/how-to/',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/pay/',  // Payment links are public but shouldn't be indexed
          '/_next/',
          '/.*',  // Disallow any hidden files
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
