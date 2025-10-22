import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default async function PaymentFailedPage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { token } = await params
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We were unable to process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 space-y-2">
            <p className="font-medium">Common reasons for payment failures:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Insufficient funds</li>
              <li>Incorrect card details</li>
              <li>Card declined by bank</li>
              <li>Expired card</li>
              <li>Network or connection issue</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full" size="lg">
              <Link href={`/pay/${token}`}>
                Try Again
              </Link>
            </Button>
            <p className="text-xs text-center text-slate-500">
              Your payment was not processed and you were not charged.
            </p>
          </div>

          <div className="text-center text-sm text-slate-600 pt-4 border-t">
            <p className="mb-2">Need help?</p>
            <p className="text-xs text-slate-500">
              Contact the merchant directly or check with your bank if you continue to experience issues.
            </p>
          </div>

          <div className="text-center text-xs text-slate-500 pt-4 border-t">
            <p>Powered by BildOut</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
