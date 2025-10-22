-- Add metadata column to organizations table (if not exists)
alter table public.organizations
add column if not exists metadata jsonb default '{}'::jsonb;

-- Create storage bucket for logos
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Storage policies for logos bucket
create policy "Users can upload logos to their org folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);

create policy "Users can update logos in their org folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);

create policy "Users can delete logos in their org folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);

create policy "Anyone can view logos"
on storage.objects for select
to public
using (bucket_id = 'logos');
