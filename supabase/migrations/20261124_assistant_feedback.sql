-- Assistant feedback: one row per answer a shopper rated with 👍 or 👎 in the
-- "Ask AI" chat on the Shopify site (app/api/shopify-assistant/feedback/route.ts).
-- Voting again on the same answer updates its row (answer_id is unique), so the
-- table holds each answer's latest vote. Use it to spot answers that went wrong.
--
-- RLS is enabled with no policies at all — by design, only the service-role
-- client ever writes to this table, and only the Supabase dashboard (which
-- uses full credentials, not RLS) ever needs to read it.
create table assistant_feedback (
  id          uuid primary key default gen_random_uuid(),
  answer_id   text not null unique,
  vote        text not null check (vote in ('up', 'down')),
  question    text not null default '',
  answer      text not null,
  page        text,
  model       text,
  created_at  timestamptz not null default now()
);

alter table assistant_feedback enable row level security;

-- Readable view — same underlying table, timestamp reformatted to IST, so
-- it's legible directly in the Supabase Table Editor. security_invoker is
-- load-bearing, not stylistic: see guest_checkout_leads_readable's comment
-- (20260823_guest_checkout_leads.sql) for why a plain view here would leak
-- every row to anyone holding the public anon key.
create view assistant_feedback_readable
with (security_invoker = true) as
select
  id,
  case vote when 'up' then '👍' else '👎' end as vote,
  question,
  answer,
  page,
  model,
  to_char(created_at at time zone 'Asia/Kolkata', 'DD Mon YYYY, HH12:MI AM') as voted_at_ist,
  created_at
from assistant_feedback
order by created_at desc;

revoke all on assistant_feedback_readable from anon, authenticated;
