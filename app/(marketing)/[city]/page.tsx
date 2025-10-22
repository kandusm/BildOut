import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type CityData = {
  city: string
  state: string
  stateCode: string
  population: string
  industries: string[]
  localBenefit: string
  localDescription: string
}

const cities: Record<string, CityData> = {
  'austin': {
    city: 'Austin',
    state: 'Texas',
    stateCode: 'TX',
    population: '1M+',
    industries: ['Construction', 'Home Remodeling', 'HVAC', 'Landscaping', 'Electrical'],
    localBenefit: 'Austin\'s booming construction industry needs fast, reliable invoicing.',
    localDescription: 'Serving contractors in Austin, Round Rock, Cedar Park, Georgetown, and the Greater Austin area.',
  },
  'houston': {
    city: 'Houston',
    state: 'Texas',
    stateCode: 'TX',
    population: '2.3M+',
    industries: ['Commercial Construction', 'Plumbing', 'Electrical', 'HVAC', 'Roofing'],
    localBenefit: 'Houston contractors need invoicing that keeps up with the city\'s rapid growth.',
    localDescription: 'Trusted by contractors in Houston, Sugar Land, The Woodlands, Katy, and across Greater Houston.',
  },
  'dallas': {
    city: 'Dallas',
    state: 'Texas',
    stateCode: 'TX',
    population: '1.3M+',
    industries: ['General Contractors', 'Landscaping', 'Plumbing', 'Painting', 'Carpentry'],
    localBenefit: 'Dallas-Fort Worth contractors trust BildOut for professional invoicing.',
    localDescription: 'Serving the Dallas-Fort Worth metroplex including Plano, Frisco, McKinney, and Arlington.',
  },
  'phoenix': {
    city: 'Phoenix',
    state: 'Arizona',
    stateCode: 'AZ',
    population: '1.7M+',
    industries: ['HVAC', 'Landscaping', 'Pool Service', 'Roofing', 'Solar Installation'],
    localBenefit: 'Phoenix\'s desert climate demands specialized trades—and specialized invoicing.',
    localDescription: 'Supporting contractors throughout the Valley: Scottsdale, Mesa, Tempe, Chandler, and Glendale.',
  },
  'denver': {
    city: 'Denver',
    state: 'Colorado',
    stateCode: 'CO',
    population: '715K+',
    industries: ['Construction', 'Snow Removal', 'Landscaping', 'Roofing', 'Remodeling'],
    localBenefit: 'Colorado contractors need invoicing that works year-round, even in winter.',
    localDescription: 'Serving the Denver metro area including Aurora, Lakewood, Boulder, and Colorado Springs.',
  },
  'atlanta': {
    city: 'Atlanta',
    state: 'Georgia',
    stateCode: 'GA',
    population: '500K+',
    industries: ['Commercial Construction', 'HVAC', 'Electrical', 'Plumbing', 'Landscaping'],
    localBenefit: 'Atlanta\'s growing metro needs contractors who bill professionally.',
    localDescription: 'Trusted in Atlanta, Sandy Springs, Marietta, Roswell, and throughout Metro Atlanta.',
  },
}

type Props = {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityData = cities[city]

  if (!cityData) {
    return {
      title: 'City Not Found | BildOut',
    }
  }

  return {
    title: `Invoicing Software for ${cityData.city} Contractors | BildOut`,
    description: `Professional invoicing and payment processing for contractors in ${cityData.city}, ${cityData.stateCode}. Create invoices, accept payments, and get paid faster.`,
    openGraph: {
      title: `Invoicing Software for ${cityData.city} Contractors | BildOut`,
      description: `Professional invoicing for ${cityData.city} contractors. Get paid faster with online payments and automated reminders.`,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(cities).map((city) => ({
    city,
  }))
}

export default async function CityPage({ params }: Props) {
  const { city } = await params
  const cityData = cities[city]

  if (!cityData) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border mb-6">
              <svg className="h-5 w-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-brand-slate">Serving {cityData.city}, {cityData.stateCode}</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              Invoicing Software for {cityData.city} Contractors
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {cityData.localBenefit} BildOut helps {cityData.city} contractors create professional invoices, accept online payments, and get paid faster.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/templates">View Templates</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-slate-700">
              {cityData.localDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Popular Industries */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-brand-slate text-center mb-8">
              Popular trades in {cityData.city}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cityData.industries.map((industry) => (
                <div
                  key={industry}
                  className="bg-white rounded-lg p-4 text-center border shadow-sm"
                >
                  <p className="font-medium text-brand-slate">{industry}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              Built for {cityData.city} contractors
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to bill clients and get paid faster
            </p>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-slate-50 rounded-xl p-6 border">
              <div className="rounded-lg bg-orange-100 p-3 text-brand-orange w-fit mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-slate mb-2">Professional invoices</h3>
              <p className="text-slate-600">
                Industry-specific templates with your logo and branding. Send invoices in minutes.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border">
              <div className="rounded-lg bg-green-100 p-3 text-brand-mint w-fit mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-slate mb-2">Accept payments online</h3>
              <p className="text-slate-600">
                Credit cards, debit cards, and ACH transfers. Get paid directly through your invoice.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600 w-fit mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-slate mb-2">Get paid faster</h3>
              <p className="text-slate-600">
                Automated payment reminders and online payments mean you get paid in days, not weeks.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border">
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600 w-fit mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-slate mb-2">Track everything</h3>
              <p className="text-slate-600">
                Dashboard shows paid, pending, and overdue invoices at a glance. Stay organized.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border">
              <div className="rounded-lg bg-amber-100 p-3 text-amber-600 w-fit mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-slate mb-2">Save time</h3>
              <p className="text-slate-600">
                Reusable templates, saved client info, and automated emails save hours each week.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border">
              <div className="rounded-lg bg-slate-200 p-3 text-brand-slate w-fit mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-slate mb-2">Secure & reliable</h3>
              <p className="text-slate-600">
                Bank-level security with Stripe. Your data and payments are always protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Testimonial */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl bg-white rounded-xl p-8 shadow-sm border">
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              "Switched to BildOut from QuickBooks and haven't looked back. So much simpler for my {cityData.industries[0].toLowerCase()} business. My clients love the easy payment links."
            </p>
            <p className="font-semibold text-brand-slate">— {cityData.city} Contractor</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              No complex setup. Start billing today.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-slate mb-2">Sign up free</h3>
                  <p className="text-slate-600">
                    Create your account in 30 seconds. No credit card required.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-slate mb-2">Create your first invoice</h3>
                  <p className="text-slate-600">
                    Choose a template, add your client and line items, and send. Takes less than 5 minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brand-slate mb-2">Get paid</h3>
                  <p className="text-slate-600">
                    Your client pays online with their card or bank account. Funds in your account in 1-2 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/signup">Start Billing {cityData.city} Clients Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-brand-orange">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join {cityData.city} contractors using BildOut
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Free forever plan. No credit card required. Start in minutes.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="secondary" className="text-base px-8">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-orange-100">
              Trusted by contractors in {cityData.city} and across {cityData.state}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
