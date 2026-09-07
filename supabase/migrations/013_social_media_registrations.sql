-- Social-media registrations share the existing admin inbox, while retaining
-- the source-specific information needed by the CibeRO team.
alter table public.applications
  add column if not exists courier_type text,
  add column if not exists nationality text,
  add column if not exists discovery_source text,
  add column if not exists desired_platforms text[] not null default '{}';

alter table public.applications drop constraint if exists applications_platform_check;
alter table public.applications
  add constraint applications_platform_check
  check (platform in ('wolt', 'glovo', 'social_media'));

alter table public.applications drop constraint if exists applications_application_type_check;
alter table public.applications
  add constraint applications_application_type_check
  check (application_type in ('new_account', 'transfer', 'social_registration'));

create index if not exists applications_social_media_created_idx
  on public.applications (created_at desc)
  where platform = 'social_media';

comment on column public.applications.courier_type is
  'Applicant profile selected in the social-media registration form.';
comment on column public.applications.discovery_source is
  'Where the applicant discovered CibeRO.';
comment on column public.applications.desired_platforms is
  'Delivery platforms selected by a social-media applicant.';
