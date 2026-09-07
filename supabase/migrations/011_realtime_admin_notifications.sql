-- Makes the administrative unread indicators update live when an application
-- or courier ticket is created, opened, updated, or deleted.
-- The checks make this migration safe to run once even if a table was already
-- added to the Realtime publication manually.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'applications'
  ) then
    execute 'alter publication supabase_realtime add table public.applications';
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tickets'
  ) then
    execute 'alter publication supabase_realtime add table public.tickets';
  end if;
end;
$$;
