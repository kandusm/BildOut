import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkClientLimit } from '@/lib/subscription/check-limits'

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

    // Fetch clients for this organization
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .order('name')

    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(clients)
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clients' },
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

    // Check client limit for subscription plan
    const limitCheck = await checkClientLimit(profile.org_id)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Client limit reached',
          message: `You've reached your plan's limit of ${limitCheck.limit} clients. Upgrade to Pro for unlimited clients.`,
          limit: limitCheck.limit,
          current: limitCheck.current,
          plan: limitCheck.plan,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Create client
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        org_id: profile.org_id,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(client)
  } catch (error: any) {
    console.error('Client creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create client' },
      { status: 500 }
    )
  }
}
