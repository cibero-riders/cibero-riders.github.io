-- Consume one published place when a new Glovo/Wolt application is recorded.
-- This is intentionally database-side so concurrent applications can never
-- decrement a city below zero.

alter table public.available_slots
  drop constraint if exists available_slots_slots_check;

alter table public.available_slots
  add constraint available_slots_slots_check
  check (slots between 0 and 999);

create or replace function public.consume_available_slot_on_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- The WHERE condition is evaluated while locking the row. If the last place
  -- was consumed by another application first, this update simply affects zero
  -- rows instead of producing a negative number.
  update public.available_slots
  set slots = slots - 1
  where platform = new.platform
    and city = new.city
    and slots > 0;

  return new;
end;
$$;

drop trigger if exists applications_consume_available_slot on public.applications;
create trigger applications_consume_available_slot
after insert on public.applications
for each row execute function public.consume_available_slot_on_application();

comment on function public.consume_available_slot_on_application() is
  'Atomically consumes one matching published place after a new application, without allowing negative availability.';
