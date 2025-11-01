'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('signup_email')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // No email found - redirect to signup
      router.push('/signup')
    }
  }, [router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else if (data.user) {
        // Clear session storage
        sessionStorage.removeItem('signup_email')
        sessionStorage.removeItem('signup_metadata')

        // Redirect to dashboard
        router.push('/dashboard')
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

  const handleResend = async () => {
    setResending(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Verification code sent! Check your email.' })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to resend code'
      })
    } finally {
      setResending(false)
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

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <span className="font-semibold">{email}</span>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit code from your email
                </p>
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
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
              <div className="text-center text-sm text-slate-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-blue-600 hover:underline disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              </div>
              <p className="text-center text-sm text-slate-600">
                <Link href="/signup" className="text-blue-600 hover:underline">
                  ← Back to signup
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
