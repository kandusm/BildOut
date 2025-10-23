import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const sql = `
    -- Add default_tax_rate column to organizations table
    alter table public.organizations
    add column if not exists default_tax_rate numeric(5,2) default 0 check (default_tax_rate >= 0 and default_tax_rate <= 100);
  `

  const { data, error } = await supabase.rpc('exec_sql', { sql })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Migration applied', data })
}
