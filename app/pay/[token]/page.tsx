import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PaymentForm } from '@/components/payments/payment-form'

export default async function PaymentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  // Fetch invoice by payment_link_token (public access, no auth required)
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        name,
        email
      ),
      invoice_items (
        *
      ),
      organizations!invoices_org_id_fkey (
        name,
        logo_url,
        metadata,
        users!users_org_id_fkey!inner (
          stripe_connect_id
        )
      )
    `)
    .eq('payment_link_token', token)
    .single()

  if (error || !invoice) {
    notFound()
  }

  // Check if invoice can accept payments
  if (invoice.status === 'paid') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Invoice Already Paid</CardTitle>
            <CardDescription>
              This invoice has been paid in full. Thank you!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (invoice.status === 'void' || invoice.status === 'cancelled') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Invoice {invoice.status === 'void' ? 'Voided' : 'Cancelled'}</CardTitle>
            <CardDescription>
              This invoice is no longer active.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Fetch payment history
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoice.id)
    .eq('status', 'succeeded')
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

  const organization = invoice.organizations as any
  const brandColor = organization.metadata?.brand_color || '#EF4C23'
  const invoicePrefix = organization.metadata?.invoice_prefix || 'INV'
  const displayInvoiceNumber = `${invoicePrefix}-${invoice.number}`

  // Check if merchant has Stripe Connect configured
  const merchantUser = organization.users?.[0]
  const hasStripeConnect = merchantUser?.stripe_connect_id ? true : false

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          {organization.logo_url && (
            <div className="flex justify-center mb-4">
              <img
                src={organization.logo_url}
                alt={organization.name}
                className="max-h-16 object-contain"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-brand-slate mb-2">
            {organization.name}
          </h1>
          <p className="text-slate-600">Invoice #{displayInvoiceNumber}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Invoice Details */}
          <div className="space-y-6">
            {/* Invoice Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Bill To</p>
                  {invoice.clients ? (
                    <div>
                      <p className="font-medium">{invoice.clients.name}</p>
                      {invoice.clients.email && (
                        <p className="text-sm text-slate-600">{invoice.clients.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-600">No client assigned</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <Badge variant={invoice.status === 'partial' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
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
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.invoice_items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.line_total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.tax_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax:</span>
                      <span>{formatCurrency(invoice.tax_total)}</span>
                    </div>
                  )}
                  {invoice.discount_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Discount:</span>
                      <span className="text-red-600">-{formatCurrency(invoice.discount_total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                  {invoice.amount_paid > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Amount Paid:</span>
                        <span className="text-green-600">{formatCurrency(invoice.amount_paid)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Balance Due:</span>
                        <span style={{ color: brandColor }}>{formatCurrency(invoice.amount_due)}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            {payments && payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-slate-600">
                            {formatDate(payment.created_at)}
                          </p>
                        </div>
                        <Badge variant="default">Paid</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Payment Form or Setup Message */}
          <div>
            {hasStripeConnect ? (
              <PaymentForm
                token={token}
                invoiceNumber={invoice.number}
                amountDue={invoice.amount_due}
                depositRequired={invoice.deposit_required}
                allowPartial={invoice.allow_partial}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Setup Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">
                    {organization.name} is still setting up online payment processing.
                  </p>
                  <p className="text-slate-600">
                    Please contact them directly to arrange payment for this invoice.
                  </p>
                  {invoice.clients?.email && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Invoice sent to:</p>
                      <p className="font-medium">{invoice.clients.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>Powered by BildOut - Your work. Billed out.</p>
        </div>
      </div>
    </div>
  )
}
