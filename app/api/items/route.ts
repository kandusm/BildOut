import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
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

    // Fetch items for this organization
    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .order('name')

    if (error) {
      console.error('Error fetching items:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(items)
  } catch (error: any) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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

    // Create item
    const { data: item, error } = await supabase
      .from('items')
      .insert({
        org_id: profile.org_id,
        name,
        description: description || null,
        unit_price: parseFloat(unit_price),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create item' },
      { status: 500 }
    )
  }
}
