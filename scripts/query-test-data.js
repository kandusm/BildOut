require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Get organizations and clients
  const { data: orgsData, error: orgsError } = await supabase
    .from('organizations')
    .select('id, name, clients(id, name, email)')
    .limit(5);

  if (orgsError) {
    console.error('Error fetching organizations:', orgsError);
    return;
  }

  console.log('\n=== Organizations and Clients ===');
  orgsData.forEach(org => {
    console.log(`\nOrg: ${org.name} (${org.id})`);
    if (org.clients && org.clients.length > 0) {
      org.clients.forEach(client => {
        console.log(`  Client: ${client.name} (${client.id}) - ${client.email || 'No email'}`);
      });
    } else {
      console.log('  No clients found');
    }
  });

  // Check for existing overdue invoices
  const { data: overdueData, error: overdueError } = await supabase
    .from('invoices')
    .select('number, status, due_date, total, clients(name, email), organizations(name)')
    .in('status', ['sent', 'viewed', 'partial'])
    .lt('due_date', new Date().toISOString().split('T')[0])
    .is('deleted_at', null);

  if (overdueError) {
    console.error('\nError fetching overdue invoices:', overdueError);
    return;
  }

  console.log('\n=== Existing Overdue Invoices ===');
  if (overdueData && overdueData.length > 0) {
    overdueData.forEach(invoice => {
      console.log(`Invoice ${invoice.number}: ${invoice.status}, Due: ${invoice.due_date}, Total: $${invoice.total}`);
      console.log(`  Client: ${invoice.clients?.name} (${invoice.clients?.email || 'No email'})`);
      console.log(`  Organization: ${invoice.organizations?.name}`);
    });
  } else {
    console.log('No overdue invoices found');
  }
}

main().catch(console.error);
