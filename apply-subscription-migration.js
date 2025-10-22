/**
 * Apply Subscription Migration
 *
 * This script applies the subscription_plan column to the organizations table
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('🔧 Applying Subscription Migration\n')

  // Read the migration file
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20251016_add_subscription_fields.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  console.log('📄 Migration SQL:')
  console.log(migrationSQL)
  console.log('\n' + '='.repeat(60) + '\n')

  // Split by semicolons and execute each statement
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Executing ${statements.length} SQL statements...\n`)

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    console.log(`${i + 1}. ${stmt.substring(0, 60)}...`)

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: stmt })

      if (error) {
        // Try direct execution as fallback
        console.log('   Retrying with direct query...')
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sql_query: stmt })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`   ❌ Error: ${errorText}`)
        } else {
          console.log('   ✅ Success')
        }
      } else {
        console.log('   ✅ Success')
      }
    } catch (err) {
      console.error(`   ❌ Error:`, err.message)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n✅ Migration application complete!\n')
  console.log('Running verification...\n')

  // Verify the columns were added
  const { data: orgs, error } = await supabase
    .from('organizations')
    .select('id, name, subscription_plan')
    .limit(1)

  if (error) {
    console.error('⚠️  Verification failed:', error.message)
    console.log('\n💡 Manual migration required. Run this SQL in Supabase SQL Editor:')
    console.log('\n' + migrationSQL + '\n')
  } else {
    console.log('✅ Verification successful!')
    console.log('   Organizations table now has subscription_plan column')
    if (orgs && orgs.length > 0) {
      console.log(`   Sample org: ${orgs[0].name} - Plan: ${orgs[0].subscription_plan || 'free'}`)
    }
  }
}

applyMigration().catch(console.error)
