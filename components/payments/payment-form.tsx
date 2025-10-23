'use client'

import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PaymentFormProps {
  token: string
  invoiceNumber: string
  amountDue: number
  depositRequired?: number
  allowPartial: boolean
}

function CheckoutForm({
  token,
  invoiceNumber,
  amountDue,
  depositRequired,
  allowPartial,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pay/${token}/success`,
      },
    })

    if (error) {
      // Redirect to failure page for better UX
      if (error.type === 'card_error' || error.type === 'validation_error') {
        const errorMessage = encodeURIComponent(error.message || 'Payment failed')
        window.location.href = `/pay/${token}/failed?error=${errorMessage}`
      } else {
        setMessage(error.message || 'An unexpected error occurred.')
      }
    } else {
      setPaymentSuccess(true)
    }

    setIsProcessing(false)
  }

  if (paymentSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          Payment successful! Thank you for your payment.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {message && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isProcessing || !stripe || !elements}
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountDue)}`}
      </Button>

      <p className="text-xs text-center text-slate-500">
        Secure payment powered by Stripe
      </p>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(props.amountDue)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const createPaymentIntent = async (paymentAmount: number) => {
    setLoading(true)
    setError(null)
    setClientSecret(null)

    try {
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: props.token,
          amount: paymentAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      setClientSecret(data.clientSecret)
      setAmount(data.amount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePayFull = () => {
    setIsCustomAmount(false)
    setCustomAmount('')
    createPaymentIntent(props.amountDue)
  }

  const handlePayDeposit = () => {
    if (props.depositRequired) {
      setIsCustomAmount(false)
      setCustomAmount('')
      createPaymentIntent(props.depositRequired)
    }
  }

  const handleCustomAmountSubmit = () => {
    const value = parseFloat(customAmount)
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (value > props.amountDue) {
      setError(`Amount cannot exceed ${formatCurrency(props.amountDue)}`)
      return
    }
    if (props.depositRequired && value < props.depositRequired && value < props.amountDue) {
      setError(`Minimum payment is ${formatCurrency(props.depositRequired)}`)
      return
    }
    createPaymentIntent(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Payment</CardTitle>
        <CardDescription>
          Invoice #{props.invoiceNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!clientSecret ? (
          <div className="space-y-4">
            {/* Amount Selection */}
            <div className="space-y-3">
              <Label>Select Payment Amount</Label>

              {/* Pay Full Button */}
              <Button
                type="button"
                onClick={handlePayFull}
                variant="default"
                className="w-full justify-between"
                size="lg"
                disabled={loading}
              >
                <span>Pay Full Amount</span>
                <span className="font-bold">{formatCurrency(props.amountDue)}</span>
              </Button>

              {/* Pay Deposit Button */}
              {props.depositRequired && props.depositRequired < props.amountDue && (
                <Button
                  type="button"
                  onClick={handlePayDeposit}
                  variant="outline"
                  className="w-full justify-between"
                  size="lg"
                  disabled={loading}
                >
                  <span>Pay Deposit</span>
                  <span className="font-bold">{formatCurrency(props.depositRequired)}</span>
                </Button>
              )}

              {/* Custom Amount */}
              {props.allowPartial && (
                <div className="space-y-2">
                  {!isCustomAmount ? (
                    <Button
                      type="button"
                      onClick={() => setIsCustomAmount(true)}
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      Pay Custom Amount
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            min={props.depositRequired || 0}
                            max={props.amountDue}
                            step="0.01"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleCustomAmountSubmit}
                          disabled={loading || !customAmount}
                        >
                          Continue
                        </Button>
                      </div>
                      {props.depositRequired && (
                        <p className="text-xs text-slate-600">
                          Minimum: {formatCurrency(props.depositRequired)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading && (
              <p className="text-center text-sm text-slate-600">
                Preparing payment form...
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Payment Amount</p>
              <p className="text-2xl font-bold text-brand-slate">{formatCurrency(amount)}</p>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-xs"
                onClick={() => setClientSecret(null)}
              >
                Change amount
              </Button>
            </div>

            <Elements
              stripe={getStripe()}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#EF4C23',
                  },
                },
              }}
            >
              <CheckoutForm {...props} amountDue={amount} />
            </Elements>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
