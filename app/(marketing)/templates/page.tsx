import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoice Templates - Free Templates for Every Industry | BildOut',
  description: 'Professional invoice templates for construction, plumbing, electrical, landscaping, HVAC, and more. Free customizable templates designed for contractors and small businesses.',
  alternates: {
    canonical: 'https://www.bildout.com/templates',
  },
  openGraph: {
    title: 'Invoice Templates - Free Templates for Every Industry | BildOut',
    description: 'Professional invoice templates for construction, plumbing, electrical, landscaping, HVAC, and more.',
    type: 'website',
    url: 'https://bildout.com/templates',
  },
}

const templates = [
  {
    slug: 'construction',
    name: 'Construction Invoice',
    icon: '🏗️',
    description: 'Perfect for general contractors, builders, and construction companies. Includes labor, materials, and equipment line items.',
    industries: ['General Contractors', 'Home Builders', 'Remodeling'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing Invoice',
    icon: '🔧',
    description: 'Designed for plumbers and plumbing contractors. Track service calls, parts, and labor with ease.',
    industries: ['Residential Plumbing', 'Commercial Plumbing', 'Emergency Services'],
  },
  {
    slug: 'electrical',
    name: 'Electrical Invoice',
    icon: '⚡',
    description: 'Built for electricians. Document installations, repairs, and electrical work with detailed line items.',
    industries: ['Residential Electrical', 'Commercial Electrical', 'Industrial'],
  },
  {
    slug: 'landscaping',
    name: 'Landscaping Invoice',
    icon: '🌳',
    description: 'For landscapers and lawn care professionals. Track mowing, trimming, planting, and maintenance services.',
    industries: ['Lawn Care', 'Landscape Design', 'Tree Service'],
  },
  {
    slug: 'hvac',
    name: 'HVAC Invoice',
    icon: '❄️',
    description: 'Tailored for HVAC technicians. Document installations, repairs, and maintenance contracts.',
    industries: ['AC Repair', 'Heating Service', 'Maintenance Contracts'],
  },
  {
    slug: 'roofing',
    name: 'Roofing Invoice',
    icon: '🏠',
    description: 'For roofing contractors. Track materials, labor, and multi-day projects with detailed breakdowns.',
    industries: ['Residential Roofing', 'Commercial Roofing', 'Roof Repair'],
  },
  {
    slug: 'painting',
    name: 'Painting Invoice',
    icon: '🎨',
    description: 'Created for painters and decorators. Document interior/exterior work, materials, and square footage.',
    industries: ['Interior Painting', 'Exterior Painting', 'Commercial Painting'],
  },
  {
    slug: 'carpentry',
    name: 'Carpentry Invoice',
    icon: '🪚',
    description: 'Perfect for carpenters and woodworkers. Track custom projects, materials, and detailed labor hours.',
    industries: ['Custom Carpentry', 'Finish Carpentry', 'Cabinet Making'],
  },
  {
    slug: 'cleaning',
    name: 'Cleaning Service Invoice',
    icon: '🧹',
    description: 'For cleaning and janitorial services. Bill recurring clients and one-time deep cleaning jobs.',
    industries: ['House Cleaning', 'Commercial Cleaning', 'Deep Cleaning'],
  },
  {
    slug: 'consulting',
    name: 'Consulting Invoice',
    icon: '💼',
    description: 'Ideal for consultants and professional services. Track hourly billing, project milestones, and retainers.',
    industries: ['Business Consulting', 'IT Consulting', 'Financial Consulting'],
  },
]

export default function TemplatesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              Professional Invoice Templates
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Free, customizable invoice templates for every industry. Add your logo, adjust line items, and send professional invoices in minutes.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/signup">Start Using Templates Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.slug}
                href={`/templates/${template.slug}`}
                className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-8"
              >
                <div className="text-5xl mb-4">{template.icon}</div>
                <h3 className="text-xl font-semibold text-brand-slate group-hover:text-brand-orange transition-colors">
                  {template.name}
                </h3>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  {template.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.industries.map((industry) => (
                    <span
                      key={industry}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
                <div className="mt-6 text-sm font-medium text-brand-orange flex items-center gap-1">
                  View template
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl">
              What's included in every template
            </h2>
          </div>

          <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate">Professional branding</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Add your company logo, colors, and contact information
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate">Flexible line items</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Add unlimited services, products, labor, and materials
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate">Automatic calculations</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Tax, discounts, and totals calculated automatically
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate">Online payments</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Accept credit cards, debit cards, and ACH bank transfers
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate">PDF download</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Generate and download professional PDF invoices
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-brand-slate">Automated reminders</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Send automatic payment reminders for overdue invoices
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
              Start using these templates today
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Sign up free and customize any template to match your business.
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
