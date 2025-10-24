-- Add sent_at timestamp column to invoices table
-- This tracks when an invoice was sent to the client

alter table public.invoices
add column sent_at timestamptz;

comment on column public.invoices.sent_at is 'Timestamp when invoice was sent to client';
