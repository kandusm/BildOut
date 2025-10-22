import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type TemplateData = {
  slug: string
  name: string
  icon: string
  title: string
  description: string
  longDescription: string
  industries: string[]
  commonLineItems: string[]
  benefits: string[]
  useCases: string[]
  relatedTemplates: string[]
}

const templates: Record<string, TemplateData> = {
  construction: {
    slug: 'construction',
    name: 'Construction Invoice',
    icon: '🏗️',
    title: 'Free Construction Invoice Template',
    description: 'Professional invoice template for general contractors, builders, and construction companies.',
    longDescription: 'Our construction invoice template is designed specifically for contractors and builders who need to bill for labor, materials, equipment, and subcontractors. Track multiple phases of a project, manage change orders, and get paid faster with online payments.',
    industries: ['General Contractors', 'Home Builders', 'Remodeling Companies', 'Commercial Construction'],
    commonLineItems: [
      'Labor (by trade or hourly)',
      'Materials and supplies',
      'Equipment rental',
      'Subcontractor fees',
      'Permits and fees',
      'Project management',
    ],
    benefits: [
      'Track labor hours by trade',
      'Separate materials from labor costs',
      'Add equipment rental charges',
      'Include change orders',
      'Accept payments online',
      'Send automatic payment reminders',
    ],
    useCases: [
      'Home renovation projects',
      'New construction builds',
      'Commercial construction',
      'Remodeling and additions',
      'Repair and maintenance work',
    ],
    relatedTemplates: ['roofing', 'electrical', 'plumbing'],
  },
  plumbing: {
    slug: 'plumbing',
    name: 'Plumbing Invoice',
    icon: '🔧',
    title: 'Free Plumbing Invoice Template',
    description: 'Invoice template designed for plumbers and plumbing contractors.',
    longDescription: 'Perfect for residential and commercial plumbers. Track service calls, emergency repairs, installations, and replacement parts. Bill hourly or flat-rate with detailed line items.',
    industries: ['Residential Plumbing', 'Commercial Plumbing', 'Emergency Plumbing Services', 'Drain Cleaning'],
    commonLineItems: [
      'Service call fee',
      'Labor (hourly or flat-rate)',
      'Pipes and fittings',
      'Fixtures (sinks, toilets, faucets)',
      'Water heater installation/repair',
      'Drain cleaning',
    ],
    benefits: [
      'Track service call fees separately',
      'Bill for emergency service rates',
      'Add parts and materials easily',
      'Schedule follow-up appointments',
      'Accept online payments',
      'Track warranty work',
    ],
    useCases: [
      'Emergency leak repairs',
      'Water heater installation',
      'Bathroom remodels',
      'Drain cleaning services',
      'Fixture replacements',
    ],
    relatedTemplates: ['hvac', 'electrical', 'construction'],
  },
  electrical: {
    slug: 'electrical',
    name: 'Electrical Invoice',
    icon: '⚡',
    title: 'Free Electrical Invoice Template',
    description: 'Professional invoice template for electricians and electrical contractors.',
    longDescription: 'Built for licensed electricians handling residential, commercial, and industrial projects. Document installations, repairs, and troubleshooting with detailed labor and materials breakdowns.',
    industries: ['Residential Electrical', 'Commercial Electrical', 'Industrial Electrical', 'Electrical Repairs'],
    commonLineItems: [
      'Service call/diagnostic fee',
      'Labor (by hour or project)',
      'Wire and conduit',
      'Outlets and switches',
      'Circuit breakers and panels',
      'Light fixtures and fans',
    ],
    benefits: [
      'Track permit fees',
      'Separate diagnostic from repair costs',
      'Document safety inspections',
      'Bill for emergency service',
      'Track warranty work',
      'Accept online payments',
    ],
    useCases: [
      'Panel upgrades',
      'New construction wiring',
      'Electrical troubleshooting',
      'Light fixture installation',
      'Outlet and switch replacement',
    ],
    relatedTemplates: ['construction', 'hvac', 'plumbing'],
  },
  landscaping: {
    slug: 'landscaping',
    name: 'Landscaping Invoice',
    icon: '🌳',
    title: 'Free Landscaping Invoice Template',
    description: 'Invoice template for landscapers, lawn care professionals, and tree services.',
    longDescription: 'Designed for landscape contractors managing maintenance contracts, design projects, and seasonal services. Track mowing, trimming, planting, irrigation, and hardscaping work.',
    industries: ['Lawn Care', 'Landscape Design', 'Tree Service', 'Irrigation', 'Hardscaping'],
    commonLineItems: [
      'Lawn mowing and edging',
      'Trimming and pruning',
      'Mulch and soil',
      'Plants, shrubs, and trees',
      'Irrigation system work',
      'Hardscaping materials',
    ],
    benefits: [
      'Create recurring service invoices',
      'Track seasonal contracts',
      'Bill for design consultations',
      'Add plant and material costs',
      'Schedule maintenance visits',
      'Accept online payments',
    ],
    useCases: [
      'Weekly lawn maintenance',
      'Landscape design and installation',
      'Tree trimming and removal',
      'Spring/fall cleanup',
      'Irrigation installation and repair',
    ],
    relatedTemplates: ['cleaning', 'construction', 'painting'],
  },
  hvac: {
    slug: 'hvac',
    name: 'HVAC Invoice',
    icon: '❄️',
    title: 'Free HVAC Invoice Template',
    description: 'Invoice template tailored for HVAC technicians and contractors.',
    longDescription: 'Perfect for heating and cooling professionals. Bill for installations, repairs, maintenance contracts, and seasonal tune-ups. Track refrigerant, parts, and labor separately.',
    industries: ['AC Repair', 'Heating Service', 'HVAC Installation', 'Maintenance Contracts'],
    commonLineItems: [
      'Service call fee',
      'Diagnostic/inspection',
      'Labor (installation or repair)',
      'HVAC units and equipment',
      'Refrigerant',
      'Filters and parts',
    ],
    benefits: [
      'Create maintenance contract invoices',
      'Track seasonal tune-ups',
      'Bill for emergency service',
      'Add refrigerant charges',
      'Schedule follow-up appointments',
      'Accept online payments',
    ],
    useCases: [
      'AC installation and replacement',
      'Furnace repair',
      'Seasonal maintenance',
      'Emergency breakdown service',
      'Ductwork installation',
    ],
    relatedTemplates: ['plumbing', 'electrical', 'construction'],
  },
  roofing: {
    slug: 'roofing',
    name: 'Roofing Invoice',
    icon: '🏠',
    title: 'Free Roofing Invoice Template',
    description: 'Professional invoice template for roofing contractors.',
    longDescription: 'Built for roofing professionals managing residential and commercial projects. Track materials, labor, tear-off, disposal, and multi-day installations.',
    industries: ['Residential Roofing', 'Commercial Roofing', 'Roof Repair', 'Roof Inspection'],
    commonLineItems: [
      'Shingles/roofing materials',
      'Underlayment and felt',
      'Labor (per square or day)',
      'Tear-off and disposal',
      'Flashing and vents',
      'Gutters and downspouts',
    ],
    benefits: [
      'Calculate by roofing square',
      'Track tear-off separately',
      'Add disposal fees',
      'Bill for inspection services',
      'Track multi-day projects',
      'Accept online payments',
    ],
    useCases: [
      'Full roof replacement',
      'Roof repair and patching',
      'Storm damage repair',
      'Gutter installation',
      'Roof inspections',
    ],
    relatedTemplates: ['construction', 'carpentry', 'painting'],
  },
  painting: {
    slug: 'painting',
    name: 'Painting Invoice',
    icon: '🎨',
    title: 'Free Painting Invoice Template',
    description: 'Invoice template for painters and decorators.',
    longDescription: 'Designed for painting contractors handling interior, exterior, and commercial projects. Track labor, paint, supplies, and square footage easily.',
    industries: ['Interior Painting', 'Exterior Painting', 'Commercial Painting', 'Cabinet Painting'],
    commonLineItems: [
      'Labor (by hour or square foot)',
      'Paint and primer',
      'Brushes, rollers, and supplies',
      'Surface preparation',
      'Tape, drop cloths, and protection',
      'Touch-ups and final coat',
    ],
    benefits: [
      'Calculate by square footage',
      'Track interior vs exterior work',
      'Add color consultation fees',
      'Bill for prep work separately',
      'Track multi-room projects',
      'Accept online payments',
    ],
    useCases: [
      'Interior room painting',
      'Exterior house painting',
      'Cabinet refinishing',
      'Commercial office painting',
      'Deck staining',
    ],
    relatedTemplates: ['carpentry', 'construction', 'roofing'],
  },
  carpentry: {
    slug: 'carpentry',
    name: 'Carpentry Invoice',
    icon: '🪚',
    title: 'Free Carpentry Invoice Template',
    description: 'Invoice template for carpenters and woodworkers.',
    longDescription: 'Perfect for finish carpenters, cabinetmakers, and custom woodworkers. Track custom projects, materials, detailed labor hours, and project milestones.',
    industries: ['Custom Carpentry', 'Finish Carpentry', 'Cabinet Making', 'Furniture Building'],
    commonLineItems: [
      'Custom labor (by project or hour)',
      'Lumber and wood materials',
      'Hardware and fasteners',
      'Stain and finish',
      'Design and planning',
      'Installation',
    ],
    benefits: [
      'Track custom project phases',
      'Bill for design consultations',
      'Add material costs with markup',
      'Document installation fees',
      'Create milestone invoices',
      'Accept online payments',
    ],
    useCases: [
      'Custom cabinetry',
      'Built-in shelving',
      'Deck construction',
      'Furniture building',
      'Trim and molding installation',
    ],
    relatedTemplates: ['construction', 'painting', 'roofing'],
  },
  cleaning: {
    slug: 'cleaning',
    name: 'Cleaning Service Invoice',
    icon: '🧹',
    title: 'Free Cleaning Service Invoice Template',
    description: 'Invoice template for cleaning and janitorial services.',
    longDescription: 'Built for house cleaners, commercial cleaning companies, and janitorial services. Manage recurring clients, one-time deep cleans, and specialty cleaning services.',
    industries: ['House Cleaning', 'Commercial Cleaning', 'Deep Cleaning', 'Move-Out Cleaning'],
    commonLineItems: [
      'Standard cleaning service',
      'Deep cleaning',
      'Kitchen and bathrooms',
      'Floor cleaning',
      'Window cleaning',
      'Supplies and materials',
    ],
    benefits: [
      'Create recurring invoices',
      'Bill monthly/weekly clients',
      'Track one-time vs recurring',
      'Add specialty service fees',
      'Schedule next appointment',
      'Accept online payments',
    ],
    useCases: [
      'Weekly house cleaning',
      'Move-out cleaning',
      'Office cleaning contracts',
      'Deep cleaning services',
      'Post-construction cleanup',
    ],
    relatedTemplates: ['landscaping', 'consulting', 'construction'],
  },
  consulting: {
    slug: 'consulting',
    name: 'Consulting Invoice',
    icon: '💼',
    title: 'Free Consulting Invoice Template',
    description: 'Professional invoice template for consultants and service professionals.',
    longDescription: 'Ideal for business consultants, IT professionals, and advisory services. Track hourly billing, project milestones, retainers, and expenses.',
    industries: ['Business Consulting', 'IT Consulting', 'Financial Consulting', 'Marketing Consulting'],
    commonLineItems: [
      'Hourly consulting fees',
      'Project-based fees',
      'Retainer services',
      'Research and analysis',
      'Meeting and presentations',
      'Reimbursable expenses',
    ],
    benefits: [
      'Track hours by project',
      'Bill for retainer services',
      'Add expense reimbursements',
      'Create milestone invoices',
      'Track multiple projects',
      'Accept online payments',
    ],
    useCases: [
      'Hourly consulting work',
      'Project-based engagements',
      'Retainer agreements',
      'Advisory services',
      'Strategic planning sessions',
    ],
    relatedTemplates: ['cleaning', 'landscaping', 'construction'],
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const template = templates[slug]

  if (!template) {
    return {
      title: 'Template Not Found | BildOut',
    }
  }

  return {
    title: `${template.title} | BildOut`,
    description: template.description,
    openGraph: {
      title: `${template.title} | BildOut`,
      description: template.description,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(templates).map((slug) => ({
    slug,
  }))
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params
  const template = templates[slug]

  if (!template) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-6xl mb-6">{template.icon}</div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              {template.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {template.longDescription}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/signup">Use This Template Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-sm font-semibold text-slate-600 text-center mb-4">PERFECT FOR</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {template.industries.map((industry) => (
                <span
                  key={industry}
                  className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Line Items */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate text-center mb-12">
              Common line items included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {template.commonLineItems.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-lg p-4 border">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate text-center mb-12">
              Why use this template?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {template.benefits.map((benefit) => (
                <div key={benefit} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-brand-slate text-center mb-12">
              Perfect for these projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {template.useCases.map((useCase) => (
                <div key={useCase} className="bg-white rounded-lg p-6 border text-center">
                  <p className="font-medium text-brand-slate">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Templates */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-brand-slate text-center mb-8">
              Related templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {template.relatedTemplates.map((relatedSlug) => {
                const related = templates[relatedSlug]
                return (
                  <Link
                    key={relatedSlug}
                    href={`/templates/${relatedSlug}`}
                    className="bg-slate-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow border"
                  >
                    <div className="text-4xl mb-2">{related.icon}</div>
                    <p className="font-medium text-brand-slate">{related.name}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-brand-orange">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start using this template today
            </h2>
            <p className="mt-4 text-lg text-orange-100">
              Sign up free and customize this template to match your business.
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
