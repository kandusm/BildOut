-- Fix currency data: convert from cents to dollars
-- This script divides all currency values by 100 to match the numeric(12,2) schema

BEGIN;

-- Update invoices table
UPDATE invoices
SET
  subtotal = subtotal / 100,
  tax_total = tax_total / 100,
  discount_total = discount_total / 100,
  total = total / 100,
  amount_paid = amount_paid / 100,
  amount_due = amount_due / 100
WHERE subtotal > 100 OR tax_total > 100 OR total > 100; -- Only update if values look like cents

-- Update invoice_items table
UPDATE invoice_items
SET
  unit_price = unit_price / 100,
  line_total = line_total / 100
WHERE unit_price > 100 OR line_total > 100; -- Only update if values look like cents

-- Update items table (if it has prices stored)
UPDATE items
SET
  unit_price = unit_price / 100
WHERE unit_price > 100; -- Only update if values look like cents

COMMIT;

-- Verify the changes
SELECT 'Invoices' as table_name, id, number, subtotal, tax_total, total
FROM invoices
ORDER BY created_at DESC
LIMIT 5;

SELECT 'Invoice Items' as table_name, id, name, quantity, unit_price, line_total
FROM invoice_items
ORDER BY created_at DESC
LIMIT 5;
