import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { InvoiceActions } from '@/components/invoice/invoice-actions'
import { InvoiceStatusTimeline } from '@/components/invoices/invoice-status-timeline'
import Link from 'next/link'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's org_id and Stripe info
  const { data: profile } = await supabase
    .from('users')
    .select('org_id, stripe_connect_id, stripe_onboarding_complete, organizations!users_org_id_fkey(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const hasPaymentProcessing = !!(profile.stripe_connect_id && profile.stripe_onboarding_complete)

  // Fetch invoice with client and line items
  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        id,
        name,
        email,
        phone,
        address
      ),
      invoice_items (
        *
      )
    `)
    .eq('id', id)
    .eq('org_id', profile.org_id)
    .single()

  if (!invoice) {
    redirect('/dashboard/invoices')
  }

  // Fetch status history
  const { data: statusHistory } = await supabase
    .from('invoice_status_history')
    .select('*')
    .eq('invoice_id', id)
    .order('changed_at', { ascending: false })

  // Fetch payment history
  const { data: paymentHistory } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', id)
    .order('created_at', { ascending: false })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary'
      case 'sent':
        return 'default'
      case 'paid':
        return 'default'
      case 'overdue':
        return 'destructive'
      case 'cancelled':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const organization = profile.organizations as any

  // Calculate tax percentage
  const taxPercentage = invoice.subtotal > 0 && invoice.tax_total > 0
    ? ((invoice.tax_total / invoice.subtotal) * 100).toFixed(2)
    : '0.00'

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
              <Link href="/dashboard/invoices">Back to Invoices</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                Invoice #{invoice.number}
              </h1>
              <Badge variant={getStatusColor(invoice.status) as any}>
                {invoice.status}
              </Badge>
            </div>
            <p className="text-slate-600 mt-2">
              Created on {formatDate(invoice.issue_date)}
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Invoice Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">From:</h3>
                  <p className="font-medium">{organization.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Bill To:</h3>
                  {invoice.clients ? (
                    <div>
                      <p className="font-medium">{invoice.clients.name}</p>
                      {invoice.clients.email && <p className="text-sm text-slate-600">{invoice.clients.email}</p>}
                      {invoice.clients.phone && <p className="text-sm text-slate-600">{invoice.clients.phone}</p>}
                      {invoice.clients.address && <p className="text-sm text-slate-600 mt-1">{invoice.clients.address}</p>}
                    </div>
                  ) : (
                    <p className="text-slate-600">No client assigned</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t">
                <div>
                  <p className="text-sm text-slate-600">Invoice Date</p>
                  <p className="font-medium">{formatDate(invoice.issue_date)}</p>
                </div>
                {invoice.due_date && (
                  <div>
                    <p className="text-sm text-slate-600">Due Date</p>
                    <p className="font-medium">{formatDate(invoice.due_date)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.invoice_items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.line_total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax_total > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax ({taxPercentage}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.tax_total)}</span>
                  </div>
                )}
                {invoice.discount_total > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Discount:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(invoice.discount_total)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">{formatCurrency(invoice.total)}</span>
                </div>
                {invoice.amount_paid > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">{formatCurrency(invoice.amount_paid)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Balance Due:</span>
                      <span className="font-bold">{formatCurrency(invoice.amount_due)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          {paymentHistory && paymentHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  {paymentHistory.length} payment{paymentHistory.length !== 1 ? 's' : ''} received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(payment.created_at)}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(payment.created_at).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">
                            {payment.method?.replace('_', ' ') || 'card'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === 'succeeded'
                                ? 'default'
                                : payment.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              payment.status === 'succeeded'
                                ? 'text-green-600 font-semibold'
                                : payment.status === 'failed'
                                ? 'text-red-600'
                                : ''
                            }
                          >
                            {formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total Received</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(
                        paymentHistory
                          .filter((p: any) => p.status === 'succeeded')
                          .reduce((sum: number, p: any) => sum + parseFloat(p.amount as any), 0)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status History Timeline */}
          {statusHistory && statusHistory.length > 0 && (
            <InvoiceStatusTimeline history={statusHistory} />
          )}

          {/* Actions */}
          <InvoiceActions
            invoiceId={invoice.id}
            invoiceNumber={invoice.number}
            status={invoice.status}
            paymentLinkToken={invoice.payment_link_token}
            hasPaymentProcessing={hasPaymentProcessing}
          />
        </div>
      </main>
    </div>
  )
}
