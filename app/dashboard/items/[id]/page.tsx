import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ItemForm } from '@/components/item-form'

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Check if this is the "new" page
  if (id === 'new') {
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
                <Link href="/dashboard/items">Back to Items</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Create New Item</h1>
            <p className="text-slate-600 mt-2">
              Add a reusable item to speed up invoice creation
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Enter the item information</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemForm item={null} />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Fetch item
  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .eq('org_id', profile.org_id)
    .is('deleted_at', null)
    .single()

  if (!item) {
    redirect('/dashboard/items')
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
              <Link href="/dashboard/items">Back to Items</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
          <p className="text-slate-600 mt-2">
            Edit item details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Update the item information</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemForm item={item} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
