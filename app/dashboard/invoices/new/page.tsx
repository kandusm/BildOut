import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CreateInvoiceForm } from '@/components/create-invoice-form'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's org_id
  const { data: profile } = await supabase
    .from('users')
    .select('org_id, organizations!users_org_id_fkey(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Fetch clients for dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, email, address')
    .eq('org_id', profile.org_id)
    .order('name', { ascending: true })

  // Fetch items for quick add
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('name', { ascending: true })

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

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create Invoice</h1>
          <p className="text-slate-600 mt-2">
            Fill out the details below to create a new invoice
          </p>
        </div>

        <CreateInvoiceForm
          orgId={profile.org_id}
          organization={profile.organizations as any}
          clients={clients || []}
          items={items || []}
        />
      </main>
    </div>
  )
}
