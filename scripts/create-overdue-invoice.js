require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const organizationId = '1257f168-9e11-4d33-8862-bb7446507416'; // CommComms
  const clientId = 'b5bea103-555e-4eb1-84ec-60a42152cf63'; // Billy Bob

  // Calculate dates
  const today = new Date();
  const issueDate = new Date(today);
  issueDate.setDate(issueDate.getDate() - 10); // 10 days ago

  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() - 7); // 7 days ago (overdue!)

  const invoice = {
    org_id: organizationId,
    client_id: clientId,
    number: '999999',
    issue_date: issueDate.toISOString().split('T')[0],
    due_date: dueDate.toISOString().split('T')[0],
    status: 'sent',
    subtotal: 100.00,
    tax_total: 10.00,
    total: 110.00,
    amount_due: 110.00,
    currency: 'usd',
    payment_link_token: `test_${Math.random().toString(36).substring(7)}`,
  };

  console.log('Creating test overdue invoice...');
  console.log(`Issue Date: ${invoice.issue_date}`);
  console.log(`Due Date: ${invoice.due_date} (overdue by 7 days)`);
  console.log(`Status: ${invoice.status}`);
  console.log(`Total: $${invoice.total}`);

  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select();

  if (error) {
    console.error('\nError creating invoice:', error);
    return;
  }

  console.log('\n✓ Test invoice created successfully!');
  console.log('Invoice ID:', data[0].id);
  console.log('Invoice Number:', data[0].number);

  // Verify the overdue invoice
  const { data: overdueData, error: overdueError } = await supabase
    .from('invoices')
    .select('number, status, due_date, total, clients(name, email), organizations(name)')
    .in('status', ['sent', 'viewed', 'partial'])
    .lt('due_date', today.toISOString().split('T')[0])
    .is('deleted_at', null);

  if (overdueError) {
    console.error('\nError verifying overdue invoices:', overdueError);
    return;
  }

  console.log('\n=== Overdue Invoices Ready for Testing ===');
  if (overdueData && overdueData.length > 0) {
    overdueData.forEach(invoice => {
      console.log(`\nInvoice ${invoice.number}:`);
      console.log(`  Status: ${invoice.status}`);
      console.log(`  Due Date: ${invoice.due_date}`);
      console.log(`  Total: $${invoice.total}`);
      console.log(`  Client: ${invoice.clients?.name} (${invoice.clients?.email || 'No email'})`);
      console.log(`  Organization: ${invoice.organizations?.name}`);
    });
  }
}

main().catch(console.error);
