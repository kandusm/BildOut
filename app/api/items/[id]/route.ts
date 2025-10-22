import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch item
    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (error || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, unit_price } = body

    // Validate required fields
    if (!name || unit_price === undefined) {
      return NextResponse.json(
        { error: 'Item name and unit price are required' },
        { status: 400 }
      )
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify item belongs to user's org
    const { data: existingItem } = await supabase
      .from('items')
      .select('id')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Update item
    const { data: item, error } = await supabase
      .from('items')
      .update({
        name,
        description: description || null,
        unit_price: parseFloat(unit_price),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify item belongs to user's org
    const { data: existingItem } = await supabase
      .from('items')
      .select('id')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Soft delete the item
    const { error } = await supabase
      .from('items')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error deleting item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete item' },
      { status: 500 }
    )
  }
}
