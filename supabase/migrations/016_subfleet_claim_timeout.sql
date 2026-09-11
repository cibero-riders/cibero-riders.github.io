-- A claim is provisional until a sub-fleet begins processing it.
-- After 24 hours in the initial status, the lead returns to the shared pool.

drop index if exists public.subfleet_claim_history_one_claim_per_application_idx;
create index if not exists subfleet_claim_history_application_idx
  on public.subfleet_claim_history (application_id, claimed_at desc);

create table if not exists public.admin_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  application_id uuid references public.applications(id) on delete set null,
  subfleet_id uuid references public.subfleets(id) on delete set null,
  claim_started_at timestamptz,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create unique index if not exists admin_alerts_stale_claim_once_idx
  on public.admin_alerts (alert_type, application_id, subfleet_id, claim_started_at)
  where alert_type = 'subfleet_claim_timeout';

alter table public.admin_alerts enable row level security;
revoke all on public.admin_alerts from anon, authenticated;
grant select, update on public.admin_alerts to authenticated;

drop policy if exists "Admins can read alerts" on public.admin_alerts;
create policy "Admins can read alerts" on public.admin_alerts for select to authenticated
  using (public.is_cibero_admin());
drop policy if exists "Admins can update alerts" on public.admin_alerts;
create policy "Admins can update alerts" on public.admin_alerts for update to authenticated
  using (public.is_cibero_admin()) with check (public.is_cibero_admin());

create or replace function public.release_stale_subfleet_claims()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  released_count integer := 0;
begin
  -- Browser calls are restricted to the admin; scheduled database calls have no auth uid.
  if auth.uid() is not null and not public.is_cibero_admin() then
    raise exception 'Doar administratorul poate rula această verificare.';
  end if;

  with stale_claims as (
    select id, first_name, last_name, subfleet_id, claimed_at
    from public.applications
    where subfleet_id is not null
      and status = 'new'
      and claimed_at <= now() - interval '24 hours'
    for update
  ), released as (
    update public.applications as application
       set subfleet_id = null,
           claimed_at = null,
           claimed_by = null,
           opened_at = null,
           status = 'new'
      from stale_claims
     where application.id = stale_claims.id
     returning application.id
  ), alerts as (
    insert into public.admin_alerts (alert_type, application_id, subfleet_id, claim_started_at, message)
    select
      'subfleet_claim_timeout',
      id,
      subfleet_id,
      claimed_at,
      format('Sub-flota nu a procesat în 24h cererea lui %s %s. Cererea a revenit în pool-ul public.', first_name, last_name)
    from stale_claims join released on released.id = stale_claims.id
    on conflict (alert_type, application_id, subfleet_id, claim_started_at) where alert_type = 'subfleet_claim_timeout' do nothing
    returning id
  )
  select count(*) into released_count from alerts;

  return released_count;
end;
$$;

grant execute on function public.release_stale_subfleet_claims() to authenticated;

-- If Supabase Cron is enabled, make the timeout autonomous and check every 15 minutes.
do $cron$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    execute $sql$select cron.unschedule(jobid) from cron.job where jobname = 'cibero-release-stale-subfleet-claims'$sql$;
    execute $sql$select cron.schedule('cibero-release-stale-subfleet-claims', '*/15 * * * *', 'select public.release_stale_subfleet_claims()')$sql$;
  end if;
exception when undefined_schema then
  null;
end;
$cron$;
