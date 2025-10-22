import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AddClientDialog } from '@/components/add-client-dialog'

export default async function ClientsPage() {
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

  // Fetch clients with invoice count
  const { data: clients } = await supabase
    .from('clients')
    .select(`
      *,
      invoices (count)
    `)
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)
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
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
            <p className="text-slate-600 mt-2">
              Manage your client contact information
            </p>
          </div>
          <AddClientDialog orgId={profile.org_id} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>
              {clients?.length || 0} total client{clients?.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!clients || clients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No clients yet</p>
                <AddClientDialog orgId={profile.org_id} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Invoices</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client: any) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email || '-'}</TableCell>
                        <TableCell>{client.phone || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {client.address || '-'}
                        </TableCell>
                        <TableCell>
                          {client.invoices?.[0]?.count || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/clients/${client.id}`}>
                              View
                            </Link>
                          </Button>
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
