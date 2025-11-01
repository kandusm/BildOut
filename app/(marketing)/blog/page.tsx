import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Invoicing Tips & Business Advice | BildOut',
  description: 'Read the latest tips on invoicing, getting paid faster, and managing your contracting business from the BildOut blog.',
  alternates: {
    canonical: 'https://bildout.com/blog',
  },
}

export default function BlogPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              BildOut Blog
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Tips, guides, and insights to help you get paid faster and grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Guide 1 */}
              <Link href="/guides" className="group">
                <div className="bg-brand-off-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-brand-orange to-brand-slate flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-brand-orange uppercase tracking-wide mb-2">
                      How-to Guide
                    </div>
                    <h3 className="text-xl font-semibold text-brand-slate mb-2 group-hover:text-brand-orange transition-colors">
                      How to Create Your First Invoice
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      A complete guide to creating professional invoices that get you paid faster.
                    </p>
                    <span className="text-brand-orange text-sm font-medium">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Guide 2 */}
              <Link href="/guides" className="group">
                <div className="bg-brand-off-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-brand-slate to-slate-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-brand-orange uppercase tracking-wide mb-2">
                      Payment Tips
                    </div>
                    <h3 className="text-xl font-semibold text-brand-slate mb-2 group-hover:text-brand-orange transition-colors">
                      5 Ways to Get Paid Faster
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Simple strategies to reduce payment delays and improve cash flow.
                    </p>
                    <span className="text-brand-orange text-sm font-medium">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Guide 3 */}
              <Link href="/templates" className="group">
                <div className="bg-brand-off-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-brand-orange uppercase tracking-wide mb-2">
                      Templates
                    </div>
                    <h3 className="text-xl font-semibold text-brand-slate mb-2 group-hover:text-brand-orange transition-colors">
                      Free Invoice Templates for Contractors
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Professional templates ready to use for construction, plumbing, electrical, and more.
                    </p>
                    <span className="text-brand-orange text-sm font-medium">
                      Browse templates →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-brand-off-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-brand-slate mb-8 text-center font-heading">
              Browse by Topic
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/guides" className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow group">
                <div className="mb-3">
                  <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-1 group-hover:text-brand-orange transition-colors">
                  Invoicing Tips
                </h3>
                <p className="text-slate-600 text-sm">
                  Best practices for creating and managing invoices
                </p>
              </Link>

              <Link href="/guides" className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow group">
                <div className="mb-3">
                  <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-1 group-hover:text-brand-orange transition-colors">
                  Getting Paid
                </h3>
                <p className="text-slate-600 text-sm">
                  Strategies to reduce payment delays
                </p>
              </Link>

              <Link href="/guides" className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow group">
                <div className="mb-3">
                  <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-1 group-hover:text-brand-orange transition-colors">
                  Business Growth
                </h3>
                <p className="text-slate-600 text-sm">
                  Tips for scaling your contracting business
                </p>
              </Link>

              <Link href="/guides" className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow group">
                <div className="mb-3">
                  <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-1 group-hover:text-brand-orange transition-colors">
                  Quick Tips
                </h3>
                <p className="text-slate-600 text-sm">
                  Fast, actionable advice you can use today
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup (placeholder) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-brand-slate mb-4 font-heading">
              More content coming soon
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              We're working on bringing you helpful content, guides, and tips for contractors and small business owners.
              In the meantime, check out our existing resources:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
                <Link href="/guides">Browse Guides</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/templates">View Templates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-slate text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-heading">Ready to get started?</h2>
            <p className="text-lg mb-8">
              Stop reading and start invoicing. Try BildOut free for 14 days.
            </p>
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
