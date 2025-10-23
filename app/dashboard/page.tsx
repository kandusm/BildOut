import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StripeConnectCard } from '@/components/stripe-connect-card'
import { Suspense } from 'react'
import Link from 'next/link'
import { DollarSign, FileText, Users, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'
import { getEffectiveSubscriptionPlan } from '@/lib/subscription/get-effective-plan'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's organization and profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*, organizations!users_org_id_fkey(*)')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Profile fetch error:', profileError)
    throw new Error(`Failed to load profile: ${profileError.message}`)
  }

  if (!profile) {
    redirect('/login')
  }

  const organization = profile.organizations as any

  if (!organization) {
    throw new Error('No organization found for user')
  }

  const currentPlan = getEffectiveSubscriptionPlan(organization)
  const hasAnalytics = currentPlan === 'pro' || currentPlan === 'agency'

  const orgId = profile.org_id

  // Fetch analytics data
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('org_id', orgId)

  const { data: clients } = await supabase
    .from('clients')
    .select('id')
    .eq('org_id', orgId)

  // Calculate metrics
  const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0) || 0
  const totalInvoiced = invoices?.reduce((sum, inv) => sum + inv.total, 0) || 0
  const totalOutstanding = totalInvoiced - totalRevenue

  const invoiceCount = invoices?.length || 0
  const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0
  const unpaidInvoices = invoices?.filter(inv => inv.status === 'sent' || inv.status === 'viewed').length || 0
  const overdueInvoices = invoices?.filter(inv => {
    if (!inv.due_date || inv.status === 'paid') return false
    return new Date(inv.due_date) < new Date()
  }).length || 0

  const clientCount = clients?.length || 0
  const paymentCount = payments?.length || 0
  const avgInvoiceValue = invoiceCount > 0 ? totalInvoiced / invoiceCount : 0
  const paymentSuccessRate = invoiceCount > 0 ? (paidInvoices / invoiceCount) * 100 : 0

  const recentInvoices = invoices?.slice(0, 5) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
      case 'viewed':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-slate-100 text-slate-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'void':
        return 'bg-slate-100 text-slate-500'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
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
            <div className="flex items-center gap-4">
              {profile?.is_admin && (
                <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Admin Dashboard
                </Link>
              )}
              <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">
                Support
              </Link>
              <span className="text-sm text-slate-600">
                {profile?.display_name || user.email}
              </span>
              <form action={handleSignOut}>
                <Button variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome back, {profile?.display_name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-slate-600 mt-2">
            {profile?.organizations?.name || 'Your Business'}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-slate-600 mt-1">
                {formatCurrency(totalOutstanding)} outstanding
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</div>
              <p className="text-xs text-slate-600 mt-1">
                {invoiceCount} invoice{invoiceCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Invoice Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-brand-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgInvoiceValue)}</div>
              <p className="text-xs text-slate-600 mt-1">
                {paymentSuccessRate.toFixed(0)}% payment rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount}</div>
              <p className="text-xs text-slate-600 mt-1">
                {paymentCount} payment{paymentCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Status Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
              <p className="text-xs text-slate-600 mt-1">
                {invoiceCount > 0 ? ((paidInvoices / invoiceCount) * 100).toFixed(0) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unpaidInvoices}</div>
              <p className="text-xs text-slate-600 mt-1">
                {invoiceCount > 0 ? ((unpaidInvoices / invoiceCount) * 100).toFixed(0) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
              <p className="text-xs text-slate-600 mt-1">
                {invoiceCount > 0 ? ((overdueInvoices / invoiceCount) * 100).toFixed(0) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        {recentInvoices.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Your latest invoices and their status</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/invoices">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="font-medium text-slate-900 hover:text-brand-orange transition-colors"
                        >
                          {invoice.number}
                        </Link>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {formatDate(invoice.issue_date)}
                        {invoice.due_date && ` • Due ${formatDate(invoice.due_date)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{formatCurrency(invoice.total)}</div>
                      {invoice.amount_paid > 0 && invoice.amount_paid < invoice.total && (
                        <p className="text-xs text-slate-600 mt-1">
                          {formatCurrency(invoice.amount_paid)} paid
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {profile?.is_admin && (
            <Card className="flex flex-col bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Admin</CardTitle>
                <CardDescription className="text-blue-700">Platform management</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Create and manage invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 mt-auto">
              <Button asChild className="w-full">
                <Link href="/dashboard/invoices/new">Create Invoice</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/invoices">View All Invoices</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Manage your client list</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/clients">View Clients</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>Manage reusable line items</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/items">View Items</Link>
              </Button>
            </CardContent>
          </Card>

          {hasAnalytics ? (
            <Card className="flex flex-col bg-purple-50 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-purple-900">Analytics</CardTitle>
                </div>
                <CardDescription className="text-purple-700">Detailed reports & insights</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/dashboard/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col bg-slate-50 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-slate-400" />
                  <CardTitle className="text-slate-700">Analytics</CardTitle>
                </div>
                <CardDescription className="text-slate-500">Upgrade to Pro for detailed insights</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/dashboard/settings/subscription">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>View payment history</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/payments">Payment History</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your account</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/settings">Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={
          <Card className="mt-12 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Set up Stripe Connect</CardTitle>
              <CardDescription className="text-amber-700">
                Loading Stripe status...
              </CardDescription>
            </CardHeader>
          </Card>
        }>
          <StripeConnectCard />
        </Suspense>
      </main>
    </div>
  )
}
