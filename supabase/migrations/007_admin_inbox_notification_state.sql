-- Shared read state for the administrative inboxes. Running this migration is
-- enough even if migration 006 has not yet been executed.
alter table public.tickets
  add column if not exists opened_at timestamptz;

alter table public.applications
  add column if not exists opened_at timestamptz;

create index if not exists tickets_opened_at_idx
  on public.tickets (opened_at, created_at desc);

create index if not exists applications_opened_at_idx
  on public.applications (opened_at, created_at desc);
