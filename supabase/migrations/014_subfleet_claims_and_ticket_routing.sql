-- CibeRO subfleet foundation.
--
-- Social-media registrations made by "Curier nou" and "Curier cu experiență"
-- become claimable leads. PFA and SRL registrations stay visible only to admins.
-- A claim is intentionally permanent: there is no automatic release task, so a
-- claimed member and that member's future tickets remain with the same subfleet.

create table if not exists public.subfleets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) between 2 and 120),
  description text check (description is null or char_length(description) <= 1000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists subfleets_set_updated_at on public.subfleets;
create trigger subfleets_set_updated_at before update on public.subfleets
for each row execute function public.set_updated_at();

alter table public.admin_users
  add column if not exists role text not null default 'admin',
  add column if not exists subfleet_id uuid,
  add column if not exists is_active boolean not null default true;

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users
  add constraint admin_users_role_check check (role in ('admin', 'subfleet'));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'admin_users_subfleet_id_fkey'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_subfleet_id_fkey
      foreign key (subfleet_id) references public.subfleets(id) on delete set null;
  end if;
end $$;

alter table public.admin_users drop constraint if exists admin_users_subfleet_role_check;
alter table public.admin_users
  add constraint admin_users_subfleet_role_check
  check ((role = 'admin' and subfleet_id is null) or (role = 'subfleet' and subfleet_id is not null));

create index if not exists admin_users_subfleet_idx on public.admin_users (subfleet_id)
  where role = 'subfleet' and is_active;

create or replace function public.is_cibero_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'admin' and is_active
  );
$$;

create or replace function public.current_cibero_subfleet_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select subfleet_id from public.admin_users
  where user_id = auth.uid() and role = 'subfleet' and is_active
  limit 1;
$$;

grant execute on function public.is_cibero_admin() to authenticated;
grant execute on function public.current_cibero_subfleet_id() to authenticated;

alter table public.applications
  add column if not exists subfleet_id uuid references public.subfleets(id) on delete set null,
  add column if not exists claimed_at timestamptz,
  add column if not exists claimed_by uuid references auth.users(id) on delete set null,
  -- Older installations may not have received the inbox-state migration.
  add column if not exists opened_at timestamptz;

alter table public.tickets
  add column if not exists subfleet_id uuid references public.subfleets(id) on delete set null,
  add column if not exists routed_at timestamptz,
  add column if not exists opened_at timestamptz;

create index if not exists applications_subfleet_created_idx
  on public.applications (subfleet_id, created_at desc) where subfleet_id is not null;
create index if not exists tickets_subfleet_created_idx
  on public.tickets (subfleet_id, created_at desc) where subfleet_id is not null;
create index if not exists applications_claim_lookup_idx
  on public.applications (lower(email), claimed_at desc) where subfleet_id is not null;

create table if not exists public.subfleet_claim_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  subfleet_id uuid not null references public.subfleets(id) on delete restrict,
  claimed_by uuid not null references auth.users(id) on delete restrict,
  claimed_at timestamptz not null default now()
);

create unique index if not exists subfleet_claim_history_one_claim_per_application_idx
  on public.subfleet_claim_history (application_id);
create index if not exists subfleet_claim_history_subfleet_idx
  on public.subfleet_claim_history (subfleet_id, claimed_at desc);

alter table public.subfleets enable row level security;
alter table public.subfleet_claim_history enable row level security;

revoke all on public.subfleets from anon, authenticated;
revoke all on public.subfleet_claim_history from anon, authenticated;
grant select on public.subfleets, public.subfleet_claim_history to authenticated;

drop policy if exists "CibeRO staff can read profile" on public.admin_users;
drop policy if exists "Admins can read their own membership" on public.admin_users;
create policy "CibeRO staff can read profile" on public.admin_users for select to authenticated
using (user_id = auth.uid() or public.is_cibero_admin());

create policy "Admins can read subfleets" on public.subfleets for select to authenticated
using (public.is_cibero_admin());
create policy "Subfleet can read own subfleet" on public.subfleets for select to authenticated
using (id = public.current_cibero_subfleet_id());

create policy "Admins can read all claim history" on public.subfleet_claim_history for select to authenticated
using (public.is_cibero_admin());
create policy "Subfleet can read own claim history" on public.subfleet_claim_history for select to authenticated
using (subfleet_id = public.current_cibero_subfleet_id());

