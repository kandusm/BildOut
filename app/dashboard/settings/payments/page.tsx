import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { StripeConnectButton } from '@/components/stripe-connect-button'

export default async function PaymentsSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's profile with Stripe status
  const { data: profile } = await supabase
    .from('users')
    .select('org_id, stripe_connect_id, stripe_onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const isConnected = !!profile.stripe_connect_id
  const isOnboardingComplete = profile.stripe_onboarding_complete

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
          <h1 className="text-3xl font-bold text-slate-900">Payment Settings</h1>
          <p className="text-slate-600 mt-2">
            Configure Stripe Connect to accept payments from your clients
          </p>
        </div>

        <div className="space-y-6">
          {/* Stripe Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Stripe Connect Status</CardTitle>
              <CardDescription>
                Connect your Stripe account to receive payments directly from clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to connect your Stripe account to accept payments.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-3">
                    <StripeConnectButton />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Or</span>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                      <Link href="/dashboard/settings/payments/link-account">
                        Link Existing Stripe Account
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Stripe Account Connected</p>
                      <p className="text-sm text-slate-600">
                        Your Stripe account is linked and ready to receive payments
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Onboarding Status</p>
                        <Badge
                          variant={isOnboardingComplete ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {isOnboardingComplete ? 'Complete' : 'Incomplete'}
                        </Badge>
                      </div>
                    </div>

                    {!isOnboardingComplete && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Complete your Stripe onboarding to start accepting payments.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <form action="/api/stripe/connect/dashboard" method="POST">
                      <Button type="submit" variant="outline" className="w-full sm:w-auto">
                        Open Stripe Dashboard
                      </Button>
                    </form>

                    {!isOnboardingComplete && (
                      <StripeConnectButton buttonText="Continue Onboarding" />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Payments Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Client receives invoice</p>
                    <p className="text-sm text-slate-600">
                      Send an invoice with a secure payment link to your client
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Client pays online</p>
                    <p className="text-sm text-slate-600">
                      Client pays using credit card, debit card, or other payment methods
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">You receive payment</p>
                    <p className="text-sm text-slate-600">
                      Funds are deposited directly to your Stripe account (minus 0.5% platform fee)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Invoice automatically updates</p>
                    <p className="text-sm text-slate-600">
                      Invoice status updates to paid automatically when payment succeeds
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fees Information */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-700">BildOut Platform Fee</span>
                  <span className="font-semibold">0.5%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-slate-700">Stripe Payment Processing</span>
                  <span className="font-semibold">2.9% + $0.30</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-slate-600">
                    Platform fees are deducted at the time of payment. Stripe fees are separate and
                    charged by Stripe according to their standard pricing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
