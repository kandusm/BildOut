/**
 * Subscription Limits Testing Script
 *
 * This script helps test subscription feature gates by:
 * 1. Checking current subscription plan
 * 2. Counting existing invoices (this month) and clients
 * 3. Testing limit enforcement
 *
 * Run: node test-subscription-limits.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testSubscriptionLimits() {
  console.log('🧪 Subscription Limits Testing\n')
  console.log('=' .repeat(60))

  // 1. Get all organizations and their plans
  console.log('\n📋 Step 1: Fetching Organizations\n')
  const { data: orgs, error: orgsError } = await supabase
    .from('organizations')
    .select('id, name, subscription_plan')
    .limit(10)

  if (orgsError) {
    console.error('❌ Error fetching organizations:', orgsError)
    return
  }

  if (!orgs || orgs.length === 0) {
    console.log('⚠️  No organizations found')
    return
  }

  console.log(`Found ${orgs.length} organization(s):\n`)
  orgs.forEach((org, i) => {
    console.log(`${i + 1}. ${org.name}`)
    console.log(`   ID: ${org.id}`)
    console.log(`   Plan: ${org.subscription_plan || 'free'}\n`)
  })

  // 2. For each org, check limits
  for (const org of orgs) {
    console.log('=' .repeat(60))
    console.log(`\n📊 Testing Limits for: ${org.name}`)
    console.log(`   Plan: ${org.subscription_plan || 'free'}\n`)

    // Invoice count (this month)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: invoiceCount, error: invoiceError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', org.id)
      .gte('created_at', startOfMonth.toISOString())

    if (invoiceError) {
      console.error('   ❌ Error counting invoices:', invoiceError)
    } else {
      const plan = org.subscription_plan || 'free'
      const limit = plan === 'free' ? 10 : null
      const limitText = limit ? `${limit}` : 'unlimited'
      const status = limit && invoiceCount >= limit ? '🚫 LIMIT REACHED' : '✅ OK'

      console.log(`   📄 Invoices (this month): ${invoiceCount} / ${limitText} ${status}`)
    }

    // Client count
    const { count: clientCount, error: clientError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', org.id)
      .is('deleted_at', null)

    if (clientError) {
      console.error('   ❌ Error counting clients:', clientError)
    } else {
      const plan = org.subscription_plan || 'free'
      const limit = plan === 'free' ? 5 : null
      const limitText = limit ? `${limit}` : 'unlimited'
      const status = limit && clientCount >= limit ? '🚫 LIMIT REACHED' : '✅ OK'

      console.log(`   👥 Clients: ${clientCount} / ${limitText} ${status}`)
    }

    console.log('')
  }

  console.log('=' .repeat(60))
  console.log('\n✅ Test Complete\n')

  // 3. Recommendations
  console.log('📝 Testing Recommendations:\n')

  const freeOrgs = orgs.filter(o => !o.subscription_plan || o.subscription_plan === 'free')
  if (freeOrgs.length > 0) {
    console.log('To test Free plan limits:')
    const testOrg = freeOrgs[0]
    console.log(`  1. Use organization: ${testOrg.name} (${testOrg.id})`)
    console.log(`  2. Create invoices until you reach 10`)
    console.log(`  3. Try creating an 11th invoice - should see upgrade prompt`)
    console.log(`  4. Create clients until you reach 5`)
    console.log(`  5. Try creating a 6th client - should see upgrade prompt\n`)
  }

  const proOrgs = orgs.filter(o => o.subscription_plan === 'pro' || o.subscription_plan === 'agency')
  if (proOrgs.length > 0) {
    console.log('To test Pro/Agency unlimited access:')
    const testOrg = proOrgs[0]
    console.log(`  1. Use organization: ${testOrg.name} (${testOrg.id})`)
    console.log(`  2. Create more than 10 invoices - should all succeed`)
    console.log(`  3. Create more than 5 clients - should all succeed\n`)
  }

  if (freeOrgs.length === 0) {
    console.log('💡 To test Free plan limits, update an organization:')
    console.log(`   UPDATE organizations SET subscription_plan = 'free' WHERE id = 'org-id';\n`)
  }
}

testSubscriptionLimits().catch(console.error)
