-- Persist onboarding visits per account so the mandatory first guide and the
-- optional second/third-login prompt behave the same on every device.

alter table public.admin_users
  add column if not exists onboarding_login_count integer not null default 0;

alter table public.admin_users
  drop constraint if exists admin_users_onboarding_login_count_check;

alter table public.admin_users
  add constraint admin_users_onboarding_login_count_check
  check (onboarding_login_count >= 0);

create or replace function public.record_admin_onboarding_login()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_login_count integer;
begin
  update public.admin_users
     set onboarding_login_count = onboarding_login_count + 1
   where user_id = auth.uid()
     and is_active
     and role in ('admin', 'subfleet')
  returning onboarding_login_count into v_login_count;

  if v_login_count is null then
    raise exception 'Contul nu are acces activ.' using errcode = '42501';
  end if;

  return v_login_count;
end;
$$;

revoke all on function public.record_admin_onboarding_login() from public;
grant execute on function public.record_admin_onboarding_login() to authenticated;
