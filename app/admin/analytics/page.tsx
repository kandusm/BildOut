import { requireAdmin } from '@/lib/admin/require-admin'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function AdminAnalyticsPage() {
  await requireAdmin()

  const supabase = await createClient()

  // Get date ranges
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Revenue Analytics
  const { data: paymentsThisMonth } = await supabase
    .from('payments')
    .select('amount, status, created_at')
    .eq('status', 'succeeded')
    .gte('created_at', startOfMonth.toISOString())

  const { data: paymentsLastMonth } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString())

  const { data: paymentsThisYear } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
    .gte('created_at', startOfYear.toISOString())

  const revenueThisMonth = paymentsThisMonth?.reduce((sum, p) => sum + parseFloat(p.amount as any), 0) || 0
  const revenueLastMonth = paymentsLastMonth?.reduce((sum, p) => sum + parseFloat(p.amount as any), 0) || 0
  const revenueThisYear = paymentsThisYear?.reduce((sum, p) => sum + parseFloat(p.amount as any), 0) || 0

  const revenueGrowth = revenueLastMonth > 0
    ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
    : 0

  // Invoice Analytics
  const { count: invoicesThisMonth } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  const { count: invoicesLastMonth } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString())

  const { count: paidInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid')

  const { count: overdueInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'overdue')

  const { count: pendingInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: totalInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })

  const invoiceGrowth = invoicesLastMonth && invoicesThisMonth
    ? Math.round(((invoicesThisMonth - invoicesLastMonth) / invoicesLastMonth) * 100)
    : 0

  // Merchant Growth
  const { count: merchantsThisMonth } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  const { count: merchantsLastMonth } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString())

  const { count: totalMerchants } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const merchantGrowth = merchantsLastMonth && merchantsThisMonth
    ? Math.round(((merchantsThisMonth - merchantsLastMonth) / merchantsLastMonth) * 100)
    : merchantsThisMonth || 0

  // Active Merchants (created invoice in last 30 days)
  const { data: activeMerchantIds } = await supabase
    .from('invoices')
    .select('org_id')
    .gte('created_at', thirtyDaysAgo.toISOString())

  const uniqueActiveMerchants = new Set(activeMerchantIds?.map(i => i.org_id)).size

  // Top Merchants by Revenue
  const { data: topMerchantRevenue } = await supabase
    .from('payments')
    .select('org_id, amount, organizations(name)')
    .eq('status', 'succeeded')
    .gte('created_at', startOfMonth.toISOString())

  const merchantRevenueMap = new Map<string, { name: string; total: number }>()
  topMerchantRevenue?.forEach((payment: any) => {
    const orgId = payment.org_id
    const orgName = payment.organizations?.name || 'Unknown'
    const amount = parseFloat(payment.amount)

    if (merchantRevenueMap.has(orgId)) {
      const existing = merchantRevenueMap.get(orgId)!
      existing.total += amount
    } else {
      merchantRevenueMap.set(orgId, { name: orgName, total: amount })
    }
  })

  const topMerchants = Array.from(merchantRevenueMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // Invoice Status Breakdown
  const invoiceStatusData = [
    { status: 'Paid', count: paidInvoices || 0, color: 'bg-green-600' },
    { status: 'Pending', count: pendingInvoices || 0, color: 'bg-yellow-600' },
    { status: 'Overdue', count: overdueInvoices || 0, color: 'bg-red-600' },
  ]

  const paymentSuccessRate = totalInvoices && paidInvoices
    ? Math.round((paidInvoices / totalInvoices) * 100)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-2">
          Detailed platform metrics and insights
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardDescription>Revenue This Month</CardDescription>
                <CardTitle className="text-3xl">
                  ${(revenueThisMonth / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {revenueGrowth >= 0 ? (
                    <Badge className="bg-green-600">+{revenueGrowth}%</Badge>
                  ) : (
                    <Badge variant="destructive">{revenueGrowth}%</Badge>
                  )}
                  <span className="text-sm text-slate-600">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Revenue Last Month</CardDescription>
                <CardTitle className="text-3xl">
                  ${(revenueLastMonth / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  {paymentsLastMonth?.length || 0} payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Revenue This Year</CardDescription>
                <CardTitle className="text-3xl">
                  ${(revenueThisYear / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  {paymentsThisYear?.length || 0} payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Merchants by Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Top Merchants This Month</CardTitle>
              <CardDescription>Ranked by revenue generated</CardDescription>
            </CardHeader>
            <CardContent>
              {topMerchants.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topMerchants.map((merchant, index) => (
                      <TableRow key={merchant.id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{merchant.name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ${(merchant.total / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-8 text-slate-500">No revenue data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Invoice Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Total Invoices</CardDescription>
                <CardTitle className="text-3xl">{totalInvoices || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-3xl">{invoicesThisMonth || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {invoiceGrowth >= 0 ? (
                    <Badge className="bg-green-600">+{invoiceGrowth}%</Badge>
                  ) : (
                    <Badge variant="destructive">{invoiceGrowth}%</Badge>
                  )}
                  <span className="text-sm text-slate-600">growth</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Payment Success Rate</CardDescription>
                <CardTitle className="text-3xl">{paymentSuccessRate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  {paidInvoices || 0} of {totalInvoices || 0} paid
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Average Invoice</CardDescription>
                <CardTitle className="text-3xl">
                  ${totalInvoices && revenueThisYear
                    ? ((revenueThisYear / totalInvoices) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })
                    : '0.00'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">This year</p>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Status Breakdown</CardTitle>
              <CardDescription>Current status of all invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceStatusData.map((item) => {
                  const percentage = totalInvoices ? Math.round((item.count / totalInvoices) * 100) : 0
                  return (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="font-medium">{item.status}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{item.count}</span>
                          <span className="text-sm text-slate-600 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-6">
          {/* Merchant Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Total Merchants</CardDescription>
                <CardTitle className="text-3xl">{totalMerchants || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>New This Month</CardDescription>
                <CardTitle className="text-3xl">{merchantsThisMonth || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {merchantGrowth >= 0 ? (
                    <Badge className="bg-green-600">
                      {merchantGrowth > 0 ? `+${merchantGrowth}%` : 'New'}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">{merchantGrowth}%</Badge>
                  )}
                  <span className="text-sm text-slate-600">growth</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Active Merchants</CardDescription>
                <CardTitle className="text-3xl">{uniqueActiveMerchants}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  {totalMerchants ? Math.round((uniqueActiveMerchants / totalMerchants) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Avg Revenue per Merchant</CardDescription>
                <CardTitle className="text-3xl">
                  ${uniqueActiveMerchants && revenueThisMonth
                    ? ((revenueThisMonth / uniqueActiveMerchants) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })
                    : '0.00'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Merchant Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Merchant Activity</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Merchants</span>
                    <span className="text-2xl font-bold text-green-600">{uniqueActiveMerchants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Inactive Merchants</span>
                    <span className="text-2xl font-bold text-slate-400">
                      {(totalMerchants || 0) - uniqueActiveMerchants}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-green-600"
                        style={{
                          width: `${totalMerchants ? Math.round((uniqueActiveMerchants / totalMerchants) * 100) : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 text-center">
                      {totalMerchants ? Math.round((uniqueActiveMerchants / totalMerchants) * 100) : 0}% merchant activity rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Trend</CardTitle>
                <CardDescription>Month over month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">This Month</span>
                      <span className="text-2xl font-bold">{merchantsThisMonth || 0}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-brand-orange"
                        style={{
                          width: `${merchantsLastMonth ? Math.min((merchantsThisMonth || 0) / merchantsLastMonth * 100, 100) : 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Last Month</span>
                      <span className="text-2xl font-bold text-slate-400">{merchantsLastMonth || 0}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-slate-400"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
