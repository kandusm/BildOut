type OrganizationSchema = {
  '@context': string
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  description: string
  address?: {
    '@type': 'PostalAddress'
    addressCountry: string
  }
  sameAs?: string[]
}

type SoftwareAppSchema = {
  '@context': string
  '@type': 'SoftwareApplication'
  name: string
  applicationCategory: string
  offers: {
    '@type': 'Offer'
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: string
    reviewCount: string
  }
}

type BreadcrumbSchema = {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

type FAQSchema = {
  '@context': string
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

type ArticleSchema = {
  '@context': string
  '@type': 'Article'
  headline: string
  description: string
  author: {
    '@type': 'Organization' | 'Person'
    name: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo: {
      '@type': 'ImageObject'
      url: string
    }
  }
  datePublished: string
  dateModified?: string
}

type LocalBusinessSchema = {
  '@context': string
  '@type': 'LocalBusiness'
  name: string
  description: string
  url: string
  areaServed: {
    '@type': 'City'
    name: string
  }
}

type StructuredDataProps = {
  data: OrganizationSchema | SoftwareAppSchema | BreadcrumbSchema | FAQSchema | ArticleSchema | LocalBusinessSchema
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Pre-built schema generators
export const schemas = {
  organization: (): OrganizationSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BildOut',
    url: 'https://www.bildout.com',
    logo: 'https://www.bildout.com/logo.png',
    description: 'Simple invoicing software for contractors, builders, and small businesses. Create professional invoices, accept online payments, and get paid faster.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      'https://twitter.com/bildout',
      'https://linkedin.com/company/bildout',
    ],
  }),

  softwareApp: (): SoftwareAppSchema => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BildOut',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>): BreadcrumbSchema => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.bildout.com${item.url}`,
    })),
  }),

  faq: (questions: Array<{ question: string; answer: string }>): FAQSchema => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }),

  article: (article: {
    title: string
    description: string
    author: string
    publishDate: string
    modifiedDate?: string
  }): ArticleSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BildOut',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bildout.com/logo.png',
      },
    },
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
  }),

  localBusiness: (city: string, state: string, description: string): LocalBusinessSchema => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `BildOut - Invoicing for ${city} Contractors`,
    description,
    url: `https://www.bildout.com/${city.toLowerCase()}`,
    areaServed: {
      '@type': 'City',
      name: `${city}, ${state}`,
    },
  }),
}
