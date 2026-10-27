-- Spin-to-win entries: captured every time a visitor spins the homepage
-- wheel (app/api/spin-to-win/route.ts), win or not. Lets ops see who to
-- follow up with and which codes actually went out, the same way
-- guest_checkout_leads tracks checkout drop-offs.
--
-- RLS is enabled with no policies at all — by design, only the service-role
-- client ever writes to this table, and only the Supabase dashboard (which
-- uses full credentials, not RLS) ever needs to read it.
create table spin_to_win_entries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text not null,
  segment_label  text not null,
  coupon_code    text,
  created_at     timestamptz not null default now()
);

alter table spin_to_win_entries enable row level security;

-- Readable view — same underlying table, timestamp reformatted to IST, so
-- it's legible directly in the Supabase Table Editor. security_invoker is
-- load-bearing, not stylistic: see guest_checkout_leads_readable's comment
-- (20260823_guest_checkout_leads.sql) for why a plain view here would leak
-- every entry to anyone holding the public anon key.
create view spin_to_win_entries_readable
with (security_invoker = true) as
select
  id,
  name,
  phone,
  segment_label,
  coupon_code,
  to_char(created_at at time zone 'Asia/Kolkata', 'DD Mon YYYY, HH12:MI AM') as spun_at_ist,
  created_at
from spin_to_win_entries
order by created_at desc;

revoke all on spin_to_win_entries_readable from anon, authenticated;
