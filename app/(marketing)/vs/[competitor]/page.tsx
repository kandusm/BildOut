import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type ComparisonData = {
  competitor: string
  title: string
  description: string
  heroTagline: string
  pricing: {
    theirs: string
    ours: string
  }
  features: Array<{
    category: string
    items: Array<{
      feature: string
      theirs: boolean | string
      ours: boolean | string
    }>
  }>
  pros: string[]
  cons: string[]
  bestFor: string[]
}

const comparisons: Record<string, ComparisonData> = {
  'freshbooks': {
    competitor: 'FreshBooks',
    title: 'BildOut vs FreshBooks',
    description: 'Compare BildOut and FreshBooks for small business invoicing. See pricing, features, and which is best for contractors.',
    heroTagline: 'Simple invoicing built for contractors, not accountants',
    pricing: {
      theirs: '$19/month minimum (Lite plan)',
      ours: 'Free forever • $15/month Pro',
    },
    features: [
      {
        category: 'Invoicing',
        items: [
          { feature: 'Create & send invoices', theirs: true, ours: true },
          { feature: 'Online payments', theirs: true, ours: true },
          { feature: 'Recurring invoices', theirs: true, ours: 'Pro plan' },
          { feature: 'Late payment reminders', theirs: true, ours: true },
          { feature: 'Custom branding', theirs: 'Plus plan ($33/mo)', ours: 'Free' },
        ],
      },
      {
        category: 'Payments',
        items: [
          { feature: 'Credit/debit cards', theirs: true, ours: true },
          { feature: 'ACH bank transfers', theirs: true, ours: true },
          { feature: 'Apple Pay / Google Pay', theirs: false, ours: true },
          { feature: 'Payment processing fees', theirs: '2.9% + $0.30', ours: '2.9% + $0.30' },
        ],
      },
      {
        category: 'Features',
        items: [
          { feature: 'Time tracking', theirs: true, ours: false },
          { feature: 'Expense tracking', theirs: true, ours: false },
          { feature: 'Double-entry accounting', theirs: true, ours: false },
          { feature: 'Quick setup (< 5 min)', theirs: false, ours: true },
          { feature: 'Made for contractors', theirs: false, ours: true },
        ],
      },
    ],
    pros: [
      'Full accounting suite',
      'Time tracking included',
      'Expense management',
      'Established brand (20+ years)',
    ],
    cons: [
      'More expensive ($19-$60/month)',
      'Complex interface',
      'Overkill for simple invoicing',
      'Steeper learning curve',
    ],
    bestFor: [
      'Businesses needing full accounting',
      'Teams with dedicated bookkeepers',
      'Companies tracking time and expenses',
    ],
  },
  'quickbooks': {
    competitor: 'QuickBooks',
    title: 'BildOut vs QuickBooks',
    description: 'Compare BildOut and QuickBooks for contractor invoicing. See pricing, ease of use, and which is best for small contractors.',
    heroTagline: 'Get paid without the accounting degree',
    pricing: {
      theirs: '$35/month minimum (Simple Start)',
      ours: 'Free forever • $15/month Pro',
    },
    features: [
      {
        category: 'Invoicing',
        items: [
          { feature: 'Create & send invoices', theirs: true, ours: true },
          { feature: 'Online payments', theirs: true, ours: true },
          { feature: 'Recurring invoices', theirs: true, ours: 'Pro plan' },
          { feature: 'Payment reminders', theirs: true, ours: true },
          { feature: 'Easy setup', theirs: false, ours: true },
        ],
      },
      {
        category: 'Payments',
        items: [
          { feature: 'Credit/debit cards', theirs: true, ours: true },
          { feature: 'ACH bank transfers', theirs: true, ours: true },
          { feature: 'Payment processing fees', theirs: '2.9% + $0.25', ours: '2.9% + $0.30' },
        ],
      },
      {
        category: 'Features',
        items: [
          { feature: 'Full accounting suite', theirs: true, ours: false },
          { feature: 'Payroll processing', theirs: 'Add-on ($50/mo)', ours: false },
          { feature: 'Inventory tracking', theirs: true, ours: false },
          { feature: 'Simple interface', theirs: false, ours: true },
          { feature: 'No learning curve', theirs: false, ours: true },
        ],
      },
    ],
    pros: [
      'Industry-standard accounting software',
      'Comprehensive features',
      'Payroll integration',
      'Tax preparation tools',
    ],
    cons: [
      'Expensive ($35-$235/month)',
      'Very complex for simple invoicing',
      'Requires accounting knowledge',
      'Frequent price increases',
    ],
    bestFor: [
      'Established businesses with complex needs',
      'Companies with in-house accountants',
      'Businesses needing full accounting + payroll',
    ],
  },
  'wave': {
    competitor: 'Wave',
    title: 'BildOut vs Wave',
    description: 'Compare BildOut and Wave for free invoicing. See features, payment options, and which is better for contractors.',
    heroTagline: 'Free invoicing that doesn\'t feel free',
    pricing: {
      theirs: 'Free (2.9% + $0.60 per transaction)',
      ours: 'Free (2.9% + $0.30 per transaction)',
    },
    features: [
      {
        category: 'Invoicing',
        items: [
          { feature: 'Unlimited invoices', theirs: true, ours: true },
          { feature: 'Online payments', theirs: true, ours: true },
          { feature: 'Recurring invoices', theirs: 'Limited', ours: 'Pro plan' },
          { feature: 'Automated reminders', theirs: true, ours: true },
          { feature: 'Custom branding', theirs: 'Limited', ours: true },
        ],
      },
      {
        category: 'Payments',
        items: [
          { feature: 'Credit/debit cards', theirs: true, ours: true },
          { feature: 'ACH bank transfers', theirs: '1% ($1 min)', ours: '0.8%' },
          { feature: 'Apple Pay / Google Pay', theirs: false, ours: true },
          { feature: 'Card processing fees', theirs: '2.9% + $0.60', ours: '2.9% + $0.30' },
        ],
      },
      {
        category: 'Features',
        items: [
          { feature: 'Receipt scanning', theirs: true, ours: false },
          { feature: 'Accounting reports', theirs: true, ours: 'Basic' },
          { feature: 'Contractor-focused', theirs: false, ours: true },
          { feature: 'Modern interface', theirs: false, ours: true },
          { feature: 'Fast setup', theirs: false, ours: true },
        ],
      },
    ],
    pros: [
      'Completely free software',
      'Accounting features included',
      'Receipt scanning',
      'Good for very small businesses',
    ],
    cons: [
      'Higher payment processing fees ($0.60 vs $0.30)',
      'Dated interface',
      'Limited customer support',
      'Slower feature development',
    ],
    bestFor: [
      'Very small businesses',
      'Solo freelancers on tight budgets',
      'Businesses doing their own accounting',
    ],
  },
  'square': {
    competitor: 'Square',
    title: 'BildOut vs Square',
    description: 'Compare BildOut and Square Invoices for contractor billing. See which is better for construction, trades, and service businesses.',
    heroTagline: 'Built for contractors, not coffee shops',
    pricing: {
      theirs: 'Free (2.9% + $0.30 per transaction)',
      ours: 'Free (2.9% + $0.30 per transaction)',
    },
    features: [
      {
        category: 'Invoicing',
        items: [
          { feature: 'Create & send invoices', theirs: true, ours: true },
          { feature: 'Online payments', theirs: true, ours: true },
          { feature: 'Recurring invoices', theirs: true, ours: 'Pro plan' },
          { feature: 'Late payment reminders', theirs: true, ours: true },
          { feature: 'Custom invoice templates', theirs: 'Limited', ours: '10+ industry templates' },
        ],
      },
      {
        category: 'Payments',
        items: [
          { feature: 'Credit/debit cards', theirs: true, ours: true },
          { feature: 'ACH bank transfers', theirs: '1% ($1 min)', ours: '0.8%' },
          { feature: 'Cash App payments', theirs: true, ours: false },
          { feature: 'In-person payments', theirs: 'Card reader required', ours: false },
        ],
      },
      {
        category: 'Features',
        items: [
          { feature: 'POS system integration', theirs: true, ours: false },
          { feature: 'Inventory management', theirs: true, ours: false },
          { feature: 'Contractor templates', theirs: false, ours: true },
          { feature: 'Project-based invoicing', theirs: 'Limited', ours: true },
          { feature: 'Simple, focused interface', theirs: false, ours: true },
        ],
      },
    },
    pros: [
      'Free plan available',
      'POS integration for retail',
      'In-person payments',
      'Same-day deposits available',
    ],
    cons: [
      'Built for retail, not contractors',
      'Higher ACH fees (1% vs 0.8%)',
      'Generic invoice templates',
      'Cluttered with POS features',
    ],
    bestFor: [
      'Retail businesses',
      'Businesses needing POS + invoicing',
      'Companies doing in-person + online sales',
    ],
  },
}

