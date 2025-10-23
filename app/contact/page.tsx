import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/contact-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile if logged in
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*, organizations!users_org_id_fkey(*)')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <img src="/logo.svg" alt="BildOut" className="w-10 h-10" />
            <span className="text-xl font-semibold text-brand-slate font-heading">BildOut</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                  Dashboard
                </Link>
                <span className="text-sm text-slate-600">
                  {profile?.display_name || user.email}
                </span>
                <form action={handleSignOut}>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-slate-900">
                  Sign in
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Have a question or need help? We're here to assist you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm
              userEmail={user?.email}
              userName={profile?.display_name}
              orgId={profile?.organizations?.id}
            />
          </CardContent>
        </Card>

        {/* Additional Contact Methods */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-2">
                Prefer email? Send us a message directly:
              </p>
              <a
                href="mailto:support@bildout.com"
                className="text-blue-600 hover:underline font-medium"
              >
                support@bildout.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-2">
                Check out our documentation and guides:
              </p>
              <Link href="/docs" className="text-blue-600 hover:underline font-medium">
                View Documentation
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
