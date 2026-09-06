-- CibeRO courier ticketing system: private intake, admin access and attachments.

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('bolt', 'glovo', 'wolt', 'rapoarte_plati', 'probleme_admin', 'deconturi')),
  request_type text not null,
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  phone text not null check (char_length(phone) between 7 and 32),
  email text not null check (char_length(email) between 3 and 254),
  new_phone text,
  new_email text,
  new_iban text,
  new_city text,
  new_vehicle text,
  new_plate text,
  description text check (description is null or char_length(description) <= 2000),
  wolt_app_phone text,
  wolt_courier_id text,
  wolt_email text,
  order_code text,
  declared_amount numeric(12,2),
  notes text check (notes is null or char_length(notes) <= 2000),
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'clarification', 'sent_to_platform', 'approved', 'rejected', 'archived')),
  admin_notes text check (admin_notes is null or char_length(admin_notes) <= 5000),
  confirmed boolean not null default false,
  source text not null default 'cibero_web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_files (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  file_kind text not null check (file_kind in ('support', 'receipt', 'receipts_pdf')),
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  file_size bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists tickets_created_at_idx on public.tickets (created_at desc);
create index if not exists tickets_status_idx on public.tickets (status);
create index if not exists tickets_phone_status_idx on public.tickets (phone, status);
create index if not exists ticket_files_ticket_idx on public.ticket_files (ticket_id);

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

alter table public.tickets enable row level security;
alter table public.ticket_files enable row level security;

revoke all on table public.tickets from anon, authenticated;
revoke all on table public.ticket_files from anon, authenticated;
grant select, update, delete on table public.tickets to authenticated;
grant select, delete on table public.ticket_files to authenticated;

drop policy if exists "Admins can read tickets" on public.tickets;
create policy "Admins can read tickets" on public.tickets for select to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid())));

drop policy if exists "Admins can update tickets" on public.tickets;
create policy "Admins can update tickets" on public.tickets for update to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid())));

drop policy if exists "Admins can delete tickets" on public.tickets;
create policy "Admins can delete tickets" on public.tickets for delete to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid())));

drop policy if exists "Admins can read ticket files" on public.ticket_files;
create policy "Admins can read ticket files" on public.ticket_files for select to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid())));

drop policy if exists "Admins can delete ticket files" on public.ticket_files;
create policy "Admins can delete ticket files" on public.ticket_files for delete to authenticated
using (exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ticket-files',
  'ticket-files',
  false,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read ticket storage" on storage.objects;
create policy "Admins can read ticket storage" on storage.objects for select to authenticated
using (
  bucket_id = 'ticket-files'
  and exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid()))
);

drop policy if exists "Admins can delete ticket storage" on storage.objects;
create policy "Admins can delete ticket storage" on storage.objects for delete to authenticated
using (
  bucket_id = 'ticket-files'
  and exists (select 1 from public.admin_users where admin_users.user_id = (select auth.uid()))
);

comment on table public.tickets is 'Courier support tickets submitted through the CibeRO website.';
comment on table public.ticket_files is 'Private attachments associated with CibeRO courier tickets.';
