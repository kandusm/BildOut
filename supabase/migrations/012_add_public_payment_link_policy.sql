-- Add RLS policy to allow public access to invoices via payment_link_token
-- This allows the /pay/[token] page to work without authentication

create policy "Public can view invoices via payment link"
  on public.invoices for select
  using (payment_link_token is not null);

-- Also need to allow public access to related tables when viewing via payment link

-- Invoice items: allow public SELECT if parent invoice has a payment_link_token
create policy "Public can view invoice items via payment link"
  on public.invoice_items for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.payment_link_token is not null
    )
  );

-- Payments: allow public SELECT for payments on invoices with payment_link_token
create policy "Public can view payments via payment link"
  on public.payments for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = payments.invoice_id
      and invoices.payment_link_token is not null
    )
  );

-- Organizations: allow public SELECT when accessed via invoice payment link
-- This is needed for the payment page to show organization name and logo
create policy "Public can view org details via payment link"
  on public.organizations for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.org_id = organizations.id
      and invoices.payment_link_token is not null
    )
  );

-- Clients: allow public SELECT when accessed via invoice payment link
-- This is needed for the payment page to show client name
create policy "Public can view client details via payment link"
  on public.clients for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.client_id = clients.id
      and invoices.payment_link_token is not null
    )
  );

-- Users: allow public SELECT for stripe_connect_id when accessed via payment link
-- This is needed for the payment intent API to get the merchant's Stripe Connect account
create policy "Public can view user stripe info via payment link"
  on public.users for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.org_id = users.org_id
      and invoices.payment_link_token is not null
    )
  );
