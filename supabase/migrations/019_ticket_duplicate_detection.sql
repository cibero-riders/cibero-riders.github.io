-- Flag support tickets that match an existing registration.  The ticket is
-- accepted normally; this is an operational warning for the CibeRO admin.

alter table public.tickets
  add column if not exists duplicate_application_id uuid references public.applications(id) on delete set null,
  add column if not exists duplicate_match_fields text[] not null default '{}';

alter table public.admin_alerts
  add column if not exists ticket_id uuid references public.tickets(id) on delete cascade,
  add column if not exists match_fields text[] not null default '{}';

create index if not exists applications_ticket_match_email_idx
  on public.applications (lower(trim(email)));
create index if not exists applications_ticket_match_phone_idx
  on public.applications (regexp_replace(phone, '\D', '', 'g'));
create index if not exists applications_ticket_match_name_idx
  on public.applications (lower(regexp_replace(trim(first_name) || ' ' || trim(last_name), '\s+', ' ', 'g')));
create index if not exists tickets_duplicate_application_idx
  on public.tickets (duplicate_application_id) where duplicate_application_id is not null;
create unique index if not exists admin_alerts_duplicate_ticket_once_idx
  on public.admin_alerts (alert_type, ticket_id)
  where alert_type = 'ticket_duplicate_registration';

create or replace function public.detect_ticket_registration_duplicate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application public.applications;
  v_ticket_name text := lower(regexp_replace(trim(new.first_name) || ' ' || trim(new.last_name), '\s+', ' ', 'g'));
  v_ticket_phone text := regexp_replace(new.phone, '\D', '', 'g');
begin
  select a.* into v_application
  from public.applications a
  where lower(trim(a.email)) = lower(trim(new.email))
     or regexp_replace(a.phone, '\D', '', 'g') = v_ticket_phone
     or lower(regexp_replace(trim(a.first_name) || ' ' || trim(a.last_name), '\s+', ' ', 'g')) = v_ticket_name
  order by
    (lower(trim(a.email)) = lower(trim(new.email))) desc,
    (regexp_replace(a.phone, '\D', '', 'g') = v_ticket_phone) desc,
    (lower(regexp_replace(trim(a.first_name) || ' ' || trim(a.last_name), '\s+', ' ', 'g')) = v_ticket_name) desc,
    a.created_at desc
  limit 1;

  if found then
    new.duplicate_application_id := v_application.id;
    new.duplicate_match_fields := array_remove(array[
      case when lower(trim(v_application.email)) = lower(trim(new.email)) then 'email' end,
      case when regexp_replace(v_application.phone, '\D', '', 'g') = v_ticket_phone then 'telefon' end,
      case when lower(regexp_replace(trim(v_application.first_name) || ' ' || trim(v_application.last_name), '\s+', ' ', 'g')) = v_ticket_name then 'nume complet' end
    ], null);
  else
    new.duplicate_application_id := null;
    new.duplicate_match_fields := '{}';
  end if;

  return new;
end;
$$;

create or replace function public.notify_ticket_registration_duplicate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.duplicate_application_id is not null then
    insert into public.admin_alerts (alert_type, application_id, ticket_id, match_fields, message)
    values (
      'ticket_duplicate_registration',
      new.duplicate_application_id,
      new.id,
      new.duplicate_match_fields,
      format(
        'Ticketul #%s pare să dubleze înregistrarea lui %s %s (%s).',
        upper(left(new.id::text, 8)),
        new.first_name,
        new.last_name,
        array_to_string(new.duplicate_match_fields, ', ')
      )
    )
    on conflict (alert_type, ticket_id) where alert_type = 'ticket_duplicate_registration' do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists tickets_detect_registration_duplicate on public.tickets;
create trigger tickets_detect_registration_duplicate
before insert on public.tickets
for each row execute function public.detect_ticket_registration_duplicate();

drop trigger if exists tickets_notify_registration_duplicate on public.tickets;
create trigger tickets_notify_registration_duplicate
after insert on public.tickets
for each row execute function public.notify_ticket_registration_duplicate();

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'admin_alerts'
  ) then
    execute 'alter publication supabase_realtime add table public.admin_alerts';
  end if;
end;
$$;
