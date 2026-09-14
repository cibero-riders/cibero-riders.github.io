-- Additive: preserve existing tickets, routing and access policies.
begin;

alter table public.tickets
  add column if not exists transfer_reason text
    check (char_length(transfer_reason) <= 2000),
  add column if not exists transfer_expectations text
    check (char_length(transfer_expectations) <= 2000);

comment on column public.tickets.transfer_reason is 'Optional reason for leaving the previous fleet, supplied with an account transfer request.';
comment on column public.tickets.transfer_expectations is 'Optional expectations of CibeRO, supplied with an account transfer request.';

commit;