-- The pool deliberately omits email, phone and free-form notes until a lead is claimed.
create or replace function public.get_subfleet_lead_pool()
returns table (
  id uuid,
  first_name text,
  last_name text,
  city text,
  vehicle text,
  desired_platforms text[],
  courier_type text,
  discovery_source text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select a.id, a.first_name, a.last_name, a.city, a.vehicle,
    a.desired_platforms, a.courier_type, a.discovery_source, a.created_at
  from public.applications a
  where public.current_cibero_subfleet_id() is not null
    and a.platform = 'social_media'
    and a.application_type = 'social_registration'
    and a.courier_type in ('new_courier', 'experienced_courier')
    and a.subfleet_id is null
    and a.status not in ('activated', 'rejected', 'archived')
  order by a.created_at desc;
$$;

-- The row lock makes a simultaneous claim race safe: only one subfleet can win.
create or replace function public.claim_subfleet_lead(p_application_id uuid)
returns public.applications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subfleet_id uuid := public.current_cibero_subfleet_id();
  v_application public.applications;
begin
  if v_subfleet_id is null then
    raise exception 'Contul nu este asociat unei sub-flote active.' using errcode = '42501';
  end if;

  select * into v_application
  from public.applications
  where id = p_application_id
    and platform = 'social_media'
    and application_type = 'social_registration'
    and courier_type in ('new_courier', 'experienced_courier')
    and subfleet_id is null
    and status not in ('activated', 'rejected', 'archived')
  for update;

  if not found then
    raise exception 'Această înregistrare nu mai este disponibilă.' using errcode = 'P0001';
  end if;

  update public.applications
  set subfleet_id = v_subfleet_id, claimed_at = now(), claimed_by = auth.uid()
  where id = v_application.id
  returning * into v_application;

  insert into public.subfleet_claim_history (application_id, subfleet_id, claimed_by)
  values (v_application.id, v_subfleet_id, auth.uid());

  return v_application;
end;
$$;

grant execute on function public.get_subfleet_lead_pool() to authenticated;
grant execute on function public.claim_subfleet_lead(uuid) to authenticated;

-- A future ticket is routed to the most recently claimed matching registration.
-- Email wins over phone; phone is used only when no claimed email is found.
create or replace function public.route_ticket_to_subfleet()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subfleet_id uuid;
begin
  select a.subfleet_id into v_subfleet_id
  from public.applications a
  where a.subfleet_id is not null
    and lower(a.email) = lower(new.email)
  order by a.claimed_at desc nulls last
  limit 1;

  if v_subfleet_id is null then
    select a.subfleet_id into v_subfleet_id
    from public.applications a
    where a.subfleet_id is not null
      and regexp_replace(a.phone, '\D', '', 'g') = regexp_replace(new.phone, '\D', '', 'g')
    order by a.claimed_at desc nulls last
    limit 1;
  end if;

  if v_subfleet_id is not null then
    new.subfleet_id := v_subfleet_id;
    new.routed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists tickets_route_to_subfleet on public.tickets;
create trigger tickets_route_to_subfleet
before insert on public.tickets
for each row execute function public.route_ticket_to_subfleet();

-- Existing administrators retain full access. Subfleet users can access only
-- their claimed registrations and their automatically routed tickets.
revoke update on public.applications from authenticated;
grant update (status, admin_notes, opened_at) on public.applications to authenticated;
drop policy if exists "Admins can read applications" on public.applications;
drop policy if exists "Admins can update applications" on public.applications;
create policy "CibeRO admins can read applications" on public.applications for select to authenticated
using (public.is_cibero_admin());
create policy "CibeRO admins can update applications" on public.applications for update to authenticated
using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "Subfleet can read claimed applications" on public.applications for select to authenticated
using (subfleet_id = public.current_cibero_subfleet_id());
create policy "Subfleet can update claimed applications" on public.applications for update to authenticated
using (subfleet_id = public.current_cibero_subfleet_id())
with check (subfleet_id = public.current_cibero_subfleet_id());

revoke update on public.tickets from authenticated;
grant update (status, admin_notes, opened_at) on public.tickets to authenticated;
drop policy if exists "Admins can read tickets" on public.tickets;
drop policy if exists "Admins can update tickets" on public.tickets;
drop policy if exists "Admins can delete tickets" on public.tickets;
create policy "CibeRO admins can read tickets" on public.tickets for select to authenticated
using (public.is_cibero_admin());
create policy "CibeRO admins can update tickets" on public.tickets for update to authenticated
using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "CibeRO admins can delete tickets" on public.tickets for delete to authenticated
using (public.is_cibero_admin());
create policy "Subfleet can read routed tickets" on public.tickets for select to authenticated
using (subfleet_id = public.current_cibero_subfleet_id());
create policy "Subfleet can update routed tickets" on public.tickets for update to authenticated
using (subfleet_id = public.current_cibero_subfleet_id())
with check (subfleet_id = public.current_cibero_subfleet_id());

drop policy if exists "Admins can read ticket files" on public.ticket_files;
create policy "CibeRO admins can read ticket files" on public.ticket_files for select to authenticated
using (public.is_cibero_admin());
create policy "Subfleet can read routed ticket files" on public.ticket_files for select to authenticated
using (exists (
  select 1 from public.tickets t
  where t.id = ticket_files.ticket_id and t.subfleet_id = public.current_cibero_subfleet_id()
));

drop policy if exists "Admins can read ticket storage" on storage.objects;
create policy "CibeRO admins can read ticket storage" on storage.objects for select to authenticated
using (bucket_id = 'ticket-files' and public.is_cibero_admin());
create policy "Subfleet can read routed ticket storage" on storage.objects for select to authenticated
using (bucket_id = 'ticket-files' and exists (
  select 1 from public.ticket_files f
  join public.tickets t on t.id = f.ticket_id
  where f.storage_path = name and t.subfleet_id = public.current_cibero_subfleet_id()
));

comment on table public.subfleets is 'Operational CibeRO subfleets. Only admins may create accounts through the management Edge Function.';
comment on table public.subfleet_claim_history is 'Immutable ownership audit for social-media leads claimed by a subfleet.';
