'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
                  <CardDescription className="mt-1">
                    We're sorry, but an unexpected error occurred
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
                  <a href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </a>
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-slate-600 text-center">
                  If this problem continues, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
