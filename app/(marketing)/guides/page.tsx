import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoicing Guides - How to Get Paid Faster | BildOut',
  description: 'Learn how to create professional invoices, accept online payments, and get paid faster. Free guides for contractors, builders, and small businesses.',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Invoicing Guides - How to Get Paid Faster | BildOut',
    description: 'Learn how to create professional invoices, accept online payments, and get paid faster.',
    type: 'website',
    url: 'https://bildout.com/guides',
  },
}

const guides = [
  {
    slug: 'how-to-create-an-invoice',
    title: 'How to Create an Invoice',
    description: 'Step-by-step guide to creating professional invoices that get paid faster.',
    category: 'Getting Started',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-accept-online-payments',
    title: 'How to Accept Online Payments',
    description: 'Learn how to accept credit cards, debit cards, and ACH payments from clients.',
    category: 'Payments',
    readTime: '6 min read',
  },
  {
    slug: 'how-to-get-paid-faster',
    title: 'How to Get Paid Faster',
    description: 'Proven strategies to reduce payment delays and improve cash flow.',
    category: 'Best Practices',
    readTime: '7 min read',
  },
  {
    slug: 'invoice-payment-terms',
    title: 'Invoice Payment Terms Guide',
    description: 'Everything you need to know about payment terms, due dates, and late fees.',
    category: 'Best Practices',
    readTime: '8 min read',
  },
  {
    slug: 'what-to-include-on-an-invoice',
    title: 'What to Include on an Invoice',
    description: 'Essential information every invoice needs to be professional and compliant.',
    category: 'Getting Started',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-handle-late-payments',
    title: 'How to Handle Late Payments',
    description: 'Best practices for following up on overdue invoices and collecting payment.',
    category: 'Best Practices',
    readTime: '6 min read',
  },
  {
    slug: 'invoice-vs-receipt',
    title: 'Invoice vs Receipt: What\'s the Difference?',
    description: 'Understand the difference between invoices and receipts and when to use each.',
    category: 'Getting Started',
    readTime: '4 min read',
  },
  {
    slug: 'how-to-write-payment-terms',
    title: 'How to Write Clear Payment Terms',
    description: 'Create payment terms that protect your business and set clear expectations.',
    category: 'Best Practices',
    readTime: '6 min read',
  },
  {
    slug: 'invoice-numbering-system',
    title: 'How to Number Invoices',
    description: 'Best practices for creating an organized invoice numbering system.',
    category: 'Getting Started',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-send-an-invoice',
    title: 'How to Send an Invoice to a Client',
    description: 'Learn the best ways to send invoices and ensure they get paid promptly.',
    category: 'Getting Started',
    readTime: '5 min read',
  },
  {
    slug: 'whitelist-bildout-emails',
    title: 'How to Whitelist BildOut Emails',
    description: 'Ensure you receive all invoices and notifications. Step-by-step instructions for Gmail, Outlook, and other email providers.',
    category: 'Getting Started',
    readTime: '4 min read',
  },
]

const categories = ['All', 'Getting Started', 'Payments', 'Best Practices']

export default function GuidesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              Invoicing Guides & Resources
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Learn how to create professional invoices, accept payments online, and get paid faster. Free guides for contractors and small businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-brand-orange">
                      {guide.category}
                    </span>
                    <span className="text-xs text-slate-500">{guide.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-slate group-hover:text-brand-orange transition-colors mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {guide.description}
                  </p>
                  <div className="mt-4 text-sm font-medium text-brand-orange flex items-center gap-1">
                    Read guide
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-brand-orange">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to put these tips into action?
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Start creating professional invoices and getting paid faster with BildOut.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="secondary" className="text-base px-8">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
