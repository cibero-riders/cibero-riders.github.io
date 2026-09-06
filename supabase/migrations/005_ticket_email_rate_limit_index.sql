-- The active-ticket check is keyed by the courier's normalized email address.
-- This index keeps that check fast as the ticket history grows.

create index if not exists tickets_email_status_idx
on public.tickets (email, status);
