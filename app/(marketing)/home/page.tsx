import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import { StructuredData, schemas } from '@/components/seo/structured-data'

export const metadata: Metadata = {
  title: 'BildOut - Simple Invoicing for Builders & Contractors',
  description: 'Create professional invoices, accept payments, and get paid faster. BildOut streamlines billing for construction companies, contractors, plumbers, electricians, and small businesses.',
  alternates: {
    canonical: '/home',
  },
  openGraph: {
    title: 'BildOut - Simple Invoicing for Builders & Contractors',
    description: 'Create professional invoices, accept payments, and get paid faster.',
    type: 'website',
    url: 'https://bildout.com/home',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BildOut - Simple Invoicing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BildOut - Simple Invoicing for Builders & Contractors',
    description: 'Create professional invoices, accept payments, and get paid faster.',
    images: ['/og-image.png'],
  },
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={schemas.organization()} />
      <StructuredData data={schemas.softwareApp()} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-off-white to-white py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo and Company Name */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <img src="/logo.svg" alt="BildOut Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-slate font-heading">
                BildOut
              </h2>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-6xl font-heading">
              Your work. <span className="text-brand-orange">Billed out.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              Simple invoicing for builders, contractors, and small businesses.
              Create professional invoices, accept payments online, and get paid faster.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/templates">View Templates</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-sm font-medium text-slate-600 mb-8">
              TRUSTED BY PROFESSIONALS ACROSS INDUSTRIES
            </p>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
              <div>
                <p className="text-3xl font-bold text-brand-orange">$250K+</p>
                <p className="text-sm text-slate-600 mt-1">Processed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-orange">500+</p>
                <p className="text-sm text-slate-600 mt-1">Invoices Sent</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-orange">98%</p>
                <p className="text-sm text-slate-600 mt-1">Payment Success</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-orange">1-2 Days</p>
                <p className="text-sm text-slate-600 mt-1">To Get Paid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              Everything you need to get paid
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Professional invoicing tools designed for how you work
            </p>
          </div>

          <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="rounded-lg bg-orange-100 p-3 text-brand-orange w-fit">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-slate">Create invoices in seconds</h3>
              <p className="mt-2 text-slate-600">
                Professional, branded invoices with your logo. Line items, taxes, and discounts—all automatic.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="rounded-lg bg-green-100 p-3 text-brand-mint w-fit">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-slate">Accept payments online</h3>
              <p className="mt-2 text-slate-600">
                Credit cards, debit cards, and ACH bank transfers. Your clients pay with a click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="rounded-lg bg-slate-200 p-3 text-brand-slate w-fit">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-slate">Get paid faster</h3>
              <p className="mt-2 text-slate-600">
                Funds deposited to your bank in 1-2 days. Automated reminders for overdue invoices.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600 w-fit">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-slate">Professional branding</h3>
              <p className="mt-2 text-slate-600">
                Upload your logo, customize colors, and add your business details. Every invoice reflects your brand.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600 w-fit">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-slate">Track everything</h3>
              <p className="mt-2 text-slate-600">
                See who's paid, who's pending, and who's overdue. Dashboard analytics keep you informed.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="rounded-lg bg-amber-100 p-3 text-amber-600 w-fit">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-slate">Save time</h3>
              <p className="mt-2 text-slate-600">
                Reusable line items, client profiles, and invoice templates. Spend less time on paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              Simple as 1-2-3
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From setup to payment in minutes
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-slate">Sign up & connect</h3>
                  <p className="mt-2 text-slate-600">
                    Create your account in 30 seconds. Connect your bank account with Stripe to receive payments.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-slate">Create & send invoices</h3>
                  <p className="mt-2 text-slate-600">
                    Add your client's details, line items, and hit send. Your client receives an email with a payment link.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-slate">Get paid</h3>
                  <p className="mt-2 text-slate-600">
                    Your client pays online with their card or bank account. Funds arrive in your account in 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/signup">Start Billing Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Industry-Specific Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              Built for your industry
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Tailored invoice templates for every trade
            </p>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Link
              href="/templates/construction"
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border"
            >
              <div className="text-3xl mb-2">🏗️</div>
              <p className="font-medium text-brand-slate">Construction</p>
            </Link>
            <Link
              href="/templates/plumbing"
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border"
            >
              <div className="text-3xl mb-2">🔧</div>
              <p className="font-medium text-brand-slate">Plumbing</p>
            </Link>
            <Link
              href="/templates/electrical"
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border"
            >
              <div className="text-3xl mb-2">⚡</div>
              <p className="font-medium text-brand-slate">Electrical</p>
            </Link>
            <Link
              href="/templates/landscaping"
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border"
            >
              <div className="text-3xl mb-2">🌳</div>
              <p className="font-medium text-brand-slate">Landscaping</p>
            </Link>
            <Link
              href="/templates/hvac"
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border"
            >
              <div className="text-3xl mb-2">❄️</div>
              <p className="font-medium text-brand-slate">HVAC</p>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/templates" className="text-brand-orange font-medium hover:underline">
              View all templates →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-brand-orange">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get paid faster?
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Join hundreds of contractors who've simplified their billing with BildOut.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="secondary" className="text-base px-8">
                <Link href="/signup">Create Your Free Account</Link>
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
