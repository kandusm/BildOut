'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="BildOut" className="w-10 h-10" />
              <span className="text-xl font-semibold text-brand-slate font-heading">BildOut</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Something went wrong</CardTitle>
                <CardDescription className="mt-1">
                  We encountered an error while loading this page
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Error Details:</p>
              <p className="text-sm font-mono text-slate-600 break-words">
                {error.message || 'An unexpected error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-slate-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={reset} className="flex-1">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </a>
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-slate-600">
                If this problem persists, please contact support with the error ID shown above.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
