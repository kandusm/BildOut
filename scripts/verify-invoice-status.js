require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Check the status of invoice 999999
  const { data, error } = await supabase
    .from('invoices')
    .select('number, status, due_date, total, clients(name, email), organizations(name)')
    .eq('number', '999999')
    .single();

  if (error) {
    console.error('Error fetching invoice:', error);
    return;
  }

  console.log('\n=== Invoice 999999 Status ===');
  console.log(`Invoice Number: ${data.number}`);
  console.log(`Status: ${data.status}`);
  console.log(`Due Date: ${data.due_date}`);
  console.log(`Total: $${data.total}`);
  console.log(`Client: ${data.clients?.name} (${data.clients?.email})`);
  console.log(`Organization: ${data.organizations?.name}`);

  if (data.status === 'overdue') {
    console.log('\n✓ SUCCESS: Invoice status was correctly updated to "overdue"');
  } else {
    console.log(`\n✗ FAILED: Invoice status is still "${data.status}" (expected "overdue")`);
  }
}

main().catch(console.error);
