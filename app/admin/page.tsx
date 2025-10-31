import { requireAdmin } from '@/lib/admin/require-admin'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminOverviewPage() {
  await requireAdmin()

  const supabase = await createClient()

  // Get merchant stats
  const { count: totalMerchants } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: onboardedMerchants } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .not('stripe_connect_id', 'is', null)

  const { count: completedMerchants } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('onboarding_status', 'complete')

  // Get invoice stats
  const { count: totalInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })

  const { count: paidInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid')

  // Get payment stats
  const { count: totalPayments } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })

  const { data: paymentsData } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')

  const totalGMV = paymentsData?.reduce((sum, p) => sum + parseFloat(p.amount as any), 0) || 0

  // Get pending merchants (not completed onboarding)
  const { data: pendingMerchants } = await supabase
    .from('users')
    .select('id, display_name, onboarding_status, created_at')
    .not('onboarding_status', 'eq', 'complete')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent merchants
  const { data: recentMerchants } = await supabase
    .from('users')
    .select('id, display_name, onboarding_status, stripe_connect_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate additional metrics
  const paymentSuccessRate = totalInvoices && paidInvoices
    ? Math.round((paidInvoices / totalInvoices) * 100)
    : 0

  const avgInvoiceValue = totalInvoices && totalGMV
    ? totalGMV / totalInvoices
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Merchants</CardDescription>
            <CardTitle className="text-3xl">{totalMerchants || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {onboardedMerchants || 0} with Stripe Connect
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Completed Onboarding</CardDescription>
            <CardTitle className="text-3xl">{completedMerchants || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {totalMerchants ? Math.round((completedMerchants || 0) / totalMerchants * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-3xl">{totalInvoices || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {paidInvoices || 0} paid ({paymentSuccessRate}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total GMV</CardDescription>
            <CardTitle className="text-3xl">
              ${(totalGMV / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {totalPayments || 0} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Average Invoice Value</CardDescription>
            <CardTitle className="text-2xl">
              ${(avgInvoiceValue / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Pending Onboarding</CardDescription>
            <CardTitle className="text-2xl">
              {(totalMerchants || 0) - (completedMerchants || 0)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Payment Success Rate</CardDescription>
            <CardTitle className="text-2xl">{paymentSuccessRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Merchants & Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Merchants</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/merchants">View All</Link>
              </Button>
            </div>
            <CardDescription>Latest merchant signups</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMerchants && recentMerchants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMerchants.map((merchant: any) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/merchants/${merchant.id}`}
                          className="hover:underline"
                        >
                          {merchant.display_name || 'Unnamed'}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {merchant.onboarding_status === 'complete' ? (
                          <Badge variant="default" className="bg-green-600">Complete</Badge>
                        ) : merchant.stripe_connect_id ? (
                          <Badge variant="secondary">Incomplete</Badge>
                        ) : (
                          <Badge variant="outline">Not Started</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(merchant.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-slate-500">No merchants yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Onboarding</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/merchants?status=incomplete">View All</Link>
              </Button>
            </div>
            <CardDescription>Merchants who need to complete setup</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingMerchants && pendingMerchants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMerchants.map((merchant: any) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/merchants/${merchant.id}`}
                          className="hover:underline"
                        >
                          {merchant.display_name || 'Unnamed'}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{merchant.onboarding_status || 'pending'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(merchant.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-slate-500">All merchants onboarded!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Merchant Management</CardTitle>
            <CardDescription>
              View and manage all merchant accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/merchants">View All Merchants</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe Accounts</CardTitle>
            <CardDescription>
              View and delete Stripe Connect accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/stripe-accounts">Manage Stripe Accounts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              View all admin actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/logs">View Audit Logs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
