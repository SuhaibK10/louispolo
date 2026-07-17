-- Career applications, written by app/api/career-application/route.ts via the
-- service-role client before the notification email is sent, so an
-- application survives even when email delivery fails.
--
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).

create table if not exists public.career_applications (
  id             uuid primary key default gen_random_uuid(),
  role           text not null,
  name           text not null,
  email          text not null,
  portfolio_url  text not null,
  tools          text,
  message        text,
  created_at     timestamptz not null default now()
);

-- RLS on, with no policies: anon/authenticated clients can neither read nor
-- write. Only the service-role key (server-side) can touch this table.
alter table public.career_applications enable row level security;
