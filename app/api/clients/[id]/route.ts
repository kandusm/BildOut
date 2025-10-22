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

    // Fetch client with invoice count
    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        *,
        invoices (count)
      `)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (error || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error: any) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client' },
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
    const { name, email, phone, address } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Client name is required' },
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

    // Verify client belongs to user's org
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Update client
    const { data: client, error } = await supabase
      .from('clients')
      .update({
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(client)
  } catch (error: any) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update client' },
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

    // Verify client belongs to user's org
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Soft delete the client
    const { error } = await supabase
      .from('clients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error deleting client:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete client' },
      { status: 500 }
    )
  }
}
