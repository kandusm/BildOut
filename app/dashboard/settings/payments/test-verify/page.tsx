'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TestVerifyPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)

      // Reset and create new Standard account
      const response = await fetch('/api/stripe/connect/reset', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test account')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to create test account')
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
            <CardTitle>Test Mode: Bypass Stripe Verification</CardTitle>
            <CardDescription>
              This tool is for TEST MODE ONLY. It will mark your Stripe Connect account as verified
              so you can test payment functionality without completing phone verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Test Mode Only:</strong> This will only work with test Stripe accounts.
                Make sure you're using test API keys.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleVerify}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Test Account...
                </>
              ) : (
                'Create Test Stripe Account'
              )}
            </Button>

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
                    <p className="font-semibold">Account Updated Successfully!</p>
                    <div className="text-sm space-y-1">
                      <p>Account ID: {result.account_id}</p>
                      <p>Charges Enabled: {result.charges_enabled ? '✓ Yes' : '✗ No'}</p>
                      <p>Payouts Enabled: {result.payouts_enabled ? '✓ Yes' : '✗ No'}</p>
                      <p>Details Submitted: {result.details_submitted ? '✓ Yes' : '✗ No'}</p>
                      {result.requirements && result.requirements.currently_due && result.requirements.currently_due.length > 0 && (
                        <p className="text-red-600">
                          Still Required: {result.requirements.currently_due.join(', ')}
                        </p>
                      )}
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
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">1. Start Stripe Onboarding</p>
              <p className="text-slate-600">
                Begin the onboarding process from Payment Settings. This creates your test Stripe account.
              </p>
            </div>
            <div>
              <p className="font-semibold">2. Exit the Onboarding Flow</p>
              <p className="text-slate-600">
                If you get stuck at phone verification, just close the tab and come back here.
              </p>
            </div>
            <div>
              <p className="font-semibold">3. Click the Button Above</p>
              <p className="text-slate-600">
                This will bypass verification and mark your test account as ready to accept payments.
              </p>
            </div>
            <div>
              <p className="font-semibold">4. Start Testing Payments</p>
              <p className="text-slate-600">
                Once verified, you can create test invoices and process payments using test card numbers.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
