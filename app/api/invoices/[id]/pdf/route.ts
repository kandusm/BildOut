import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('org_id, organizations!users_org_id_fkey(*)')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch invoice with client and line items
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          email,
          phone,
          address
        ),
        invoice_items (
          *
        )
      `)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Get organization subscription plan
    const organization = profile.organizations as any
    const subscriptionPlan = organization?.subscription_plan || 'free'

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      InvoicePDF({
        invoice: invoice as any,
        organization: organization,
        subscriptionPlan: subscriptionPlan,
      })
    )

    // Upload to Supabase Storage
    const fileName = `invoice-${invoice.number}-${Date.now()}.pdf`
    const filePath = `${profile.org_id}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('invoices')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 })
    }

    // Generate signed URL (valid for 7 days)
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('invoices')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError)
      return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
    }

    // Update invoice with PDF URL
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ pdf_url: signedUrlData.signedUrl })
      .eq('id', id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: signedUrlData.signedUrl,
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('org_id, organizations!users_org_id_fkey(*)')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch invoice with client and line items
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          email,
          phone,
          address
        ),
        invoice_items (
          *
        )
      `)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Get organization subscription plan
    const organization = profile.organizations as any
    const subscriptionPlan = organization?.subscription_plan || 'free'

    // Generate PDF and return as stream
    const pdfBuffer = await renderToBuffer(
      InvoicePDF({
        invoice: invoice as any,
        organization: organization,
        subscriptionPlan: subscriptionPlan,
      })
    )

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
