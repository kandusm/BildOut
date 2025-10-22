import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Settings, Palette, CreditCard, Package, Crown } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('users')
    .select('org_id, display_name')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const settingsPages = [
    {
      title: 'General',
      description: 'Manage your account and organization settings',
      href: '/dashboard/settings/general',
      icon: Settings,
    },
    {
      title: 'Subscription',
      description: 'Manage your plan and billing',
      href: '/dashboard/settings/subscription',
      icon: Crown,
      highlight: true,
    },
    {
      title: 'Branding',
      description: 'Customize your logo, colors, and invoice branding',
      href: '/dashboard/settings/branding',
      icon: Palette,
    },
    {
      title: 'Payments',
      description: 'Configure Stripe Connect and payment settings',
      href: '/dashboard/settings/payments',
      icon: CreditCard,
    },
    {
      title: 'Items',
      description: 'Manage reusable line items for invoices',
      href: '/dashboard/items',
      icon: Package,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="BildOut" className="w-10 h-10" />
              <span className="text-xl font-semibold text-brand-slate font-heading">BildOut</span>
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">
            Manage your account, branding, and payment settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {settingsPages.map((page) => {
            const Icon = page.icon
            return (
              <Link key={page.href} href={page.href}>
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer h-full ${
                  page.highlight ? 'border-purple-200 bg-purple-50' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        page.highlight ? 'bg-purple-100' : 'bg-brand-orange/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          page.highlight ? 'text-purple-600' : 'text-brand-orange'
                        }`} />
                      </div>
                      <CardTitle className={page.highlight ? 'text-purple-900' : ''}>
                        {page.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="mt-3">
                      {page.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
