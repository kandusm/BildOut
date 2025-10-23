import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Download, Calendar, TrendingUp, DollarSign, Users, FileText } from 'lucide-react'
import { AnalyticsCharts } from '@/components/analytics-charts'
import { AnalyticsFilters } from '@/components/analytics-filters'
import { getEffectiveSubscriptionPlan } from '@/lib/subscription/get-effective-plan'

interface SearchParams {
  from?: string
  to?: string
  status?: string
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const organization = profile.organizations as any
  const currentPlan = getEffectiveSubscriptionPlan(organization)

  // Analytics is only available for Pro and Agency plans
  if (currentPlan === 'free') {
    redirect('/dashboard/settings/subscription?upgrade=analytics')
  }

  const orgId = profile.org_id

  // Parse date filters
  const fromDate = params.from || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  const toDate = params.to || new Date().toISOString().split('T')[0]
  const statusFilter = params.status

  // Build query with filters
  let invoiceQuery = supabase
    .from('invoices')
    .select('*, clients(name)')
    .eq('org_id', orgId)
    .gte('issue_date', fromDate)
    .lte('issue_date', toDate)
    .order('issue_date', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    invoiceQuery = invoiceQuery.eq('status', statusFilter)
  }

  const { data: invoices } = await invoiceQuery

  const { data: payments } = await supabase
    .from('payments')
    .select('*, invoices(number, clients(name))')
    .eq('org_id', orgId)
    .gte('created_at', fromDate)
    .lte('created_at', toDate)
    .order('created_at', { ascending: false })

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('org_id', orgId)

  // Calculate metrics
  const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0) || 0
  const totalInvoiced = invoices?.reduce((sum, inv) => sum + inv.total, 0) || 0
  const totalOutstanding = totalInvoiced - totalRevenue

  const invoiceCount = invoices?.length || 0
  const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0
  const unpaidInvoices = invoices?.filter(inv => inv.status === 'sent' || inv.status === 'viewed').length || 0
  const draftInvoices = invoices?.filter(inv => inv.status === 'draft').length || 0
  const voidInvoices = invoices?.filter(inv => inv.status === 'void').length || 0

  const paymentCount = payments?.length || 0
  const avgInvoiceValue = invoiceCount > 0 ? totalInvoiced / invoiceCount : 0
  const avgPaymentValue = paymentCount > 0 ? totalRevenue / paymentCount : 0
  const paymentSuccessRate = invoiceCount > 0 ? (paidInvoices / invoiceCount) * 100 : 0

  // Top clients by revenue
  const clientRevenue = invoices?.reduce((acc, inv) => {
    if (inv.clients && inv.amount_paid > 0) {
      const clientName = inv.clients.name
      acc[clientName] = (acc[clientName] || 0) + inv.amount_paid
    }
    return acc
  }, {} as Record<string, number>) || {}

  const topClients = Object.entries(clientRevenue)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)

  // Group invoices by status
  const invoicesByStatus = {
    paid: paidInvoices,
    unpaid: unpaidInvoices,
    draft: draftInvoices,
    void: voidInvoices,
  }

  // Group revenue by month
  const revenueByMonth = invoices?.reduce((acc, inv) => {
    if (inv.amount_paid > 0) {
      const month = new Date(inv.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + inv.amount_paid
    }
    return acc
  }, {} as Record<string, number>) || {}

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
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Analytics & Reports</h2>
          <p className="text-slate-600 mt-2">
            Detailed insights into your business performance
          </p>
        </div>

        {/* Filters */}
        <AnalyticsFilters
          fromDate={fromDate}
          toDate={toDate}
          currentStatus={statusFilter}
        />

        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <form action="/api/analytics/export" method="GET">
            <input type="hidden" name="from" value={fromDate} />
            <input type="hidden" name="to" value={toDate} />
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <Button type="submit" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          </form>
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
              <CardTitle className="text-sm font-medium">Avg Invoice Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-brand-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgInvoiceValue)}</div>
              <p className="text-xs text-slate-600 mt-1">
                {formatCurrency(avgPaymentValue)} avg payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentSuccessRate.toFixed(1)}%</div>
              <p className="text-xs text-slate-600 mt-1">
                {paidInvoices} of {invoiceCount} invoices paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentCount}</div>
              <p className="text-xs text-slate-600 mt-1">
                {invoiceCount} invoices created
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <AnalyticsCharts
          invoicesByStatus={invoicesByStatus}
          revenueByMonth={revenueByMonth}
        />

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clients by Revenue</CardTitle>
              <CardDescription>Your highest-paying clients in this period</CardDescription>
            </CardHeader>
            <CardContent>
              {topClients.length > 0 ? (
                <div className="space-y-4">
                  {topClients.map(([name, revenue], index) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-900">{name}</span>
                      </div>
                      <span className="font-semibold text-emerald-600">{formatCurrency(revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No client data available for this period</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payments received</CardDescription>
            </CardHeader>
            <CardContent>
              {payments && payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {payment.invoices?.number || 'Unknown Invoice'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      <span className="font-semibold text-emerald-600">{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No payments in this period</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>All Invoices ({invoiceCount})</CardTitle>
            <CardDescription>Invoices in the selected date range</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices && invoices.length > 0 ? (
              <div className="space-y-2">
                {invoices.slice(0, 20).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="font-medium text-slate-900 hover:text-brand-orange transition-colors"
                        >
                          {invoice.number}
                        </Link>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' || invoice.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'draft' ? 'bg-slate-100 text-slate-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {invoice.clients?.name || 'No client'} • {formatDate(invoice.issue_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{formatCurrency(invoice.total)}</div>
                      {invoice.amount_paid > 0 && (
                        <p className="text-xs text-emerald-600">
                          {formatCurrency(invoice.amount_paid)} paid
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {invoices.length > 20 && (
                  <p className="text-sm text-slate-600 text-center pt-4">
                    Showing 20 of {invoices.length} invoices
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600">No invoices found for the selected filters</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
