-- ControlFleet-inspired operational model: public applications are leads;
-- fleet_members are the private, managed records used by day-to-day operations.

create table if not exists public.fleet_members (
  id uuid primary key default gen_random_uuid(),
  source_application_id uuid unique references public.applications(id) on delete set null,
  member_type text not null default 'courier' check (member_type in ('courier', 'pfa', 'srl', 'partner')),
  first_name text not null check (char_length(trim(first_name)) between 1 and 100),
  last_name text not null check (char_length(trim(last_name)) between 1 and 100),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 32),
  city text,
  operational_status text not null default 'onboarding' check (operational_status in ('onboarding', 'active', 'paused', 'offboarded')),
  beneficiary_subfleet_id uuid references public.subfleets(id) on delete set null,
  work_norm_hours numeric(4,1) check (work_norm_hours is null or work_norm_hours between 0 and 24),
  commission_percent numeric(5,2) check (commission_percent is null or commission_percent between 0 and 100),
  contract_number text,
  contract_status text not null default 'missing' check (contract_status in ('missing', 'pending', 'active', 'expired')),
  document_status text not null default 'missing' check (document_status in ('missing', 'partial', 'complete', 'expired')),
  platform_accounts jsonb not null default '[]'::jsonb,
  internal_note text check (internal_note is null or char_length(internal_note) <= 5000),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fleet_member_documents (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.fleet_members(id) on delete cascade,
  document_type text not null check (document_type in ('identity', 'iban', 'contract', 'medical', 'education', 'other')),
  status text not null default 'missing' check (status in ('missing', 'pending', 'valid', 'expired')),
  expires_on date,
  note text check (note is null or char_length(note) <= 1000),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fleet_member_vehicles (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.fleet_members(id) on delete set null,
  vehicle_type text not null check (vehicle_type in ('bicycle', 'ebike', 'scooter', 'car', 'other')),
  plate_number text,
  status text not null default 'active' check (status in ('active', 'service', 'inactive')),
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fleet_reports add column if not exists member_id uuid references public.fleet_members(id) on delete restrict;
alter table public.fleet_reports alter column application_id drop not null;
alter table public.fleet_reports drop constraint if exists fleet_reports_owner_check;
alter table public.fleet_reports add constraint fleet_reports_owner_check check (application_id is not null or member_id is not null);

create table if not exists public.fleet_autofacture_jobs (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null unique references public.fleet_reports(id) on delete cascade,
  member_id uuid references public.fleet_members(id) on delete set null,
  status text not null default 'ready' check (status in ('ready', 'queued', 'issued', 'blocked')),
  invoice_number text,
  note text check (note is null or char_length(note) <= 2000),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists fleet_members_set_updated_at on public.fleet_members;
create trigger fleet_members_set_updated_at before update on public.fleet_members for each row execute function public.set_updated_at();
drop trigger if exists fleet_member_documents_set_updated_at on public.fleet_member_documents;
create trigger fleet_member_documents_set_updated_at before update on public.fleet_member_documents for each row execute function public.set_updated_at();
drop trigger if exists fleet_member_vehicles_set_updated_at on public.fleet_member_vehicles;
create trigger fleet_member_vehicles_set_updated_at before update on public.fleet_member_vehicles for each row execute function public.set_updated_at();
drop trigger if exists fleet_autofacture_jobs_set_updated_at on public.fleet_autofacture_jobs;
create trigger fleet_autofacture_jobs_set_updated_at before update on public.fleet_autofacture_jobs for each row execute function public.set_updated_at();

create index if not exists fleet_members_status_idx on public.fleet_members (operational_status, city);
create index if not exists fleet_member_documents_member_idx on public.fleet_member_documents (member_id, document_type);
create index if not exists fleet_member_vehicles_member_idx on public.fleet_member_vehicles (member_id, status);
create index if not exists fleet_autofacture_jobs_status_idx on public.fleet_autofacture_jobs (status, created_at desc);

alter table public.fleet_members enable row level security;
alter table public.fleet_member_documents enable row level security;
alter table public.fleet_member_vehicles enable row level security;
alter table public.fleet_autofacture_jobs enable row level security;

revoke all on public.fleet_members, public.fleet_member_documents, public.fleet_member_vehicles, public.fleet_autofacture_jobs from anon, authenticated;
grant select, insert, update on public.fleet_members, public.fleet_member_documents, public.fleet_member_vehicles, public.fleet_autofacture_jobs to authenticated;

create policy "CibeRO admins manage fleet members" on public.fleet_members for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "CibeRO admins manage fleet member documents" on public.fleet_member_documents for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "CibeRO admins manage fleet member vehicles" on public.fleet_member_vehicles for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());
create policy "CibeRO admins manage fleet autofacture jobs" on public.fleet_autofacture_jobs for all to authenticated using (public.is_cibero_admin()) with check (public.is_cibero_admin());

comment on table public.fleet_members is 'Private managed courier, PFA, SRL and partner registry; distinct from public applications.';
comment on table public.fleet_autofacture_jobs is 'Internal invoice preparation queue; issuing to an accounting provider is intentionally a separate integration.';
