'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Crown, Calendar, X, Check } from 'lucide-react'

interface SubscriptionOverrideProps {
  merchantId: string
  merchantName: string
  currentPlan: string
  overridePlan: string | null
  overrideExpiresAt: string | null
  overrideReason: string | null
  overrideGrantedAt: string | null
}

export function SubscriptionOverride({
  merchantId,
  merchantName,
  currentPlan,
  overridePlan,
  overrideExpiresAt,
  overrideReason,
  overrideGrantedAt,
}: SubscriptionOverrideProps) {
  const [open, setOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'agency'>('pro')
  const [expirationDate, setExpirationDate] = useState('')
  const [isPermanent, setIsPermanent] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const hasOverride = !!overridePlan
  const isExpired = overrideExpiresAt && new Date(overrideExpiresAt) < new Date()
  const effectivePlan = (hasOverride && !isExpired) ? overridePlan : currentPlan

  const handleSetOverride = async () => {
    if (!reason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a reason for the override' })
      return
    }

    if (!isPermanent && !expirationDate) {
      setMessage({ type: 'error', text: 'Please select an expiration date or make it permanent' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/subscription-override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          expiresAt: isPermanent ? null : expirationDate,
          reason: reason.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set override')
      }

      setMessage({ type: 'success', text: data.message })

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveOverride = async () => {
    if (!confirm('Are you sure you want to remove the subscription override? The merchant will revert to their Stripe subscription plan.')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/subscription-override`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove override')
      }

      setMessage({ type: 'success', text: data.message })

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'agency':
        return <Badge className="bg-blue-600">Agency</Badge>
      case 'pro':
        return <Badge className="bg-purple-600">Pro</Badge>
      case 'free':
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-orange-600" />
              Subscription Override
            </CardTitle>
            <CardDescription>Manually grant subscription access for promotions or resolutions</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {hasOverride ? 'Update Override' : 'Set Override'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Set Subscription Override</DialogTitle>
                <DialogDescription>
                  Grant {merchantName} access to a subscription plan
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Plan Selection */}
                <div>
                  <Label>Select Plan</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button
                      onClick={() => setSelectedPlan('free')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedPlan === 'free'
                          ? 'border-orange-600 bg-orange-50 text-orange-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => setSelectedPlan('pro')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedPlan === 'pro'
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      Pro
                    </button>
                    <button
                      onClick={() => setSelectedPlan('agency')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedPlan === 'agency'
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      Agency
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label>Duration</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!isPermanent}
                        onChange={() => setIsPermanent(false)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Temporary (expires on specific date)</span>
                    </label>
                    {!isPermanent && (
                      <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        min={minDate}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm ml-6"
                      />
                    )}
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isPermanent}
                        onChange={() => setIsPermanent(true)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Permanent (never expires)</span>
                    </label>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Promotional upgrade, Resolution for issue #123, Company owned account"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Required for audit trail
                  </p>
                </div>

                {/* Message */}
                {message && (
                  <div className={`p-3 rounded-md text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSetOverride}
                    disabled={loading}
                  >
                    {loading ? 'Setting...' : 'Set Override'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Stripe Subscription</p>
            <div className="mt-1">{getPlanBadge(currentPlan)}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Effective Plan</p>
            <div className="mt-1">{getPlanBadge(effectivePlan)}</div>
          </div>
        </div>

        {/* Override Details */}
        {hasOverride && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Override Active</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveOverride}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Override Plan</p>
                <p className="font-medium mt-1">{getPlanBadge(overridePlan)}</p>
              </div>
              <div>
                <p className="text-slate-500">Expires</p>
                <p className="font-medium mt-1">
                  {overrideExpiresAt ? (
                    <>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(overrideExpiresAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {isExpired && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Expired
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-green-600">Never (Permanent)</span>
                  )}
                </p>
              </div>
              {overrideReason && (
                <div className="col-span-2">
                  <p className="text-slate-500">Reason</p>
                  <p className="text-sm mt-1 text-slate-700">{overrideReason}</p>
                </div>
              )}
              {overrideGrantedAt && (
                <div>
                  <p className="text-slate-500">Granted On</p>
                  <p className="text-sm mt-1">
                    {new Date(overrideGrantedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message for removed/no override */}
        {message && !hasOverride && (
          <div className={`p-3 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
