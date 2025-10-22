-- Step 1: Check for existing data
SELECT
  'Organization Count: ' || COUNT(*)::text as info
FROM organizations
UNION ALL
SELECT
  'Client Count: ' || COUNT(*)::text
FROM clients
UNION ALL
SELECT
  'Existing Overdue Invoices: ' || COUNT(*)::text
FROM invoices
WHERE status IN ('sent', 'viewed', 'partial')
  AND due_date < CURRENT_DATE
  AND deleted_at IS NULL;

-- Step 2: Get first organization and client (for creating test invoice)
DO $$
DECLARE
  v_org_id UUID;
  v_client_id UUID;
  v_payment_token TEXT;
BEGIN
  -- Get first organization
  SELECT id INTO v_org_id FROM organizations LIMIT 1;

  -- Get first client for that organization
  SELECT id INTO v_client_id FROM clients WHERE organization_id = v_org_id LIMIT 1;

  -- Generate payment token
  v_payment_token := 'test_' || gen_random_uuid()::text;

  -- Create test overdue invoice only if we have org and client
  IF v_org_id IS NOT NULL AND v_client_id IS NOT NULL THEN
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
      v_org_id,
      v_client_id,
      999999,
      CURRENT_DATE - INTERVAL '10 days',
      CURRENT_DATE - INTERVAL '7 days',
      'sent',
      100.00,
      10.00,
      110.00,
      110.00,
      'USD',
      v_payment_token,
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Test overdue invoice created with number 999999';
  ELSE
    RAISE NOTICE 'Could not create test invoice - missing organization or client data';
  END IF;
END $$;

-- Step 3: Verify overdue invoices
SELECT
  i.number,
  i.status,
  i.due_date,
  i.total,
  i.amount_due,
  c.name as client_name,
  c.email as client_email,
  o.name as organization_name
FROM invoices i
JOIN clients c ON c.id = i.client_id
JOIN organizations o ON o.id = i.organization_id
WHERE i.status IN ('sent', 'viewed', 'partial')
  AND i.due_date < CURRENT_DATE
  AND i.deleted_at IS NULL
ORDER BY i.due_date ASC;
