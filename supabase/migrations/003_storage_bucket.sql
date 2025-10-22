-- Create storage bucket for invoices
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do nothing;

-- Allow authenticated users to upload files to their own org folder
create policy "Users can upload to their org folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'invoices' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);

-- Allow authenticated users to read files from their own org folder
create policy "Users can read from their org folder"
on storage.objects for select
to authenticated
using (
  bucket_id = 'invoices' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);

-- Allow authenticated users to update files in their own org folder
create policy "Users can update in their org folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'invoices' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);

-- Allow authenticated users to delete files from their own org folder
create policy "Users can delete from their org folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'invoices' and
  (storage.foldername(name))[1] = (
    select org_id::text from public.users where id = auth.uid()
  )
);
