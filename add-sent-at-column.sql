-- Add sent_at column to invoices table to track when invoice was sent to client
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sent_at timestamptz;

-- Add comment to document the column
COMMENT ON COLUMN invoices.sent_at IS 'Timestamp when the invoice was sent to the client via email';
