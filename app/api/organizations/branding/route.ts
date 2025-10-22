import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const orgId = formData.get('org_id') as string
    const brandColor = formData.get('brand_color') as string
    const invoicePrefix = formData.get('invoice_prefix') as string
    const nextInvoiceNumberStr = formData.get('next_invoice_number') as string
    const nextInvoiceNumber = nextInvoiceNumberStr ? parseInt(nextInvoiceNumberStr) : null
    const defaultTerms = formData.get('default_terms') as string
    const defaultNotes = formData.get('default_notes') as string
    const emailSignature = formData.get('email_signature') as string
    const logoFile = formData.get('logo') as File | null

    // Verify user belongs to this org
    if (profile.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Handle next invoice number change
    // Note: Invoice numbers are determined dynamically by finding the max existing number,
    // so we need to create a "placeholder" invoice to set the sequence
    if (nextInvoiceNumber !== null) {
      // Get the highest current invoice number
      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('number')
        .eq('org_id', orgId)
        .order('number', { ascending: false })
        .limit(1)
        .maybeSingle()

      const currentNextNumber = lastInvoice ? parseInt(lastInvoice.number) + 1 : 1

      // If user wants to skip numbers (e.g., go from 5 to 100), we need to update the last invoice number
      if (nextInvoiceNumber > currentNextNumber) {
        // Delete any existing placeholder invoices
        await supabase
          .from('invoices')
          .delete()
          .eq('org_id', orgId)
          .eq('status', 'draft')
          .is('client_id', null)
          .eq('total', 0)
          .lt('number', nextInvoiceNumber.toString().padStart(5, '0'))

        // Create a placeholder invoice with the number just before the desired next number
        const placeholderNumber = (nextInvoiceNumber - 1).toString().padStart(5, '0')
        const crypto = require('crypto')

        await supabase
          .from('invoices')
          .insert({
            org_id: orgId,
            number: placeholderNumber,
            status: 'void',
            issue_date: new Date().toISOString().split('T')[0],
            subtotal: 0,
            tax_total: 0,
            discount_total: 0,
            total: 0,
            amount_paid: 0,
            amount_due: 0,
            payment_link_token: crypto.randomUUID(),
            notes: 'Placeholder invoice to set invoice number sequence',
          })
      } else if (nextInvoiceNumber < currentNextNumber) {
        return NextResponse.json({
          error: `Cannot set next invoice number below ${currentNextNumber}. This would create duplicate invoice numbers.`
        }, { status: 400 })
      }
    }

    let logoUrl: string | null = null

    // Handle logo upload
    if (logoFile) {
      // Generate unique filename
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${orgId}/logo-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, logoFile, {
          contentType: logoFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Error uploading logo:', uploadError)
        return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

      logoUrl = urlData.publicUrl
    }

    // Update organization branding
    const updateData: any = {
      metadata: {
        brand_color: brandColor,
        invoice_prefix: invoicePrefix,
        default_terms: defaultTerms,
        default_notes: defaultNotes,
        email_signature: emailSignature,
      },
    }

    if (logoUrl) {
      updateData.logo_url = logoUrl
    }

    const { error: updateError } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', orgId)

    if (updateError) {
      console.error('Error updating organization:', updateError)
      return NextResponse.json({ error: 'Failed to update branding' }, { status: 500 })
    }

    return NextResponse.json({ success: true, logo_url: logoUrl })
  } catch (error: any) {
    console.error('Branding update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update branding' },
      { status: 500 }
    )
  }
}
