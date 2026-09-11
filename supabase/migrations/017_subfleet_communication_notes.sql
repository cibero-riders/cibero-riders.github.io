-- A lightweight, two-way operational note for every subfleet.
-- Updates are made only through the RPC below, so each role can change only
-- its own note while the other party receives a dedicated notification.

create table if not exists public.subfleet_notes (
  subfleet_id uuid primary key references public.subfleets(id) on delete cascade,
  admin_note text not null default '',
  admin_note_updated_at timestamptz,
  admin_note_updated_by uuid references auth.users(id) on delete set null,
  subfleet_note text not null default '',
  subfleet_note_updated_at timestamptz,
  subfleet_note_updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint subfleet_notes_admin_note_length check (char_length(admin_note) <= 2000),
  constraint subfleet_notes_subfleet_note_length check (char_length(subfleet_note) <= 2000)
);

drop trigger if exists subfleet_notes_set_updated_at on public.subfleet_notes;
create trigger subfleet_notes_set_updated_at before update on public.subfleet_notes
for each row execute function public.set_updated_at();

create table if not exists public.subfleet_note_notifications (
  id uuid primary key default gen_random_uuid(),
  subfleet_id uuid not null references public.subfleets(id) on delete cascade,
  author_role text not null check (author_role in ('admin', 'subfleet')),
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists subfleet_note_notifications_recipient_idx
  on public.subfleet_note_notifications (subfleet_id, author_role, created_at desc)
  where read_at is null;

alter table public.subfleet_notes enable row level security;
alter table public.subfleet_note_notifications enable row level security;

revoke all on public.subfleet_notes from anon, authenticated;
revoke all on public.subfleet_note_notifications from anon, authenticated;
grant select on public.subfleet_notes, public.subfleet_note_notifications to authenticated;

drop policy if exists "Admins can read all subfleet notes" on public.subfleet_notes;
create policy "Admins can read all subfleet notes" on public.subfleet_notes for select to authenticated
using (public.is_cibero_admin());
drop policy if exists "Subfleet can read own notes" on public.subfleet_notes;
create policy "Subfleet can read own notes" on public.subfleet_notes for select to authenticated
using (subfleet_id = public.current_cibero_subfleet_id());

drop policy if exists "Admins can read subfleet note notifications" on public.subfleet_note_notifications;
create policy "Admins can read subfleet note notifications" on public.subfleet_note_notifications for select to authenticated
using (public.is_cibero_admin() and author_role = 'subfleet');
drop policy if exists "Subfleet can read own note notifications" on public.subfleet_note_notifications;
create policy "Subfleet can read own note notifications" on public.subfleet_note_notifications for select to authenticated
using (subfleet_id = public.current_cibero_subfleet_id() and author_role = 'admin');

create or replace function public.update_subfleet_communication_note(p_subfleet_id uuid, p_note text)
returns public.subfleet_notes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_note text := trim(coalesce(p_note, ''));
  v_result public.subfleet_notes;
  v_subfleet_name text;
begin
  if char_length(v_note) > 2000 then
    raise exception 'Nota poate avea cel mult 2000 de caractere.' using errcode = '22001';
  end if;

  select name into v_subfleet_name from public.subfleets where id = p_subfleet_id;
  if not found then
    raise exception 'Sub-flota nu există.' using errcode = 'P0002';
  end if;

  if public.is_cibero_admin() then
    insert into public.subfleet_notes (subfleet_id, admin_note, admin_note_updated_at, admin_note_updated_by)
    values (p_subfleet_id, v_note, now(), auth.uid())
    on conflict (subfleet_id) do update
      set admin_note = excluded.admin_note,
          admin_note_updated_at = excluded.admin_note_updated_at,
          admin_note_updated_by = excluded.admin_note_updated_by
    returning * into v_result;

    insert into public.subfleet_note_notifications (subfleet_id, author_role, message)
    values (p_subfleet_id, 'admin', format('CibeRO a actualizat nota pentru %s.', v_subfleet_name));
  elsif p_subfleet_id = public.current_cibero_subfleet_id() then
    insert into public.subfleet_notes (subfleet_id, subfleet_note, subfleet_note_updated_at, subfleet_note_updated_by)
    values (p_subfleet_id, v_note, now(), auth.uid())
    on conflict (subfleet_id) do update
      set subfleet_note = excluded.subfleet_note,
          subfleet_note_updated_at = excluded.subfleet_note_updated_at,
          subfleet_note_updated_by = excluded.subfleet_note_updated_by
    returning * into v_result;

    insert into public.subfleet_note_notifications (subfleet_id, author_role, message)
    values (p_subfleet_id, 'subfleet', format('%s a actualizat nota pentru CibeRO.', v_subfleet_name));
  else
    raise exception 'Nu ai acces la această sub-flotă.' using errcode = '42501';
  end if;

  return v_result;
end;
$$;

create or replace function public.mark_subfleet_note_notifications_read(p_notification_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer := 0;
begin
  if coalesce(array_length(p_notification_ids, 1), 0) = 0 then
    return 0;
  end if;

  if public.is_cibero_admin() then
    update public.subfleet_note_notifications
       set read_at = now()
     where id = any(p_notification_ids)
       and author_role = 'subfleet'
       and read_at is null;
  elsif public.current_cibero_subfleet_id() is not null then
    update public.subfleet_note_notifications
       set read_at = now()
     where id = any(p_notification_ids)
       and subfleet_id = public.current_cibero_subfleet_id()
       and author_role = 'admin'
       and read_at is null;
  else
    raise exception 'Nu ai acces la aceste notificări.' using errcode = '42501';
  end if;

  get diagnostics v_updated = row_count;
  return v_updated;
end;
$$;

grant execute on function public.update_subfleet_communication_note(uuid, text) to authenticated;
grant execute on function public.mark_subfleet_note_notifications_read(uuid[]) to authenticated;

-- Notify open dashboards immediately when a note changes.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'subfleet_notes'
  ) then
    execute 'alter publication supabase_realtime add table public.subfleet_notes';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'subfleet_note_notifications'
  ) then
    execute 'alter publication supabase_realtime add table public.subfleet_note_notifications';
  end if;
end;
$$;
