import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BrandingForm } from '@/components/settings/branding-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Crown } from 'lucide-react'
import Link from 'next/link'

export default async function BrandingSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's organization with branding settings
  const { data: profile } = await supabase
    .from('users')
    .select('org_id, organizations!inner(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const organization = profile.organizations as any
  const subscriptionPlan = organization?.subscription_plan || 'free'
  const isFreePlan = subscriptionPlan === 'free'

  // Get the highest invoice number to determine next number
  const { data: lastInvoice } = await supabase
    .from('invoices')
    .select('number')
    .eq('org_id', profile.org_id)
    .order('number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextInvoiceNumber = lastInvoice ? parseInt(lastInvoice.number) + 1 : 1

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
              <Link href="/dashboard/settings">Back to Settings</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Branding Settings</h1>
          <p className="text-slate-600 mt-2">
            Customize your logo, colors, and invoice branding
          </p>
        </div>

        {/* Free Plan Alert */}
        {isFreePlan && (
          <Alert className="mb-6 border-purple-200 bg-purple-50">
            <Crown className="h-5 w-5 text-purple-600" />
            <AlertTitle className="text-purple-900 font-semibold">
              Upgrade to Pro to Use Custom Branding
            </AlertTitle>
            <AlertDescription className="text-purple-800 mt-2">
              <p className="mb-3">
                You can save your branding settings here, but they won't appear on your invoices until you upgrade to Pro or Agency plan.
                Free plan invoices use default BildOut branding.
              </p>
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/settings/subscription">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro - $15/month
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <BrandingForm
          organization={organization}
          nextInvoiceNumber={nextInvoiceNumber}
          subscriptionPlan={subscriptionPlan}
        />
      </main>
    </div>
  )
}
