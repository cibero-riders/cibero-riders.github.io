-- Keep an auditable availability baseline and count completed applications.
-- Run after migrations 008 and 009.

alter table public.available_slots
  add column if not exists initial_slots smallint,
  add column if not exists application_count integer not null default 0,
  add column if not exists admin_updated_at timestamptz,
  add column if not exists admin_updated_by uuid references auth.users(id) on delete set null;

update public.available_slots
set initial_slots = slots
where initial_slots is null;

update public.available_slots
set admin_updated_at = coalesce(admin_updated_at, updated_at, now())
where admin_updated_at is null;

alter table public.available_slots
  alter column initial_slots set not null,
  alter column admin_updated_at set not null;

alter table public.available_slots
  drop constraint if exists available_slots_initial_slots_check,
  add constraint available_slots_initial_slots_check
    check (initial_slots between 0 and 999),
  drop constraint if exists available_slots_application_count_check,
  add constraint available_slots_application_count_check
    check (application_count >= 0);

create or replace function public.consume_available_slot_on_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Count every fully recorded application for a currently listed city. Places
  -- can reach zero but never become negative, including concurrent requests.
  update public.available_slots
  set slots = greatest(slots - 1, 0),
      application_count = application_count + 1
  where platform = new.platform
    and city = new.city;

  return new;
end;
$$;

comment on column public.available_slots.initial_slots is
  'Places published by an admin at the beginning of the current availability cycle.';
comment on column public.available_slots.application_count is
  'Completed website applications recorded since the city was last published by an admin.';
comment on column public.available_slots.admin_updated_at is
  'Timestamp of the last admin publication, unaffected by applicant activity.';
