-- Allow authenticated CibeRO administrators to permanently delete applications
-- and their associated private proof images from the admin dashboard.

grant delete on table public.applications to authenticated;

drop policy if exists "Admins can delete applications" on public.applications;
create policy "Admins can delete applications"
on public.applications
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can delete application proofs" on storage.objects;
create policy "Admins can delete application proofs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'application-proofs'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);
