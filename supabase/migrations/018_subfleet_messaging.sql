-- Persistent admin ↔ subfleet conversations. This deliberately sits apart
-- from applications.admin_notes, which remain internal operational notes.

create table if not exists public.subfleet_messages (
  id uuid primary key default gen_random_uuid(),
  subfleet_id uuid not null references public.subfleets(id) on delete cascade,
  sender_role text not null check (sender_role in ('admin', 'subfleet')),
  sender_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists subfleet_messages_conversation_idx
  on public.subfleet_messages (subfleet_id, created_at asc);
create index if not exists subfleet_messages_unread_idx
  on public.subfleet_messages (subfleet_id, sender_role, created_at desc)
  where read_at is null;

alter table public.subfleet_messages enable row level security;
revoke all on public.subfleet_messages from anon, authenticated;
grant select on public.subfleet_messages to authenticated;

drop policy if exists "Admins can read subfleet messages" on public.subfleet_messages;
create policy "Admins can read subfleet messages" on public.subfleet_messages for select to authenticated
using (public.is_cibero_admin());
drop policy if exists "Subfleet can read own messages" on public.subfleet_messages;
create policy "Subfleet can read own messages" on public.subfleet_messages for select to authenticated
using (subfleet_id = public.current_cibero_subfleet_id());

create or replace function public.send_subfleet_message(p_subfleet_id uuid, p_body text)
returns public.subfleet_messages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_body text := trim(coalesce(p_body, ''));
  v_role text;
  v_result public.subfleet_messages;
begin
  if char_length(v_body) < 1 or char_length(v_body) > 4000 then
    raise exception 'Mesajul trebuie să aibă între 1 și 4000 de caractere.' using errcode = '22001';
  end if;

  if not exists (select 1 from public.subfleets where id = p_subfleet_id) then
    raise exception 'Sub-flota nu există.' using errcode = 'P0002';
  end if;

  if public.is_cibero_admin() then
    v_role := 'admin';
  elsif p_subfleet_id = public.current_cibero_subfleet_id() then
    v_role := 'subfleet';
  else
    raise exception 'Nu ai acces la această conversație.' using errcode = '42501';
  end if;

  insert into public.subfleet_messages (subfleet_id, sender_role, sender_id, body)
  values (p_subfleet_id, v_role, auth.uid(), v_body)
  returning * into v_result;

  return v_result;
end;
$$;

create or replace function public.mark_subfleet_messages_read(p_message_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer := 0;
begin
  if coalesce(array_length(p_message_ids, 1), 0) = 0 then
    return 0;
  end if;

  if public.is_cibero_admin() then
    update public.subfleet_messages
       set read_at = now()
     where id = any(p_message_ids)
       and sender_role = 'subfleet'
       and read_at is null;
  elsif public.current_cibero_subfleet_id() is not null then
    update public.subfleet_messages
       set read_at = now()
     where id = any(p_message_ids)
       and subfleet_id = public.current_cibero_subfleet_id()
       and sender_role = 'admin'
       and read_at is null;
  else
    raise exception 'Nu ai acces la aceste mesaje.' using errcode = '42501';
  end if;

  get diagnostics v_updated = row_count;
  return v_updated;
end;
$$;

grant execute on function public.send_subfleet_message(uuid, text) to authenticated;
grant execute on function public.mark_subfleet_messages_read(uuid[]) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'subfleet_messages'
  ) then
    execute 'alter publication supabase_realtime add table public.subfleet_messages';
  end if;
end;
$$;
