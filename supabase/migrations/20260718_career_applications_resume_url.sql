-- Adds a separate optional resume link, alongside the existing portfolio link,
-- to career_applications. Written by app/api/career-application/route.ts.
--
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).

alter table public.career_applications
  add column if not exists resume_url text;
