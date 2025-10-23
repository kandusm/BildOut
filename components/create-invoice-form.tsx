'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClientSelector } from '@/components/client-selector'
import { ItemSelector } from '@/components/item-selector'
import { Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
}

interface CreateInvoiceFormProps {
  orgId: string
  organization: any
  clients: any[]
  items: any[]
}

export function CreateInvoiceForm({ orgId, organization, clients, items }: CreateInvoiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<React.ReactNode | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [clientsList, setClientsList] = useState(clients)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
  ])
  const [taxRate, setTaxRate] = useState(organization?.default_tax_rate || 0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [terms, setTerms] = useState(organization?.metadata?.default_terms || '')
  const [notes, setNotes] = useState(organization?.metadata?.default_notes || '')

  const router = useRouter()

  // Validation logic
  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validate invoice date
    if (!invoiceDate) {
      errors.invoiceDate = 'Invoice date is required'
    }

    // Validate due date is after invoice date
    if (dueDate && invoiceDate && new Date(dueDate) < new Date(invoiceDate)) {
      errors.dueDate = 'Due date must be after invoice date'
    }

    // Validate line items
    lineItems.forEach((item, index) => {
      if (!item.description.trim()) {
        errors[`lineItem_${index}_description`] = 'Description is required'
      }
      if (item.quantity <= 0) {
        errors[`lineItem_${index}_quantity`] = 'Quantity must be greater than 0'
      }
      if (item.unit_price < 0) {
        errors[`lineItem_${index}_unit_price`] = 'Unit price cannot be negative'
      }
    })

    // Validate totals
    const total = calculateTotal()
    if (total < 0) {
      errors.total = 'Total cannot be negative. Check discount amount.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true })
    validateForm()
  }

  const refreshClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const newClients = await response.json()
        setClientsList(newClients)
      }
    } catch (error) {
      console.error('Failed to refresh clients:', error)
    }
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }])
  }

  const handleSelectItem = (item: any) => {
    const newLineItem: LineItem = {
      id: crypto.randomUUID(),
      description: item.description || item.name,
      quantity: 1,
      unit_price: item.unit_price,
    }
    setLineItems([...lineItems, newLineItem])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price)
    }, 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * (taxRate / 100)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    const discount = discountAmount
    return subtotal + tax - discount
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form before submitting
    if (!validateForm()) {
      setError('Please fix the errors in the form before submitting')
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {}
      lineItems.forEach((_, index) => {
        allTouched[`lineItem_${index}_description`] = true
        allTouched[`lineItem_${index}_quantity`] = true
        allTouched[`lineItem_${index}_unit_price`] = true
      })
      allTouched.invoiceDate = true
      allTouched.dueDate = true
      setTouched(allTouched)
      return
    }

    setLoading(true)

    try {
      const subtotal = calculateSubtotal()
      const tax = calculateTax(subtotal)
      const total = calculateTotal()

      const invoiceData = {
        org_id: orgId,
        client_id: selectedClientId || null,
        issue_date: invoiceDate,
        due_date: dueDate || null,
        subtotal: subtotal,
        tax_total: tax,
        discount_total: discountAmount,
        total: total,
        terms: terms || null,
        notes: notes || null,
        line_items: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
        })),
      }

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const data = await response.json()

        // Check if it's a subscription limit error
        if (data.upgradeRequired) {
          setError(
            <div>
              <p className="font-semibold mb-2">{data.error}</p>
              <p className="mb-3">{data.message}</p>
              <a
                href="/dashboard/settings/subscription"
                className="inline-block bg-brand-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-opacity"
              >
                Upgrade Plan
              </a>
            </div>
          )
        } else {
          throw new Error(data.error || 'Failed to create invoice')
        }
        setLoading(false)
        return
      }

      const invoice = await response.json()
      router.push(`/dashboard/invoices/${invoice.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Basic information about this invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <ClientSelector
                clients={clientsList}
                value={selectedClientId}
                onValueChange={setSelectedClientId}
                onClientCreated={refreshClients}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice_date" className="flex items-center gap-1">
                Invoice Date
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="invoice_date"
                type="date"
                value={invoiceDate}
                onChange={(e) => {
                  setInvoiceDate(e.target.value)
                  validateForm()
                }}
                onBlur={() => handleFieldBlur('invoiceDate')}
                required
                disabled={loading}
                className={touched.invoiceDate && validationErrors.invoiceDate ? 'border-red-500' : ''}
              />
              {touched.invoiceDate && validationErrors.invoiceDate && (
                <p className="text-xs text-red-600">{validationErrors.invoiceDate}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (optional)</Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  validateForm()
                }}
                onBlur={() => handleFieldBlur('dueDate')}
                disabled={loading}
                className={touched.dueDate && validationErrors.dueDate ? 'border-red-500' : ''}
              />
              {touched.dueDate && validationErrors.dueDate && (
                <p className="text-xs text-red-600">{validationErrors.dueDate}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add items or services to this invoice</CardDescription>
            </div>
            <div className="flex gap-2">
              <ItemSelector items={items} onSelectItem={handleSelectItem} />
              <Button type="button" variant="outline" size="sm" onClick={addLineItem} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Label className="flex items-center gap-1">
                    Description
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => {
                      updateLineItem(item.id, 'description', e.target.value)
                      validateForm()
                    }}
                    onBlur={() => handleFieldBlur(`lineItem_${index}_description`)}
                    required
                    disabled={loading}
                    className={touched[`lineItem_${index}_description`] && validationErrors[`lineItem_${index}_description`] ? 'border-red-500' : ''}
                  />
                  {touched[`lineItem_${index}_description`] && validationErrors[`lineItem_${index}_description`] && (
                    <p className="text-xs text-red-600">{validationErrors[`lineItem_${index}_description`]}</p>
                  )}
                </div>
                <div className="w-24 space-y-2">
                  <Label className="flex items-center gap-1">
                    Quantity
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => {
                      updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                      validateForm()
                    }}
                    onBlur={() => handleFieldBlur(`lineItem_${index}_quantity`)}
                    required
                    disabled={loading}
                    className={touched[`lineItem_${index}_quantity`] && validationErrors[`lineItem_${index}_quantity`] ? 'border-red-500' : ''}
                  />
                  {touched[`lineItem_${index}_quantity`] && validationErrors[`lineItem_${index}_quantity`] && (
                    <p className="text-xs text-red-600">{validationErrors[`lineItem_${index}_quantity`]}</p>
                  )}
                </div>
                <div className="w-32 space-y-2">
                  <Label className="flex items-center gap-1">
                    Unit Price
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => {
                      updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)
                      validateForm()
                    }}
                    onBlur={() => handleFieldBlur(`lineItem_${index}_unit_price`)}
                    required
                    disabled={loading}
                    className={touched[`lineItem_${index}_unit_price`] && validationErrors[`lineItem_${index}_unit_price`] ? 'border-red-500' : ''}
                  />
                  {touched[`lineItem_${index}_unit_price`] && validationErrors[`lineItem_${index}_unit_price`] && (
                    <p className="text-xs text-red-600">{validationErrors[`lineItem_${index}_unit_price`]}</p>
                  )}
                </div>
                <div className="w-32 space-y-2">
                  <Label>Total</Label>
                  <div className="h-10 flex items-center font-medium">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </div>
                </div>
                <div className="pt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1 || loading}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span>{formatCurrency(calculateTax(calculateSubtotal()))}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span className="text-red-600">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className={calculateTotal() < 0 ? 'text-red-600' : ''}>{formatCurrency(calculateTotal())}</span>
            </div>
            {validationErrors.total && (
              <p className="text-xs text-red-600 mt-2">{validationErrors.total}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="terms">Payment Terms</Label>
            <textarea
              id="terms"
              placeholder="Payment is due within 30 days of invoice date..."
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[80px] text-sm"
            />
            <p className="text-xs text-slate-500">
              These terms explain when and how payment should be made
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Invoice Notes</Label>
            <textarea
              id="notes"
              placeholder="Thank you for your business! Please make payment via the link above..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[80px] text-sm"
            />
            <p className="text-xs text-slate-500">
              Additional notes or instructions for the client
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" asChild disabled={loading}>
          <a href="/dashboard/invoices">Cancel</a>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  )
}
