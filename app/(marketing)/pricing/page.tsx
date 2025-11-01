import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Simple, Transparent Invoicing Plans | BildOut',
  description: 'Start free forever. Upgrade to Pro for $15/month for advanced features. No hidden fees, cancel anytime.',
  alternates: {
    canonical: 'https://bildout.com/pricing',
  },
  openGraph: {
    title: 'Pricing - Simple, Transparent Invoicing Plans | BildOut',
    description: 'Start free forever. Upgrade to Pro for $15/month. No hidden fees.',
    type: 'website',
    url: 'https://bildout.com/pricing',
  },
}

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Start free forever. Upgrade when you're ready. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-brand-slate">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-brand-slate">$0</span>
                <span className="text-slate-600">/month</span>
              </div>
              <p className="mt-4 text-slate-600">Perfect for getting started</p>

              <div className="mt-8">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Up to 5 invoices/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Accept online payments</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Basic branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Client management</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Payment tracking</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-brand-orange rounded-xl p-8 text-white relative scale-105 shadow-xl">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-brand-slate text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$15</span>
                <span className="text-orange-100">/month</span>
              </div>
              <p className="mt-4 text-orange-100">For growing businesses</p>

              <div className="mt-8">
                <Button asChild className="w-full bg-white text-brand-orange hover:bg-orange-50">
                  <Link href="/signup">Start 14-Day Free Trial</Link>
                </Button>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Recurring invoices</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Custom branding & logo</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Automated payment reminders</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            {/* Agency Plan */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-brand-slate">Agency</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-brand-slate">$49</span>
                <span className="text-slate-600">/month</span>
              </div>
              <p className="mt-4 text-slate-600">For teams & agencies</p>

              <div className="mt-8">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Up to 5 team members</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Advanced permissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">White-label options</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Dedicated account manager</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Processing Fees */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-brand-slate text-center mb-8">Payment processing fees</h2>
            <div className="bg-white rounded-xl border p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-brand-orange font-semibold mb-2">Credit/Debit Cards</div>
                  <div className="text-2xl font-bold text-brand-slate">2.9% + $0.30</div>
                  <div className="text-sm text-slate-600 mt-1">per transaction</div>
                </div>
                <div>
                  <div className="text-brand-orange font-semibold mb-2">ACH Bank Transfer</div>
                  <div className="text-2xl font-bold text-brand-slate">0.8%</div>
                  <div className="text-sm text-slate-600 mt-1">$5 minimum</div>
                </div>
                <div>
                  <div className="text-brand-orange font-semibold mb-2">Payout Speed</div>
                  <div className="text-2xl font-bold text-brand-slate">1-2 days</div>
                  <div className="text-sm text-slate-600 mt-1">to your bank</div>
                </div>
              </div>
              <p className="text-center text-sm text-slate-600 mt-6">
                No setup fees • No monthly minimums • No hidden costs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-slate text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-brand-slate mb-2">Can I start with the free plan and upgrade later?</h3>
                <p className="text-slate-600">
                  Absolutely! Start with the free plan and upgrade to Pro or Agency anytime. Your data and settings carry over seamlessly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate mb-2">Do I need a credit card to start?</h3>
                <p className="text-slate-600">
                  No credit card required for the free plan. Pro and Agency plans include a 14-day free trial—no commitment required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate mb-2">Can I cancel anytime?</h3>
                <p className="text-slate-600">
                  Yes, cancel anytime with one click. No cancellation fees. Your account remains active until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-600">
                  We accept all major credit cards (Visa, Mastercard, Amex, Discover) for subscription payments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate mb-2">Are there any setup fees or contracts?</h3>
                <p className="text-slate-600">
                  No setup fees, no contracts, no commitments. Pay month-to-month and cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-brand-orange">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start for free today
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Join hundreds of contractors billing smarter with BildOut.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="secondary" className="text-base px-8">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-orange-100">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
