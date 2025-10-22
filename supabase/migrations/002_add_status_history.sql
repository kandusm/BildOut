-- ============================================
-- Migration 002: Add Status History Tracking
-- ============================================

-- Create invoice status history table
create table public.invoice_status_history (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  from_status invoice_status,
  to_status invoice_status not null,
  changed_at timestamptz not null default now(),
  changed_by uuid references auth.users (id),
  notes text,
  metadata jsonb default '{}'::jsonb
);

create index invoice_status_history_invoice_id_idx on public.invoice_status_history (invoice_id);
create index invoice_status_history_changed_at_idx on public.invoice_status_history (changed_at desc);

comment on table public.invoice_status_history is 'Tracks all status transitions for invoices';
comment on column public.invoice_status_history.from_status is 'Previous status (null on creation)';
comment on column public.invoice_status_history.to_status is 'New status';
comment on column public.invoice_status_history.changed_by is 'User who made the change (null for system changes)';

-- Enable RLS
alter table public.invoice_status_history enable row level security;

-- RLS policy: can access history for invoices in their org
create policy "Users can view status history for their org invoices"
  on public.invoice_status_history for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_status_history.invoice_id
      and invoices.org_id = public.get_user_org_id()
    )
  );

-- Function to track status changes
create or replace function public.track_invoice_status_change()
returns trigger as $$
begin
  -- Only track if status actually changed
  if (TG_OP = 'INSERT') or (OLD.status is distinct from NEW.status) then
    insert into public.invoice_status_history (
      invoice_id,
      from_status,
      to_status,
      changed_by
    ) values (
      NEW.id,
      case when TG_OP = 'INSERT' then null else OLD.status end,
      NEW.status,
      auth.uid()
    );
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically track status changes
create trigger track_invoice_status_changes
  after insert or update on public.invoices
  for each row
  execute function public.track_invoice_status_change();

comment on function public.track_invoice_status_change is 'Automatically records invoice status transitions';
