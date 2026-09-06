-- Add the leave/inactivity branch to the CibeRO ticket system.

alter table public.tickets
  drop constraint if exists tickets_category_check;

alter table public.tickets
  add constraint tickets_category_check
  check (category in ('bolt', 'glovo', 'wolt', 'rapoarte_plati', 'probleme_admin', 'deconturi', 'inactivitate'));

alter table public.tickets
  add column if not exists platforms text[],
  add column if not exists inactive_start date,
  add column if not exists inactive_end date;

alter table public.tickets
  drop constraint if exists tickets_inactivity_dates_check;

alter table public.tickets
  add constraint tickets_inactivity_dates_check
  check (
    category <> 'inactivitate'
    or (
      coalesce(array_length(platforms, 1), 0) > 0
      and inactive_start is not null
      and inactive_end is not null
      and inactive_end >= inactive_start + 6
    )
  );
