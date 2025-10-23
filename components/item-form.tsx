'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

interface ItemFormProps {
  item: any // null for new items
}

export function ItemForm({ item }: ItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(item?.name || '')
  const [description, setDescription] = useState(item?.description || '')
  const [unitPrice, setUnitPrice] = useState(item?.unit_price?.toString() || '')

  const isNewItem = !item

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isNewItem ? '/api/items' : `/api/items/${item.id}`
      const method = isNewItem ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          unit_price: parseFloat(unitPrice),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${isNewItem ? 'create' : 'update'} item`)
      }

      const savedItem = await response.json()

      // Redirect to items table for both create and update
      router.push('/dashboard/items')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${item.name}? This cannot be undone.`)) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete item')
      }

      router.push('/dashboard/items')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          placeholder="e.g., Consulting Hour, Website Design"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder="Optional description for this item"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit_price">Unit Price *</Label>
        <Input
          id="unit_price"
          type="number"
          min="0"
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
          disabled={loading}
          placeholder="0.00"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-4 justify-between pt-4">
        {!isNewItem && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Item
          </Button>
        )}
        <div className="flex gap-4 ml-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/items')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (isNewItem ? 'Creating...' : 'Saving...') : (isNewItem ? 'Create Item' : 'Save Changes')}
          </Button>
        </div>
      </div>
    </form>
  )
}
