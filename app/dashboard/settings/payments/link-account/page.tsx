'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LinkAccountPage() {
  const [accountId, setAccountId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accountId.trim()) {
      setError('Please enter a Stripe account ID')
      return
    }

    if (!accountId.startsWith('acct_')) {
      setError('Invalid Stripe account ID format. It should start with "acct_"')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch('/api/stripe/connect/link-existing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: accountId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to link account')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to link account')
    } finally {
      setLoading(false)
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
              <Link href="/dashboard/settings/payments">Back to Payment Settings</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Link Existing Stripe Account</CardTitle>
            <CardDescription>
              Already have a Stripe Connect account? Enter your account ID to link it to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountId">Stripe Connect Account ID</Label>
                <Input
                  id="accountId"
                  type="text"
                  placeholder="acct_1234567890abcdef"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  disabled={loading}
                  className="font-mono"
                />
                <p className="text-sm text-slate-600">
                  Your Stripe Connect account ID starts with "acct_"
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Linking Account...
                  </>
                ) : (
                  'Link Account'
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Account Linked Successfully!</p>
                    <div className="text-sm space-y-1">
                      <p>Account ID: {result.account_id}</p>
                      <p>Email: {result.email}</p>
                      <p>Charges Enabled: {result.charges_enabled ? '✓ Yes' : '✗ No'}</p>
                      <p>Payouts Enabled: {result.payouts_enabled ? '✓ Yes' : '✗ No'}</p>
                      <p>Details Submitted: {result.details_submitted ? '✓ Yes' : '✗ No'}</p>
                    </div>
                    <Button asChild className="mt-4">
                      <Link href="/dashboard/settings/payments">
                        Go to Payment Settings
                      </Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Find Your Stripe Account ID</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">1. Log in to Stripe Dashboard</p>
              <p className="text-slate-600">
                Go to{' '}
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  dashboard.stripe.com
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold">2. Navigate to Connect Settings</p>
              <p className="text-slate-600">
                Click on <strong>Settings</strong> → <strong>Connect</strong>
              </p>
            </div>
            <div>
              <p className="font-semibold">3. Find Your Account ID</p>
              <p className="text-slate-600">
                Your account ID is displayed at the top of the page and starts with "acct_"
              </p>
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> You can only link Stripe Connect Express or Standard accounts.
                Custom accounts require additional setup.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
