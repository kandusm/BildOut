import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support - Get Help with BildOut',
  description: 'Need help with BildOut? Browse our help resources, FAQs, and contact our support team for assistance with invoicing and payments.',
  alternates: {
    canonical: 'https://bildout.com/support',
  },
}

export default function SupportPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              How can we help?
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-3 mb-16">
              <Link href="/guides" className="group bg-brand-off-white p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-orange/10">
                    <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-2 group-hover:text-brand-orange transition-colors">
                  How-to Guides
                </h3>
                <p className="text-slate-600 text-sm">
                  Step-by-step tutorials on creating invoices, accepting payments, and more.
                </p>
              </Link>

              <Link href="/templates" className="group bg-brand-off-white p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-orange/10">
                    <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-2 group-hover:text-brand-orange transition-colors">
                  Invoice Templates
                </h3>
                <p className="text-slate-600 text-sm">
                  Pre-built templates for different trades and industries to get started quickly.
                </p>
              </Link>

              <Link href="/contact" className="group bg-brand-off-white p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-orange/10">
                    <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-brand-slate mb-2 group-hover:text-brand-orange transition-colors">
                  Contact Us
                </h3>
                <p className="text-slate-600 text-sm">
                  Can't find what you're looking for? Send us a message and we'll help you out.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-brand-off-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-brand-slate mb-8 text-center font-heading">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {/* Getting Started */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">How do I get started with BildOut?</h3>
                <p className="text-slate-600">
                  Simply sign up for a free account, complete your business profile, and you can start creating invoices right away.
                  The entire process takes less than 5 minutes. Check out our <Link href="/guides" className="text-blue-600 hover:underline">getting started guide</Link> for more details.
                </p>
              </div>

              {/* Payments */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">How do I accept online payments?</h3>
                <p className="text-slate-600">
                  To accept credit cards and ACH payments, you'll need to connect your Stripe account. This is a one-time setup that
                  takes about 5 minutes. Once connected, your clients can pay invoices online with a single click.
                </p>
              </div>

              {/* Fees */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">What are the payment processing fees?</h3>
                <p className="text-slate-600">
                  BildOut uses Stripe for payment processing. Credit card payments are 2.9% + $0.30 per transaction.
                  ACH bank transfers are just 0.8% with a $5 cap, making them much cheaper for large invoices.
                  There are no additional fees from BildOut for processing payments.
                </p>
              </div>

              {/* Trial */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">Is there really a free trial?</h3>
                <p className="text-slate-600">
                  Yes! You get 14 days free to try all of BildOut's features. No credit card required to start.
                  You can create invoices, accept payments, and explore all the tools with no commitment.
                </p>
              </div>

              {/* Pricing */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">How much does BildOut cost?</h3>
                <p className="text-slate-600">
                  BildOut offers simple, straightforward pricing starting at just $15/month for unlimited invoices and clients.
                  See our <Link href="/pricing" className="text-blue-600 hover:underline">pricing page</Link> for full details on plans and features.
                </p>
              </div>

              {/* Cancellation */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">Can I cancel anytime?</h3>
                <p className="text-slate-600">
                  Absolutely. You can cancel your subscription at any time from your account settings.
                  There are no cancellation fees or long-term contracts. If you cancel, you'll continue to have access until the end of your billing period.
                </p>
              </div>

              {/* Data Export */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">Can I export my invoice data?</h3>
                <p className="text-slate-600">
                  Yes, you can export your invoices and payment data to CSV format for use with accounting software or spreadsheets.
                  Each invoice can also be downloaded as a PDF.
                </p>
              </div>

              {/* Support */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-slate mb-2">How do I get help if I have a problem?</h3>
                <p className="text-slate-600">
                  You can reach out to our support team through the <Link href="/contact" className="text-blue-600 hover:underline">contact form</Link>.
                  We typically respond within 24 hours on business days. You can also check our guides and documentation for immediate answers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-slate text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-heading">Still have questions?</h2>
            <p className="text-lg mb-8">
              Our team is here to help. Get in touch and we'll answer any questions you have.
            </p>
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
