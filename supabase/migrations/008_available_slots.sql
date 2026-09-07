-- Public availability board for Glovo and Wolt.
-- Run this migration in the Supabase SQL Editor before using the admin section.

create table if not exists public.available_slots (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('glovo', 'wolt')),
  city text not null check (char_length(city) between 1 and 100),
  slots smallint not null check (slots between 1 and 999),
  sort_order smallint not null default 0 check (sort_order >= 0),
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, city)
);

create index if not exists available_slots_platform_order_idx
  on public.available_slots (platform, sort_order, city);

drop trigger if exists available_slots_set_updated_at on public.available_slots;
create trigger available_slots_set_updated_at
before update on public.available_slots
for each row execute function public.set_updated_at();

alter table public.available_slots enable row level security;
revoke all on table public.available_slots from anon, authenticated;

-- Anyone with the direct public link can only read the published availability.
grant select on table public.available_slots to anon, authenticated;
grant insert, update, delete on table public.available_slots to authenticated;

drop policy if exists "Public can read available slots" on public.available_slots;
create policy "Public can read available slots"
on public.available_slots for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert available slots" on public.available_slots;
create policy "Admins can insert available slots"
on public.available_slots for insert
to authenticated
with check (
  exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid()))
);

drop policy if exists "Admins can update available slots" on public.available_slots;
create policy "Admins can update available slots"
on public.available_slots for update
to authenticated
using (
  exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid()))
);

drop policy if exists "Admins can delete available slots" on public.available_slots;
create policy "Admins can delete available slots"
on public.available_slots for delete
to authenticated
using (
  exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid()))
);

-- Enables instant refreshes on the public board after an admin publishes changes.
do $$
begin
  alter publication supabase_realtime add table public.available_slots;
exception
  when duplicate_object then null;
end $$;

comment on table public.available_slots is
  'Current public Glovo and Wolt courier places, maintained by CibeRO administrators.';
