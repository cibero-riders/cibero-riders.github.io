-- Inbox state for CibeRO courier tickets. A ticket is considered read once an
-- administrator opens its detail panel.
alter table public.tickets
  add column if not exists opened_at timestamptz;

create index if not exists tickets_opened_at_idx
  on public.tickets (opened_at, created_at desc);
