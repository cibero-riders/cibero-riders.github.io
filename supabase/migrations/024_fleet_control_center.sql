-- Operational records used by the CibeRO Fleet Control Center.
-- They extend the existing intake data without altering the courier's public application.

create table if not exists public.fleet_courier_profiles (
  application_id uuid primary key references public.applications(id) on delete cascade,
  operational_status text not null default 'onboarding'
    check (operational_status in ('onboarding', 'active', 'paused', 'offboarded')),
  internal_note text check (internal_note is null or char_length(internal_note) <= 2000),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fleet_reports (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete restrict,
  platform text not null check (platform in ('bolt', 'glovo', 'wolt', 'other')),
  period_start date not null,
  period_end date not null,
  gross_amount numeric(12,2) not null default 0 check (gross_amount >= 0),
  commission_amount numeric(12,2) not null default 0 check (commission_amount >= 0),
  net_amount numeric(12,2) not null default 0 check (net_amount >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved', 'paid', 'exception')),
  invoice_status text not null default 'not_ready'
    check (invoice_status in ('not_ready', 'ready', 'queued', 'issued')),
  internal_note text check (internal_note is null or char_length(internal_note) <= 2000),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create table if not exists public.fleet_settings (
  key text primary key check (key in ('default_commission_percent', 'report_due_weekday', 'auto_invoice_enabled')),
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

drop trigger if exists fleet_courier_profiles_set_updated_at on public.fleet_courier_profiles;
create trigger fleet_courier_profiles_set_updated_at before update on public.fleet_courier_profiles
for each row execute function public.set_updated_at();

drop trigger if exists fleet_reports_set_updated_at on public.fleet_reports;
create trigger fleet_reports_set_updated_at before update on public.fleet_reports
for each row execute function public.set_updated_at();

drop trigger if exists fleet_settings_set_updated_at on public.fleet_settings;
create trigger fleet_settings_set_updated_at before update on public.fleet_settings
for each row execute function public.set_updated_at();

create index if not exists fleet_reports_period_idx on public.fleet_reports (period_end desc, created_at desc);
create index if not exists fleet_reports_application_idx on public.fleet_reports (application_id, period_end desc);
create index if not exists fleet_reports_status_idx on public.fleet_reports (status, invoice_status);

alter table public.fleet_courier_profiles enable row level security;
alter table public.fleet_reports enable row level security;
alter table public.fleet_settings enable row level security;

revoke all on public.fleet_courier_profiles, public.fleet_reports, public.fleet_settings from anon, authenticated;
grant select, insert, update on public.fleet_courier_profiles, public.fleet_reports, public.fleet_settings to authenticated;

create policy "CibeRO admins manage fleet courier profiles" on public.fleet_courier_profiles
for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "CibeRO admins manage fleet reports" on public.fleet_reports
for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "CibeRO admins manage fleet settings" on public.fleet_settings
for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());

insert into public.fleet_settings (key, value)
values
  ('default_commission_percent', '5'::jsonb),
  ('report_due_weekday', '"Luni"'::jsonb),
  ('auto_invoice_enabled', 'false'::jsonb)
on conflict (key) do nothing;

comment on table public.fleet_courier_profiles is 'Internal operational state and notes for couriers registered with CibeRO.';
comment on table public.fleet_reports is 'Courier report records used to review payments and queue future invoice automation.';
comment on table public.fleet_settings is 'Editable operational defaults for report processing and future invoice automation.';
