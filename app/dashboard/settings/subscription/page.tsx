import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Check, X, Zap, Crown, Rocket } from 'lucide-react'
import { PLANS, SUBSCRIPTION_PLANS } from '@/lib/subscription-config'
import { getEffectiveSubscriptionPlan } from '@/lib/subscription/get-effective-plan'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*, organizations!users_org_id_fkey(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const organization = profile.organizations as any
  const currentPlan = getEffectiveSubscriptionPlan(organization)
  const stripePlan = organization?.subscription_plan || 'free'
  const subscriptionStatus = organization?.subscription_status || 'active'
  const periodEnd = organization?.subscription_current_period_end
  const hasOverride = organization?.subscription_override_plan !== null

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src="/logo.svg" alt="BildOut" className="w-10 h-10" />
              <h1 className="text-xl font-semibold text-brand-slate font-heading">BildOut</h1>
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/settings">Back to Settings</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Subscription & Billing</h2>
          <p className="text-slate-600 mt-2">
            Manage your subscription and billing preferences
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the {PLANS[currentPlan as keyof typeof PLANS].name} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-brand-orange">
                  {PLANS[currentPlan as keyof typeof PLANS].name}
                </p>
                <p className="text-slate-600 mt-1">
                  ${PLANS[currentPlan as keyof typeof PLANS].price}/month
                </p>
                {periodEnd && (
                  <p className="text-sm text-slate-500 mt-2">
                    {subscriptionStatus === 'active' ? 'Renews' : 'Ends'} on {formatDate(periodEnd)}
                  </p>
                )}
              </div>
              {currentPlan !== 'free' && organization?.stripe_customer_id && (
                <form action="/api/billing/portal" method="POST">
                  <input type="hidden" name="customer_id" value={organization.stripe_customer_id} />
                  <Button type="submit" variant="outline">
                    Manage Billing
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Available Plans</h3>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Free Plan */}
            <Card className={`flex flex-col ${currentPlan === 'free' ? 'border-brand-orange border-2' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-slate-600" />
                  <CardTitle>Free</CardTitle>
                </div>
                <CardDescription className="text-2xl font-bold mt-2">
                  $0<span className="text-sm font-normal text-slate-600">/month</span>
                </CardDescription>
                <p className="text-sm text-slate-600 mt-2">Perfect for getting started</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">10 invoices per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Up to 5 clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Basic invoicing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-500">Custom branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-500">Email reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-500">Analytics & reporting</span>
                  </li>
                </ul>
                {currentPlan === 'free' ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Downgrade
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className={`flex flex-col ${currentPlan === 'pro' ? 'border-brand-orange border-2' : 'border-purple-200 border-2'}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-purple-900">Pro</CardTitle>
                  <span className="ml-auto px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                    POPULAR
                  </span>
                </div>
                <CardDescription className="text-2xl font-bold mt-2">
                  $15<span className="text-sm font-normal text-slate-600">/month</span>
                </CardDescription>
                <p className="text-sm text-slate-600 mt-2">For growing businesses</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Unlimited invoices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Unlimited clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Custom branding & logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Automated email reminders <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Analytics & reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Data export (CSV)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Up to 3 team members <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></span>
                  </li>
                </ul>
                {currentPlan === 'pro' ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <form action="/api/billing/checkout" method="POST">
                    <input type="hidden" name="plan" value="pro" />
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Upgrade to Pro
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Agency Plan */}
            <Card className={`flex flex-col ${currentPlan === 'agency' ? 'border-brand-orange border-2' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-blue-900">Agency</CardTitle>
                </div>
                <CardDescription className="text-2xl font-bold mt-2">
                  $49<span className="text-sm font-normal text-slate-600">/month</span>
                </CardDescription>
                <p className="text-sm text-slate-600 mt-2">For agencies and teams</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited team members <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">API access <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced analytics <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">White-label options <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></span>
                  </li>
                </ul>
                {currentPlan === 'agency' ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <form action="/api/billing/checkout" method="POST">
                    <input type="hidden" name="plan" value="agency" />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Upgrade to Agency
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Can I change my plan at any time?</h4>
              <p className="text-sm text-slate-600">
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">What happens if I exceed the free plan limits?</h4>
              <p className="text-sm text-slate-600">
                You'll be prompted to upgrade to Pro to continue creating invoices and adding clients beyond the free tier limits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Do you offer refunds?</h4>
              <p className="text-sm text-slate-600">
                We offer a 14-day money-back guarantee on all paid plans. Contact support if you're not satisfied.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">How is billing handled?</h4>
              <p className="text-sm text-slate-600">
                All payments are processed securely through Stripe. You'll be billed monthly on the date you subscribe.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
