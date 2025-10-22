import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GeneralSettingsForm } from '@/components/settings/general-settings-form'
import Link from 'next/link'

export default async function GeneralSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's profile and organization
  const { data: profile } = await supabase
    .from('users')
    .select('org_id, display_name, organizations!inner(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const organization = profile.organizations as any

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
              <Link href="/dashboard/settings">Back to Settings</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">General Settings</h1>
          <p className="text-slate-600 mt-2">
            Manage your account and organization information
          </p>
        </div>

        <GeneralSettingsForm
          user={{
            id: user.id,
            email: user.email || '',
            display_name: profile.display_name || '',
          }}
          organization={organization}
        />
      </main>
    </div>
  )
}
