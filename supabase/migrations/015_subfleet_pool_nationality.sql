-- Lets a sub-fleet see the city and nationality necessary to assess an
-- unclaimed registration, while continuing to withhold contact details and notes.
drop function if exists public.get_subfleet_lead_pool();

create function public.get_subfleet_lead_pool()
returns table (
  id uuid,
  first_name text,
  last_name text,
  city text,
  nationality text,
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
  select a.id, a.first_name, a.last_name, a.city, a.nationality, a.vehicle,
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

grant execute on function public.get_subfleet_lead_pool() to authenticated;
