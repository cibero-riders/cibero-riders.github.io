-- Privacy-friendly landing-page analytics for the public CIBERO website.
-- Raw IP addresses and user-agent strings are never persisted. The public
-- collector stores only a daily one-way visitor hash generated server-side.

create table if not exists public.site_analytics_entries (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  occurred_on date not null,
  path text not null check (char_length(path) between 1 and 180 and path like '/%'),
  referrer_host text check (referrer_host is null or char_length(referrer_host) <= 160),
  entry_kind text not null check (entry_kind in ('direct', 'external')),
  visitor_hash text not null check (visitor_hash ~ '^[a-f0-9]{64}$'),
  visit_bucket timestamptz not null,
  constraint site_analytics_entry_once_per_bucket unique (occurred_on, path, visitor_hash, visit_bucket)
);

create index if not exists site_analytics_entries_day_idx
  on public.site_analytics_entries (occurred_on desc);
create index if not exists site_analytics_entries_page_idx
  on public.site_analytics_entries (path, occurred_on desc);

alter table public.site_analytics_entries enable row level security;
revoke all on table public.site_analytics_entries from anon, authenticated;

create or replace function public.get_site_analytics_daily(p_from date, p_to date)
returns table (
  analytics_day date,
  entries bigint,
  visitors bigint,
  direct_entries bigint,
  external_entries bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_cibero_admin() then
    raise exception 'Nu ai acces la statisticile site-ului.' using errcode = '42501';
  end if;

  if p_from is null or p_to is null or p_from > p_to or p_to - p_from > 730 then
    raise exception 'Intervalul solicitat nu este valid.' using errcode = '22023';
  end if;

  return query
  select
    e.occurred_on,
    count(*)::bigint,
    count(distinct e.visitor_hash)::bigint,
    count(*) filter (where e.entry_kind = 'direct')::bigint,
    count(*) filter (where e.entry_kind = 'external')::bigint
  from public.site_analytics_entries e
  where e.occurred_on between p_from and p_to
  group by e.occurred_on
  order by e.occurred_on;
end;
$$;

create or replace function public.get_site_analytics_pages(p_from date, p_to date)
returns table (
  analytics_day date,
  page_path text,
  entries bigint,
  visitors bigint,
  direct_entries bigint,
  external_entries bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_cibero_admin() then
    raise exception 'Nu ai acces la statisticile site-ului.' using errcode = '42501';
  end if;

  if p_from is null or p_to is null or p_from > p_to or p_to - p_from > 730 then
    raise exception 'Intervalul solicitat nu este valid.' using errcode = '22023';
  end if;

  return query
  select
    e.occurred_on,
    e.path,
    count(*)::bigint,
    count(distinct e.visitor_hash)::bigint,
    count(*) filter (where e.entry_kind = 'direct')::bigint,
    count(*) filter (where e.entry_kind = 'external')::bigint
  from public.site_analytics_entries e
  where e.occurred_on between p_from and p_to
  group by e.occurred_on, e.path
  order by e.occurred_on desc, count(*) desc, e.path;
end;
$$;

revoke all on function public.get_site_analytics_daily(date, date) from public, anon;
revoke all on function public.get_site_analytics_pages(date, date) from public, anon;
grant execute on function public.get_site_analytics_daily(date, date) to authenticated;
grant execute on function public.get_site_analytics_pages(date, date) to authenticated;

comment on table public.site_analytics_entries is
  'Anonymous, deduplicated external landing-page entries. No raw IP or user-agent data is stored.';
