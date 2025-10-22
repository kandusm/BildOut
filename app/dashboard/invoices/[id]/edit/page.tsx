import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditInvoiceForm } from '@/components/invoice/edit-invoice-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch invoice with line items
  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        id,
        name
      ),
      invoice_items (*)
    `)
    .eq('id', id)
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)
    .single()

  if (!invoice) {
    redirect('/dashboard/invoices')
  }

  // Only allow editing draft invoices
  if (invoice.status !== 'draft') {
    redirect(`/dashboard/invoices/${id}`)
  }

  // Fetch all clients for selector
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)
    .order('name')

  // Fetch all items for selector
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)
    .order('name')

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
              <Link href={`/dashboard/invoices/${id}`}>Cancel</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Invoice #{invoice.number}</h1>
          <p className="text-slate-600 mt-2">
            Make changes to your invoice
          </p>
        </div>

        <EditInvoiceForm
          invoice={invoice}
          clients={clients || []}
          items={items || []}
          orgId={profile.org_id}
        />
      </main>
    </div>
  )
}
