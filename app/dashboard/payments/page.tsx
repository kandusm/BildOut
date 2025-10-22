import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's org_id
  const { data: profile } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Fetch payments with invoice info
  const { data: payments } = await supabase
    .from('payments')
    .select(`
      *,
      invoices (
        id,
        number,
        clients (
          id,
          name
        )
      )
    `)
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })

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
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'requires_payment':
        return 'outline'
      case 'failed':
        return 'destructive'
      case 'canceled':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'Succeeded'
      case 'processing':
        return 'Processing'
      case 'requires_payment':
        return 'Requires Payment'
      case 'failed':
        return 'Failed'
      case 'canceled':
        return 'Canceled'
      default:
        return status
    }
  }

  // Calculate total payments
  const totalPayments = payments?.reduce((sum, payment) => {
    if (payment.status === 'succeeded') {
      return sum + Number(payment.amount)
    }
    return sum
  }, 0) || 0

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
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
          <p className="text-slate-600 mt-2">
            View all payment transactions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Payments Received</CardDescription>
              <CardTitle className="text-3xl">{formatCurrency(totalPayments)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Transactions</CardDescription>
              <CardTitle className="text-3xl">{payments?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Successful Payments</CardDescription>
              <CardTitle className="text-3xl">
                {payments?.filter(p => p.status === 'succeeded').length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
            <CardDescription>
              {payments?.length || 0} total payment{payments?.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!payments || payments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No payments yet</p>
                <Button asChild>
                  <Link href="/dashboard/invoices">
                    View Invoices
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {formatDate(payment.created_at)}
                        </TableCell>
                        <TableCell>
                          {payment.invoices ? (
                            <Link
                              href={`/dashboard/invoices/${payment.invoices.id}`}
                              className="text-brand-orange hover:underline"
                            >
                              #{payment.invoices.number}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {payment.invoices?.clients?.name || 'No client'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(payment.amount))}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{payment.method || 'card'}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payment.status) as any}>
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.invoices && (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/dashboard/invoices/${payment.invoices.id}`}>
                                View Invoice
                              </Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