type Props = {
  params: Promise<{ competitor: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params
  const comparison = comparisons[competitor]

  if (!comparison) {
    return {
      title: 'Comparison Not Found | BildOut',
    }
  }

  return {
    title: `${comparison.title} - Which is Better for Contractors? | BildOut`,
    description: comparison.description,
    openGraph: {
      title: `${comparison.title} | BildOut`,
      description: comparison.description,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(comparisons).map((competitor) => ({
    competitor,
  }))
}

export default async function ComparisonPage({ params }: Props) {
  const { competitor } = await params
  const comparison = comparisons[competitor]

  if (!comparison) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              {comparison.title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600">
              {comparison.heroTagline}
            </p>
            <p className="mt-4 text-lg text-slate-600">
              {comparison.description}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-brand-slate text-center mb-12">Pricing at a glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-8 border">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">{comparison.competitor}</h3>
                <p className="text-2xl font-bold text-slate-900">{comparison.pricing.theirs}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-8 border-2 border-brand-orange">
                <h3 className="text-lg font-semibold text-brand-orange mb-2">BildOut</h3>
                <p className="text-2xl font-bold text-brand-slate">{comparison.pricing.ours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-brand-slate text-center mb-12">Feature comparison</h2>

            {comparison.features.map((category) => (
              <div key={category.category} className="mb-12 last:mb-0">
                <h3 className="text-xl font-bold text-brand-slate mb-6">{category.category}</h3>
                <div className="bg-white rounded-xl border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="text-left py-4 px-6 font-semibold text-brand-slate">Feature</th>
                        <th className="text-center py-4 px-6 font-semibold text-slate-700">{comparison.competitor}</th>
                        <th className="text-center py-4 px-6 font-semibold text-brand-orange bg-orange-50">BildOut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-4 px-6 text-slate-700">{item.feature}</td>
                          <td className="py-4 px-6 text-center">
                            {typeof item.theirs === 'boolean' ? (
                              item.theirs ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-slate-400">−</span>
                              )
                            ) : (
                              <span className="text-sm text-slate-600">{item.theirs}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center bg-orange-50/30">
                            {typeof item.ours === 'boolean' ? (
                              item.ours ? (
                                <span className="text-green-600">✓</span>
                              ) : (
                                <span className="text-slate-400">−</span>
                              )
                            ) : (
                              <span className="text-sm text-slate-600">{item.ours}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros and Cons */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-brand-slate text-center mb-12">
              {comparison.competitor} pros & cons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                  <span className="text-xl">✓</span> Pros
                </h3>
                <ul className="space-y-3">
                  {comparison.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span className="text-slate-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <span className="text-xl">✗</span> Cons
                </h3>
                <ul className="space-y-3">
                  {comparison.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span className="text-slate-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-lg border">
              <h4 className="font-semibold text-brand-slate mb-3">
                {comparison.competitor} is best for:
              </h4>
              <ul className="space-y-2">
                {comparison.bestFor.map((use, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-brand-orange mt-0.5">→</span>
                    <span className="text-slate-700">{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why BildOut */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-brand-slate text-center mb-12">Why contractors choose BildOut</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-brand-slate mb-2">Built for contractors</h3>
                <p className="text-slate-600 text-sm">
                  Industry-specific templates for construction, plumbing, electrical, HVAC, and more.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-brand-slate mb-2">Simple pricing</h3>
                <p className="text-slate-600 text-sm">
                  Free forever plan. Pro features at $15/month. No hidden fees.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-brand-slate mb-2">Get set up in 5 minutes</h3>
                <p className="text-slate-600 text-sm">
                  No accounting knowledge required. Create your first invoice in minutes.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="font-semibold text-brand-slate mb-2">Lower payment fees</h3>
                <p className="text-slate-600 text-sm">
                  Same card rates, better ACH rates. Save money on every transaction.
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
              Try BildOut risk-free
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Start with our free plan. Upgrade only when you're ready. Cancel anytime.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="secondary" className="text-base px-8">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-orange-100">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
