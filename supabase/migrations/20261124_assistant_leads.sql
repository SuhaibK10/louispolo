-- Assistant leads: phone numbers shoppers give in the "May I help?" chat on the
-- Shopify site (app/api/shopify-assistant/lead/route.ts). After a few questions
-- the chat asks for a number before continuing, so the team can follow up.
-- `questions` holds what the shopper had asked so far, for context.
--
-- RLS is enabled with no policies at all — by design, only the service-role
-- client ever writes to this table, and only the Supabase dashboard (which
-- uses full credentials, not RLS) ever needs to read it.
create table assistant_leads (
  id          uuid primary key default gen_random_uuid(),
  phone       text not null,
  questions   text not null default '',
  page        text,
  created_at  timestamptz not null default now()
);

alter table assistant_leads enable row level security;

-- Readable view — same underlying table, timestamp reformatted to IST, so
-- it's legible directly in the Supabase Table Editor. security_invoker is
-- load-bearing, not stylistic: see guest_checkout_leads_readable's comment
-- (20260823_guest_checkout_leads.sql) for why a plain view here would leak
-- every number to anyone holding the public anon key.
create view assistant_leads_readable
with (security_invoker = true) as
select
  id,
  phone,
  questions,
  page,
  to_char(created_at at time zone 'Asia/Kolkata', 'DD Mon YYYY, HH12:MI AM') as asked_at_ist,
  created_at
from assistant_leads
order by created_at desc;

revoke all on assistant_leads_readable from anon, authenticated;
