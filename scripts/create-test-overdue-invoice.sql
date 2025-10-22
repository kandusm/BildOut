-- Create a test overdue invoice
-- This script helps you create a test invoice that is already overdue for testing the cron job

-- Step 1: Find your organization ID and a client ID
-- Run this first to get the IDs you need:
SELECT
  o.id as organization_id,
  o.name as organization_name,
  c.id as client_id,
  c.name as client_name,
  c.email as client_email
FROM organizations o
JOIN clients c ON c.organization_id = o.id
LIMIT 5;

-- Step 2: Create a test overdue invoice
-- Replace the VALUES below with your actual organization_id and client_id from Step 1
-- The due_date is set to 7 days ago to make it overdue

INSERT INTO invoices (
  organization_id,
  client_id,
  number,
  issue_date,
  due_date,
  status,
  subtotal,
  tax,
  total,
  amount_due,
  currency,
  payment_link_token,
  created_at,
  updated_at
) VALUES (
  'YOUR_ORGANIZATION_ID_HERE',  -- Replace with actual organization_id
  'YOUR_CLIENT_ID_HERE',         -- Replace with actual client_id
  999999,                         -- Test invoice number
  CURRENT_DATE - INTERVAL '10 days',  -- Issued 10 days ago
  CURRENT_DATE - INTERVAL '7 days',   -- Due 7 days ago (OVERDUE!)
  'sent',                         -- Status must be 'sent', 'viewed', or 'partial'
  100.00,
  10.00,
  110.00,
  110.00,
  'USD',
  'test_' || gen_random_uuid(),   -- Generate random payment link token
  NOW(),
  NOW()
);

-- Step 3: Verify the overdue invoice was created
SELECT
  i.number,
  i.status,
  i.due_date,
  i.total,
  c.name as client_name,
  c.email as client_email,
  o.name as organization_name
FROM invoices i
JOIN clients c ON c.id = i.client_id
JOIN organizations o ON o.id = i.organization_id
WHERE i.status IN ('sent', 'viewed', 'partial')
  AND i.due_date < CURRENT_DATE
  AND i.deleted_at IS NULL;
