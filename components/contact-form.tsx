'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ContactFormProps {
  userEmail?: string
  userName?: string
  orgId?: string
}

export function ContactForm({ userEmail, userName, orgId }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      {submitted ? (
        <div className="py-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
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
          <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
          <p className="text-slate-600 mb-4">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </div>
      ) : (
        <form
          action="https://formspree.io/f/xqayggka"
          method="POST"
          className="space-y-6"
          onSubmit={() => setSubmitted(true)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Smith"
                defaultValue={userName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={userEmail}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="How can we help you?"
              required
            />
          </div>

          {orgId && (
            <input type="hidden" name="orgId" value={orgId} />
          )}

          {!orgId && (
            <div className="space-y-2">
              <Label htmlFor="orgId">Organization ID (optional)</Label>
              <Input
                id="orgId"
                name="orgId"
                type="text"
                placeholder="If you have an account, paste your org ID here"
              />
              <p className="text-xs text-slate-500">
                Find this in Settings → General if you're logged in
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please describe your issue or question in detail..."
              required
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              We typically respond within 24 hours
            </p>
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      )}
    </>
  )
}
