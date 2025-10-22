import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSuccessPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">
            <p className="mb-2">
              You will receive a payment receipt via email shortly.
            </p>
            <p>
              If you have any questions, please contact the merchant directly.
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
