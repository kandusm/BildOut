import { requireAdmin } from '@/lib/admin/require-admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { notFound } from 'next/navigation'
import { MerchantActions } from '@/components/admin/merchant-actions'
import { SubscriptionOverride } from '@/components/admin/subscription-override'

export default async function MerchantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params
  const supabase = await createClient()

  // Fetch merchant details
  const { data: merchant, error: merchantError} = await supabase
    .from('users')
    .select(`
      id,
      display_name,
      stripe_connect_id,
      onboarding_status,
      payouts_enabled,
      stripe_balance,
      stripe_onboarding_complete,
      created_at,
      updated_at,
      org_id,
      organizations (
        id,
        name,
        invoice_prefix,
        invoice_number_sequence,
        metadata,
        created_at,
        subscription_plan,
        subscription_override_plan,
        subscription_override_expires_at,
        subscription_override_reason,
        subscription_override_granted_at
      )
    `)
    .eq('id', id)
    .single()

  if (merchantError || !merchant) {
    notFound()
  }

  // Fetch invoices (including deleted ones to show them differently)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, number, status, total, amount_paid, created_at, deleted_at')
    .eq('org_id', merchant.org_id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch payments
  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount, status, created_at')
    .eq('org_id', merchant.org_id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate stats
  const { data: allInvoices } = await supabase
    .from('invoices')
    .select('status, total, amount_paid')
    .eq('org_id', merchant.org_id)

  const stats = {
    totalInvoices: allInvoices?.length || 0,
    paidInvoices: allInvoices?.filter(i => i.status === 'paid').length || 0,
    overdueInvoices: allInvoices?.filter(i => i.status === 'overdue').length || 0,
    totalVolume: allInvoices?.reduce((sum, i) => sum + parseFloat(i.total as any || 0), 0) || 0,
    paidVolume: allInvoices?.reduce((sum, i) => sum + parseFloat(i.amount_paid as any || 0), 0) || 0,
  }

  // Get status badge
  const getStatusBadge = () => {
    if (!merchant.stripe_connect_id) {
      return <Badge variant="secondary">Not Started</Badge>
    }

    switch (merchant.onboarding_status) {
      case 'complete':
        return <Badge variant="default" className="bg-green-600">Complete</Badge>
      case 'verified':
        return <Badge variant="default" className="bg-blue-600">Verified</Badge>
      case 'incomplete':
        return <Badge variant="secondary">Incomplete</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{merchant.onboarding_status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/merchants"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              ← Back to Merchants
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {merchant.display_name || 'Unnamed Merchant'}
          </h1>
          <p className="text-slate-600 mt-1">
            {merchant.organizations?.name}
          </p>
        </div>
        <MerchantActions
          merchantId={merchant.id}
          merchantName={merchant.display_name || 'Unnamed Merchant'}
          stripeConnectId={merchant.stripe_connect_id}
          currentStatus={merchant.onboarding_status}
        />
      </div>

      {/* Account Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Onboarding Status</CardDescription>
          </CardHeader>
          <CardContent>
            {getStatusBadge()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Payouts</CardDescription>
          </CardHeader>
          <CardContent>
            {merchant.payouts_enabled ? (
              <Badge variant="default" className="bg-green-600">Enabled</Badge>
            ) : (
              <Badge variant="secondary">Disabled</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Stripe Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${parseFloat(merchant.stripe_balance || '0').toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total GMV</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${(stats.paidVolume).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Merchant Details */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Merchant ID</p>
              <p className="text-sm font-mono mt-1">{merchant.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Organization ID</p>
              <p className="text-sm font-mono mt-1">{merchant.org_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Stripe Connect ID</p>
              <p className="text-sm font-mono mt-1">
                {merchant.stripe_connect_id || <span className="text-slate-400">Not connected</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Invoice Prefix</p>
              <p className="text-sm mt-1">{merchant.organizations?.invoice_prefix || 'QB'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Account Created</p>
              <p className="text-sm mt-1">
                {new Date(merchant.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Last Updated</p>
              <p className="text-sm mt-1">
                {new Date(merchant.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Override */}
      <SubscriptionOverride
        merchantId={merchant.id}
        merchantName={merchant.display_name || 'Unnamed Merchant'}
        currentPlan={merchant.organizations?.subscription_plan || 'free'}
        overridePlan={merchant.organizations?.subscription_override_plan || null}
        overrideExpiresAt={merchant.organizations?.subscription_override_expires_at || null}
        overrideReason={merchant.organizations?.subscription_override_reason || null}
        overrideGrantedAt={merchant.organizations?.subscription_override_granted_at || null}
      />

      {/* Invoice Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Invoices</p>
              <p className="text-2xl font-bold mt-1">{stats.totalInvoices}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Paid Invoices</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats.paidInvoices}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overdue Invoices</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{stats.overdueInvoices}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Volume</p>
              <p className="text-2xl font-bold mt-1">${stats.totalVolume.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Last 10 invoices created by this merchant</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      {invoice.number}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>${parseFloat(invoice.total as any).toFixed(2)}</TableCell>
                    <TableCell>${parseFloat(invoice.amount_paid as any).toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-slate-500">No invoices yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Last 10 payments received by this merchant</CardDescription>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>${parseFloat(payment.amount as any).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.status === 'succeeded' ? 'default' : 'secondary'}
                        className={payment.status === 'succeeded' ? 'bg-green-600' : ''}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-slate-500">No payments yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
