import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About BildOut - Simple Invoicing for Builders',
  description: 'Learn about BildOut, our mission to simplify billing for contractors and small businesses, and how we help you get paid faster.',
  alternates: {
    canonical: 'https://bildout.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              About BildOut
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We're on a mission to simplify billing for contractors and small businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-brand-slate mb-6 font-heading">Our Story</h2>
            <div className="prose prose-lg text-slate-600">
              <p>
                BildOut was born from a simple observation: getting paid shouldn't be harder than doing the work.
              </p>
              <p>
                We saw contractors, builders, and small business owners spending hours on invoicing, chasing payments,
                and dealing with complicated billing software. We knew there had to be a better way.
              </p>
              <p>
                So we built BildOut - simple, straightforward invoicing that helps you get paid faster.
                No complicated features you'll never use. No confusing pricing. Just the tools you need to
                bill your clients and accept payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-brand-off-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-brand-slate mb-6 font-heading">Our Mission</h2>
            <div className="prose prose-lg text-slate-600">
              <p>
                To make professional invoicing accessible to every contractor and small business owner,
                so you can focus on what you do best - your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-brand-slate mb-8 font-heading">What We Believe</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-brand-slate mb-2">Simple is better</h3>
                <p className="text-slate-600">
                  We focus on the features that matter and leave out the bloat.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-slate mb-2">Fair pricing</h3>
                <p className="text-slate-600">
                  No hidden fees, no surprises. Just straightforward pricing that scales with you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-slate mb-2">You first</h3>
                <p className="text-slate-600">
                  We build BildOut based on what our users actually need, not what looks good in a demo.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-slate mb-2">Fast payment</h3>
                <p className="text-slate-600">
                  Your time is valuable. Our tools help you get paid quickly so you can keep working.
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
            <h2 className="text-3xl font-bold mb-4 font-heading">Ready to get started?</h2>
            <p className="text-lg mb-8">
              Join contractors and small businesses who are getting paid faster with BildOut.
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
