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

interface EditInvoiceFormProps {
  invoice: any
  clients: any[]
  items: any[]
  orgId: string
}

export function EditInvoiceForm({ invoice, clients, items, orgId }: EditInvoiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill form with existing invoice data
  const [selectedClientId, setSelectedClientId] = useState<string>(invoice.client_id || '')
  const [clientsList, setClientsList] = useState(clients)
  const [invoiceDate, setInvoiceDate] = useState(invoice.issue_date)
  const [dueDate, setDueDate] = useState(invoice.due_date || '')
  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice.invoice_items.map((item: any) => ({
      id: item.id,
      description: item.name || item.description,
      quantity: parseFloat(item.quantity),
      unit_price: parseFloat(item.unit_price), // Database stores as dollars already
    }))
  )

  // Calculate tax rate from existing invoice data
  const calculateInitialTaxRate = () => {
    if (invoice.subtotal > 0 && invoice.tax_total > 0) {
      // Calculate percentage and round to 2 decimal places
      const percentage = (parseFloat(invoice.tax_total) / parseFloat(invoice.subtotal)) * 100
      return Math.round(percentage * 100) / 100
    }
    return 0
  }

  const [taxRate, setTaxRate] = useState(calculateInitialTaxRate())
  const [discountAmount, setDiscountAmount] = useState(parseFloat(invoice.discount_total) || 0) // Database stores as dollars
  const [notes, setNotes] = useState(invoice.notes || '')

  const router = useRouter()

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
    setLoading(true)
    setError(null)

    try {
      const subtotal = calculateSubtotal()
      const tax = calculateTax(subtotal)
      const total = calculateTotal()

      const invoiceData = {
        client_id: selectedClientId || null,
        issue_date: invoiceDate,
        due_date: dueDate || null,
        subtotal: subtotal,
        tax_total: tax,
        discount_total: discountAmount,
        total: total,
        notes: notes || null,
        line_items: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
        })),
      }

      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update invoice')
      }

      router.push(`/dashboard/invoices/${invoice.id}`)
      router.refresh()
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
          <CardDescription>Update information about this invoice</CardDescription>
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
              <Label htmlFor="invoice_date">Invoice Date</Label>
              <Input
                id="invoice_date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Update items or services on this invoice</CardDescription>
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
                  <Label>Description</Label>
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                    required
                    disabled={loading}
                  />
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
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Add any notes or payment instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
