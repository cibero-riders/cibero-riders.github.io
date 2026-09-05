-- CibeRO application intake: database schema, admin authorization and private files.
-- Run this migration in the Supabase SQL Editor before connecting the public forms.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('wolt', 'glovo')),
  application_type text not null default 'new_account'
    check (application_type in ('new_account', 'transfer')),
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 7 and 32),
  city text not null check (char_length(city) between 1 and 100),
  vehicle text check (vehicle is null or char_length(vehicle) <= 100),
  message text check (message is null or char_length(message) <= 2000),
  proof_path text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'sent_to_platform', 'activated', 'rejected', 'archived')),
  admin_notes text check (admin_notes is null or char_length(admin_notes) <= 5000),
  assigned_to uuid references auth.users(id) on delete set null,
  consent_privacy boolean not null default false,
  consent_data_accuracy boolean not null default false,
  source text not null default 'cibero_web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);
create index if not exists applications_status_idx
  on public.applications (status);
create index if not exists applications_platform_city_idx
  on public.applications (platform, city);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.applications enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.applications from anon, authenticated;

grant select on table public.admin_users to authenticated;
grant select, update on table public.applications to authenticated;

drop policy if exists "Admins can read their own membership" on public.admin_users;
create policy "Admins can read their own membership"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Admins can read applications" on public.applications;
create policy "Admins can read applications"
on public.applications
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can update applications" on public.applications;
create policy "Admins can update applications"
on public.applications
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'application-proofs',
  'application-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read application proofs" on storage.objects;
create policy "Admins can read application proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'application-proofs'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

comment on table public.applications is
  'Wolt and Glovo account-opening requests submitted through the CibeRO website.';
comment on column public.applications.proof_path is
  'Private Storage object path. Access is restricted to authenticated CibeRO admins.';
