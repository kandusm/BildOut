'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { COMPANY_TYPE_OPTIONS, type CompanyType } from '@/lib/company-types-config'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [companyType, setCompanyType] = useState<CompanyType>('other')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            business_name: businessName,
            display_name: displayName || email,
            company_type: companyType,
          },
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Click the link that was sent to your email to complete signup!'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Tagline */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="BildOut" className="w-12 h-12" />
            <span className="text-2xl font-bold text-brand-slate font-heading">BildOut</span>
          </Link>
          <p className="text-slate-600 text-sm mt-2">Your work. Billed out.</p>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start sending invoices and getting paid faster
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="ABC Roofing Co."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyType">Business Type</Label>
              <select
                id="companyType"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value as CompanyType)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {COMPANY_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                We'll preset relevant invoice items for your business type
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Your Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Smith"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {message && (
              <div
                className={`rounded-md p-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  )
}
