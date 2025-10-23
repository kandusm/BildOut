'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Upload, Check, Lock } from 'lucide-react'

interface BrandingFormProps {
  organization: {
    id: string
    name: string
    logo_url?: string | null
    metadata?: {
      brand_color?: string
      invoice_prefix?: string
      default_terms?: string
      default_notes?: string
      email_signature?: string
    } | null
  }
  nextInvoiceNumber: number
  subscriptionPlan: 'free' | 'pro' | 'agency'
}

export function BrandingForm({ organization, nextInvoiceNumber, subscriptionPlan }: BrandingFormProps) {
  const isFreePlan = subscriptionPlan === 'free'
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    organization.logo_url || null
  )
  const [brandColor, setBrandColor] = useState(
    organization.metadata?.brand_color || '#EF4C23'
  )
  const [invoicePrefix, setInvoicePrefix] = useState(
    organization.metadata?.invoice_prefix || 'INV'
  )
  const [nextNumber, setNextNumber] = useState(nextInvoiceNumber)
  const [defaultTerms, setDefaultTerms] = useState(
    organization.metadata?.default_terms || ''
  )
  const [defaultNotes, setDefaultNotes] = useState(
    organization.metadata?.default_notes || ''
  )
  const [emailSignature, setEmailSignature] = useState(
    organization.metadata?.email_signature || ''
  )

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be smaller than 2MB')
      return
    }

    setLogoFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('org_id', organization.id)
      formData.append('brand_color', brandColor)
      formData.append('invoice_prefix', invoicePrefix)
      formData.append('next_invoice_number', nextNumber.toString())
      formData.append('default_terms', defaultTerms)
      formData.append('default_notes', defaultNotes)
      formData.append('email_signature', emailSignature)

      if (logoFile) {
        formData.append('logo', logoFile)
      }

      const response = await fetch('/api/organizations/branding', {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update branding')
      }

      setSuccess(true)
      router.refresh()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error updating branding:', err)
      setError(err.message || 'Failed to update branding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 text-green-700 bg-green-50">
            <Check className="h-4 w-4" />
            <AlertDescription>Branding updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Logo Upload */}
        <Card className={isFreePlan ? 'border-slate-300' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>Logo</CardTitle>
                  {isFreePlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5">
                  {isFreePlan
                    ? 'Upload your company logo. (Requires Pro or Agency plan to appear on invoices)'
                    : 'Upload your company logo. This will appear on invoices and payment pages.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logoPreview && (
                <div className="flex items-center justify-center p-6 bg-slate-100 rounded-lg">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-32 max-w-full object-contain"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="logo" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-brand-orange transition-colors">
                    <Upload className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {logoFile ? logoFile.name : 'Choose logo file'}
                    </span>
                  </div>
                </Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="text-xs text-slate-500 mt-2">
                  PNG, JPG, or SVG. Max 2MB. Recommended: 500x200px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Color */}
        <Card className={isFreePlan ? 'border-slate-300' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>Brand Color</CardTitle>
                  {isFreePlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5">
                  {isFreePlan
                    ? 'Choose your primary brand color. (Requires Pro or Agency plan to appear on invoices)'
                    : 'Choose your primary brand color. This will be used throughout invoices and payment pages.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="brand_color">Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    id="brand_color"
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 font-mono"
                    placeholder="#EF4C23"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center w-24 h-24 rounded-lg border-2" style={{ backgroundColor: brandColor }}>
                <span className="text-xs font-medium text-white drop-shadow-lg">Preview</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Prefix */}
        <Card className={isFreePlan ? 'border-slate-300' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>Invoice Prefix</CardTitle>
                  {isFreePlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5">
                  {isFreePlan
                    ? 'Customize the prefix for your invoice numbers. (Requires Pro or Agency plan to appear on invoices)'
                    : 'Customize the prefix for your invoice numbers (e.g., INV-00001, BILL-00001)'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="invoice_prefix">Prefix</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="invoice_prefix"
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-32 font-mono font-medium"
                  placeholder="INV"
                />
                <span className="text-slate-400">-</span>
                <div className="px-3 py-2 bg-slate-100 rounded-md font-mono text-slate-600">
                  {nextNumber.toString().padStart(5, '0')}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Example: {invoicePrefix}-{nextNumber.toString().padStart(5, '0')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Invoice Number */}
        <Card>
          <CardHeader>
            <CardTitle>Next Invoice Number</CardTitle>
            <CardDescription>
              Set the starting number for your next invoice. Use this carefully to avoid duplicate numbers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="next_number">Next Number</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="next_number"
                  type="number"
                  min="1"
                  value={nextNumber}
                  onChange={(e) => setNextNumber(parseInt(e.target.value) || 1)}
                  className="w-32 font-mono font-medium"
                />
                <span className="text-slate-400">=</span>
                <div className="px-3 py-2 bg-slate-100 rounded-md font-mono text-slate-600">
                  {invoicePrefix}-{nextNumber.toString().padStart(5, '0')}
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Warning: Changing this number may cause conflicts with existing invoices. Only modify if you know what you're doing.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Default Invoice Terms */}
        <Card className={isFreePlan ? 'border-slate-300' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>Default Invoice Terms</CardTitle>
                  {isFreePlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5">
                  {isFreePlan
                    ? 'Set default payment terms that will appear on all new invoices. (Requires Pro or Agency plan)'
                    : 'Set default payment terms that will appear on all new invoices. You can edit these for individual invoices.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="default_terms">Payment Terms</Label>
              <textarea
                id="default_terms"
                value={defaultTerms}
                onChange={(e) => setDefaultTerms(e.target.value)}
                className="w-full mt-2 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[100px]"
                placeholder="Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly fee."
              />
              <p className="text-xs text-slate-500 mt-2">
                These terms will be automatically added to new invoices
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Default Invoice Notes */}
        <Card className={isFreePlan ? 'border-slate-300' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>Default Invoice Notes</CardTitle>
                  {isFreePlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5">
                  {isFreePlan
                    ? 'Add default notes or instructions that will appear on all new invoices. (Requires Pro or Agency plan)'
                    : 'Add default notes or instructions that will appear on all new invoices.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="default_notes">Invoice Notes</Label>
              <textarea
                id="default_notes"
                value={defaultNotes}
                onChange={(e) => setDefaultNotes(e.target.value)}
                className="w-full mt-2 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[100px]"
                placeholder="Thank you for your business! Please make payment via the link above or contact us with any questions."
              />
              <p className="text-xs text-slate-500 mt-2">
                These notes will appear at the bottom of new invoices
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Signature */}
        <Card className={isFreePlan ? 'border-slate-300' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>Email Signature</CardTitle>
                  {isFreePlan && (
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5">
                  {isFreePlan
                    ? 'Customize the signature that appears in invoice and payment notification emails. (Requires Pro or Agency plan)'
                    : 'Customize the signature that appears in invoice and payment notification emails.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="email_signature">Signature</Label>
              <textarea
                id="email_signature"
                value={emailSignature}
                onChange={(e) => setEmailSignature(e.target.value)}
                className="w-full mt-2 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[120px]"
                placeholder="Best regards,&#10;{organization.name}&#10;{contact_email}&#10;{phone_number}"
              />
              <p className="text-xs text-slate-500 mt-2">
                This signature will appear at the end of invoice and payment emails
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}
