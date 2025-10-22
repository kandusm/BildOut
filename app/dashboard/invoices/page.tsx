import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { InvoiceFilters } from '@/components/invoices/invoice-filters'
import { InvoiceTable } from '@/components/invoices/invoice-table'

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }>
}) {
  const params = await searchParams
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

  // Build query with filters
  let query = supabase
    .from('invoices')
    .select(`
      *,
      clients (
        id,
        name,
        email
      )
    `)
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)

  // Apply status filter
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  // Apply date range filters
  if (params.dateFrom) {
    query = query.gte('issue_date', params.dateFrom)
  }
  if (params.dateTo) {
    query = query.lte('issue_date', params.dateTo)
  }

  query = query.order('created_at', { ascending: false })

  let { data: invoices } = await query

  // Apply search filter client-side (invoice number or client name)
  // Note: Supabase .or() with nested relationships is complex, so we filter after fetch
  if (params.search && invoices) {
    const searchLower = params.search.toLowerCase()
    invoices = invoices.filter((invoice: any) => {
      const numberMatch = invoice.number?.toString().toLowerCase().includes(searchLower)
      const clientMatch = invoice.clients?.name?.toLowerCase().includes(searchLower)
      return numberMatch || clientMatch
    })
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
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-600 mt-2">
              Manage and track all your invoices
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>

        <InvoiceFilters />

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>
              {invoices?.length || 0} total invoice{invoices?.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!invoices || invoices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No invoices yet</p>
                <Button asChild>
                  <Link href="/dashboard/invoices/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first invoice
                  </Link>
                </Button>
              </div>
            ) : (
              <InvoiceTable invoices={invoices as any} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
