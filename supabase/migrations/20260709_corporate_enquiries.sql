-- Corporate enquiry leads, written by app/api/corporate-enquiry/route.ts
-- via the service-role client before the notification email is sent, so a
-- lead survives even when email delivery fails.
--
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).

create table if not exists public.corporate_enquiries (
  id         uuid primary key default gen_random_uuid(),
  company    text not null,
  name       text not null,
  email      text not null,
  phone      text not null,
  quantity   text,
  message    text,
  created_at timestamptz not null default now()
);

-- RLS on, with no policies: anon/authenticated clients can neither read nor
-- write. Only the service-role key (server-side) can touch this table.
alter table public.corporate_enquiries enable row level security;
