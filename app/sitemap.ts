import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bildout.com'

  // Static pages (only include pages that actually exist)
  const staticPages = [
    '',
    '/home',
    '/login',
    '/signup',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
    '/guides',
    '/templates',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // TODO: Add your SEO pages here when they're ready
  // Example:
  // const seoPages = [
  //   '/invoice-templates/construction',
  //   '/invoice-templates/plumbing',
  //   '/how-to/create-invoice',
  // ].map((route) => ({
  //   url: `${baseUrl}${route}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))

  return [
    ...staticPages,
    // ...seoPages, // Uncomment when SEO pages are ready
  ]
}
