/**
 * API Limits Testing Script
 *
 * Tests the actual API endpoints to verify subscription limits are enforced
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAPILimits() {
  console.log('🧪 API Limits Testing\n')
  console.log('=' .repeat(60))

  // Test org that has hit the limit (CommComms - 10/10 invoices)
  const limitedOrgId = '1257f168-9e11-4d33-8862-bb7446507416' // CommComms

  console.log('\n📋 Test 1: Invoice Limit Enforcement')
  console.log('Organization: CommComms (10/10 invoices)\n')

  // Get a user from this org for authentication
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('org_id', limitedOrgId)
    .limit(1)

  if (!users || users.length === 0) {
    console.log('⚠️  No users found for this org, skipping API test')
    console.log('   Manual testing required in the browser\n')
  } else {
    const userId = users[0].id
    console.log(`   Using user ID: ${userId}`)

    // Get a client for the invoice
    const { data: clients } = await supabase
      .from('clients')
      .select('id')
      .eq('org_id', limitedOrgId)
      .is('deleted_at', null)
      .limit(1)

    const clientId = clients?.[0]?.id || null

    // Prepare invoice data
    const invoiceData = {
      org_id: limitedOrgId,
      client_id: clientId,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: null,
      subtotal: 100.00,
      tax_total: 0,
      discount_total: 0,
      total: 100.00,
      notes: 'Test invoice for limit testing',
      line_items: [
        {
          description: 'Test Item',
          quantity: 1,
          unit_price: 100.00,
          total_price: 100.00
        }
      ]
    }

    // Try to create invoice via API (simulating what the form does)
    console.log('\n   Attempting to create invoice via API...')

    try {
      const response = await fetch('http://localhost:3001/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}` // Using service key for testing
        },
        body: JSON.stringify(invoiceData)
      })

      const data = await response.json()

      if (response.status === 403 && data.upgradeRequired) {
        console.log('\n   ✅ LIMIT ENFORCEMENT WORKING!')
        console.log('\n   Response:')
        console.log('   ┌─────────────────────────────────────────')
        console.log(`   │ Status: ${response.status} Forbidden`)
        console.log(`   │ Error: ${data.error}`)
        console.log(`   │ Message: ${data.message}`)
        console.log(`   │ Limit: ${data.limit}`)
        console.log(`   │ Current: ${data.current}`)
        console.log(`   │ Plan: ${data.plan}`)
        console.log(`   │ upgradeRequired: ${data.upgradeRequired}`)
        console.log('   └─────────────────────────────────────────')
      } else if (response.ok) {
        console.log('\n   ⚠️  WARNING: Invoice was created despite limit!')
        console.log(`   Invoice ID: ${data.id}`)
        console.log('   This suggests the limit check is not working')
      } else {
        console.log(`\n   ❌ Unexpected response: ${response.status}`)
        console.log('   Data:', data)
      }
    } catch (error) {
      console.log('\n   ❌ API Error:', error.message)
      console.log('   Note: Make sure dev server is running on port 3001')
    }
  }

  // Test org that is under the limit
  console.log('\n' + '='.repeat(60))
  console.log('\n📋 Test 2: Under Limit (Should Allow Creation)')
  console.log('Organization: PopSocket (4/10 invoices)\n')

  const underLimitOrgId = 'c03994cb-1df6-4496-aea8-69d0f291264a' // PopSocket

  const { data: users2 } = await supabase
    .from('users')
    .select('id')
    .eq('org_id', underLimitOrgId)
    .limit(1)

  if (!users2 || users2.length === 0) {
    console.log('⚠️  No users found for this org, skipping API test\n')
  } else {
    const { data: clients2 } = await supabase
      .from('clients')
      .select('id')
      .eq('org_id', underLimitOrgId)
      .is('deleted_at', null)
      .limit(1)

    const invoiceData2 = {
      org_id: underLimitOrgId,
      client_id: clients2?.[0]?.id || null,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: null,
      subtotal: 50.00,
      tax_total: 0,
      discount_total: 0,
      total: 50.00,
      notes: 'Test invoice - should succeed',
      line_items: [
        {
          description: 'Test Item 2',
          quantity: 1,
          unit_price: 50.00,
          total_price: 50.00
        }
      ]
    }

    console.log('   Attempting to create invoice (should succeed)...\n')

    try {
      const response = await fetch('http://localhost:3001/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify(invoiceData2)
      })

      const data = await response.json()

      if (response.ok) {
        console.log('   ✅ SUCCESS: Invoice created (as expected)')
        console.log(`   Invoice Number: ${data.number}`)
        console.log(`   Invoice ID: ${data.id}`)
      } else if (response.status === 403 && data.upgradeRequired) {
        console.log('   ❌ ERROR: Got limit error but org is under limit!')
        console.log(`   Current: ${data.current}, Limit: ${data.limit}`)
      } else {
        console.log(`   ⚠️  Unexpected response: ${response.status}`)
        console.log('   Data:', data)
      }
    } catch (error) {
      console.log('   ❌ API Error:', error.message)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n✅ API Testing Complete\n')
}

testAPILimits().catch(console.error)
