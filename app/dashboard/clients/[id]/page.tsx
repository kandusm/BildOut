import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ClientForm } from '@/components/client-form'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  // Fetch client
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)
    .single()

  if (!client) {
    redirect('/dashboard/clients')
  }

  // Fetch invoices for this client
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, number, issue_date, due_date, total, status')
    .eq('client_id', id)
    .is('deleted_at', null)
    .order('issue_date', { ascending: false })

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
              <Link href="/dashboard/clients">Back to Clients</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
          <p className="text-slate-600 mt-2">
            Client information and invoice history
          </p>
        </div>

        <div className="space-y-6">
          {/* Client Details */}
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
              <CardDescription>Contact information and details</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm client={client} />
            </CardContent>
          </Card>

          {/* Invoice History */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                {invoices?.length || 0} invoice{invoices?.length !== 1 ? 's' : ''} for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!invoices || invoices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">No invoices yet for this client</p>
                  <Button asChild>
                    <Link href="/dashboard/invoices/new">
                      Create Invoice
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.number}
                        </TableCell>
                        <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                        <TableCell>
                          {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                        </TableCell>
                        <TableCell>{formatCurrency(invoice.total)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(invoice.status) as any}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/invoices/${invoice.id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
