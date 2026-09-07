-- A courier may have one active ticket for a specific request, while still
-- being able to submit other request types from the same email address.
-- The partial unique index also prevents a double submit race condition.
create unique index if not exists tickets_active_request_per_email_idx
on public.tickets (email, category, request_type)
where status in ('new', 'reviewing', 'clarification', 'sent_to_platform');
