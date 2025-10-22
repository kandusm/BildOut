const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdminAccess() {
  console.log('🔍 Checking Admin Access\n')

  // Get all users and their admin status
  const { data: users, error } = await supabase
    .from('users')
    .select('id, display_name, is_admin, org_id')
    .limit(10)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`Found ${users?.length || 0} users:\n`)

  users?.forEach((user, i) => {
    console.log(`${i + 1}. ${user.display_name || 'Unnamed'}`)
    console.log(`   User ID: ${user.id}`)
    console.log(`   Is Admin: ${user.is_admin ? '✅ YES' : '❌ NO'}`)
    console.log(`   Org ID: ${user.org_id}\n`)
  })

  const adminUsers = users?.filter(u => u.is_admin)

  if (!adminUsers || adminUsers.length === 0) {
    console.log('⚠️  No admin users found!')
    console.log('\n💡 To grant admin access, run this SQL in Supabase:')
    console.log(`   UPDATE users SET is_admin = true WHERE id = 'YOUR_USER_ID';`)
  } else {
    console.log(`✅ Found ${adminUsers.length} admin user(s)`)
  }
}

checkAdminAccess().catch(console.error)
