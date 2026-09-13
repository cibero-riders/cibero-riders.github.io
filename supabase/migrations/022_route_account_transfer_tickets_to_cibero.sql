-- Account-transfer requests are handled centrally by CibeRO, not by a subfleet.
create or replace function public.route_ticket_to_subfleet()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subfleet_id uuid;
begin
  if new.request_type = 'transfer_cont' then
    new.subfleet_id := null;
    new.routed_at := null;
    return new;
  end if;

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

comment on function public.route_ticket_to_subfleet() is
  'Routes account-transfer tickets to central CibeRO administration; other tickets use the member application subfleet.';
