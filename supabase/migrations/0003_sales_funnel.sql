-- ═══════════════════════════════════════════════════════════════════════════
-- SYNERGOX — the two-step sales funnel
--   opt-in  →  sales page  →  packages / Growth Suite  →  checkout  →  onboarding
--
-- HOW TO RUN:  Supabase → SQL Editor → paste this whole file → Run.
-- Run 0002_admin_dashboard.sql FIRST (this file builds on it).
-- Safe to run more than once. It never drops or rewrites existing lead data.
--
-- SECURITY MODEL (same as 0002, with one addition)
--   • Every table has row level security ON with NO policies.
--   • Public functions (callable with the website's public key) only ever do
--     what an anonymous visitor may do: read the published offer, opt in,
--     start a checkout, and act on their OWN order or subscription using the
--     private token only they hold.
--   • admin_* functions check the caller is a signed-in admin.
--   • svc_* functions are callable ONLY with the service-role key, which lives
--     in the website's server environment (never in the browser). They do the
--     things nobody else may: mark an order paid after Paystack confirms it,
--     and drive the email sequence.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────── 1. EMAIL SUBSCRIBERS ───────────────────────
-- One row per email address that asked for the Blueprint. `token` is the
-- private handle used in unsubscribe and download links.
create table if not exists public.subscribers (
  id               uuid primary key default gen_random_uuid(),
  token            uuid not null unique default gen_random_uuid(),
  email            text not null unique check (char_length(email) between 3 and 320 and email = lower(email)),
  first_name       text check (char_length(first_name) <= 120),
  status           text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  source           text check (char_length(source) <= 120),
  consent_text     text check (char_length(consent_text) <= 600),
  consent_at       timestamptz,
  unsubscribed_at  timestamptz,
  -- Which email of the sequence was sent last (0 = none yet), and when the next is due.
  sequence_step    integer not null default 0,
  next_email_at    timestamptz,
  send_failures    integer not null default 0,
  last_delivery_at timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.subscribers enable row level security;
create index if not exists subscribers_due_idx on public.subscribers (next_email_at) where status = 'subscribed';
create index if not exists subscribers_created_idx on public.subscribers (created_at desc);

create table if not exists public.email_log (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  email         text not null,
  subscriber_id uuid,
  email_key     text not null check (char_length(email_key) <= 60),
  status        text not null check (status in ('sent', 'failed')),
  provider_id   text check (char_length(provider_id) <= 200),
  error         text check (char_length(error) <= 1000)
);
alter table public.email_log enable row level security;
create index if not exists email_log_created_idx on public.email_log (created_at desc);
create index if not exists email_log_key_idx on public.email_log (email_key, status);


-- ─────────────────────── 2. PACKAGES AND OFFERS ───────────────────────
create table if not exists public.funnel_settings (
  id       boolean primary key default true check (id),
  currency text not null default 'NGN' check (currency in ('NGN', 'GHS', 'KES', 'ZAR', 'USD'))
);
alter table public.funnel_settings enable row level security;
insert into public.funnel_settings (id) values (true) on conflict (id) do nothing;

-- Prices are whole numbers in the smallest unit (kobo for NGN).
create table if not exists public.packages (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 60),
  name             text not null check (char_length(name) between 1 and 80),
  audience         text check (char_length(audience) <= 300),
  description      text check (char_length(description) <= 800),
  deliverables     jsonb not null default '[]'::jsonb,
  scope            jsonb not null default '[]'::jsonb,
  delivery_time    text check (char_length(delivery_time) <= 120),
  price_minor      bigint not null check (price_minor >= 0 and price_minor <= 100000000000),
  active           boolean not null default true,
  checkout_enabled boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.packages enable row level security;

-- The all-in-one offer. One row.
create table if not exists public.bundle_offer (
  id          boolean primary key default true check (id),
  slug        text not null default 'growth-suite' check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null default 'The Complete SYNERGOX Growth Suite' check (char_length(name) between 1 and 80),
  headline    text check (char_length(headline) <= 200),
  description text check (char_length(description) <= 800),
  price_minor bigint not null default 0 check (price_minor >= 0 and price_minor <= 100000000000),
  package_ids uuid[] not null default '{}',
  extras      jsonb not null default '[]'::jsonb,
  scope       jsonb not null default '[]'::jsonb,
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);
alter table public.bundle_offer enable row level security;

-- The exit-intent offer. One row.
create table if not exists public.exit_offer (
  id                  boolean primary key default true check (id),
  enabled             boolean not null default true,
  headline            text not null default 'Wait! Before you go…' check (char_length(headline) <= 120),
  subheadline         text not null default 'What if you could get your entire business growth system for one payment?' check (char_length(subheadline) <= 200),
  body                text not null default 'You''ve seen what each solution can do individually. But what if you could combine them and get everything working together for a significantly better price?' check (char_length(body) <= 600),
  cta_label           text not null default 'Yes! I want the complete Growth Suite' check (char_length(cta_label) <= 80),
  dismiss_label       text not null default 'No thanks, I''ll continue with my original selection.' check (char_length(dismiss_label) <= 120),
  -- Optional price shown only in this offer. Null = the normal bundle price.
  special_price_minor bigint check (special_price_minor is null or special_price_minor > 0),
  min_seconds         integer not null default 20 check (min_seconds between 5 and 600),
  min_scroll_percent  integer not null default 25 check (min_scroll_percent between 0 and 90),
  desktop_trigger     boolean not null default true,
  mobile_trigger      text not null default 'back_and_scroll'
                        check (mobile_trigger in ('off', 'back', 'scroll_up', 'back_and_scroll')),
  -- Days the offer stays hidden after a visitor dismisses it. 0 = rest of this visit only.
  suppress_days       integer not null default 7 check (suppress_days between 0 and 365),
  updated_at          timestamptz not null default now()
);
alter table public.exit_offer enable row level security;
insert into public.exit_offer (id) values (true) on conflict (id) do nothing;


-- ─────────────────────── 3. ORDERS ───────────────────────
-- One row per checkout attempt. "pending" until Paystack confirms the money
-- arrived; only the server (svc_mark_order_paid) can move it to "paid".
create table if not exists public.orders (
  id                      uuid primary key default gen_random_uuid(),
  token                   uuid not null unique default gen_random_uuid(),
  reference               text not null unique check (char_length(reference) between 8 and 60),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  email                   text not null check (char_length(email) between 3 and 320),
  name                    text not null check (char_length(name) between 1 and 200),
  phone                   text check (char_length(phone) <= 60),
  item_type               text not null check (item_type in ('package', 'bundle')),
  item_slug               text not null,
  item_name               text not null,
  items                   jsonb not null default '[]'::jsonb,
  list_minor              bigint not null,
  amount_minor            bigint not null check (amount_minor > 0),
  currency                text not null,
  offer_source            text not null default 'sales_page'
                            check (offer_source in ('sales_page', 'exit_popup', 'email', 'direct')),
  status                  text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paid_at                 timestamptz,
  amount_paid_minor       bigint,
  gateway_id              text check (char_length(gateway_id) <= 80),
  channel                 text check (char_length(channel) <= 40),
  verified_via            text check (verified_via in ('callback', 'webhook', 'admin')),
  failure_reason          text check (char_length(failure_reason) <= 300),
  session_id              text check (char_length(session_id) <= 64),
  onboarding              jsonb,
  onboarding_status       text not null default 'awaiting'
                            check (onboarding_status in ('awaiting', 'submitted', 'in_progress', 'complete')),
  onboarding_submitted_at timestamptz,
  confirmation_sent_at    timestamptz,
  admin_notes             text check (char_length(admin_notes) <= 4000)
);
alter table public.orders enable row level security;
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_email_idx   on public.orders (lower(email));
create index if not exists orders_status_idx  on public.orders (status, paid_at desc);


-- ─────────────────────── 4. FUNNEL EVENTS ───────────────────────
-- What visitors did, for the dashboard. No personal data: an event name, the
-- same random per-visit id used for page views, and a few labels.
create table if not exists public.funnel_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event      text not null check (char_length(event) <= 40),
  session_id text check (char_length(session_id) <= 64),
  props      jsonb not null default '{}'::jsonb
);
alter table public.funnel_events enable row level security;
create index if not exists funnel_events_created_idx on public.funnel_events (created_at desc);
create index if not exists funnel_events_event_idx   on public.funnel_events (event, created_at desc);
create index if not exists page_views_path_idx       on public.page_views (path, created_at desc);
create index if not exists leads_email_lower_idx     on public.leads (lower(email));


-- ─────────────────────── 5. STARTING CONTENT ───────────────────────
-- Seeded once. Everything here is edited from the dashboard afterwards, and
-- deleting a package there sticks: the marker row stops this running again.
do $$
declare
  v_web uuid; v_acq uuid; v_cro uuid;
begin
  if not exists (select 1 from public.site_content where key = '_seed_funnel_v1') then
    insert into public.packages (slug, name, audience, description, deliverables, scope, delivery_time, price_minor, sort_order)
    values (
      'website-foundation', 'Website Foundation',
      'For businesses that need a professional website and a stronger online presence.',
      'A fast, credible website built around one job: turning the people who find you into enquiries. Structured for conversion first, designed to look the part second.',
      '["Professional website design","Responsive website development","Conversion-focused page structure","Essential SEO configuration","Contact and lead capture integration","Website deployment"]'::jsonb,
      '["Up to 6 pages, designed and built","Two rounds of revisions","Built from the copy and brand assets you supply","Domain, hosting and third-party fees are paid by you to the provider","Timeline starts when we receive your onboarding answers and content"]'::jsonb,
      '2–3 weeks', 10000000, 1)
    returning id into v_web;

    insert into public.packages (slug, name, audience, description, deliverables, scope, delivery_time, price_minor, sort_order)
    values (
      'customer-acquisition', 'Customer Acquisition',
      'For businesses that want a structured way to attract qualified prospects.',
      'A campaign and the page it lands on, built together so the click and the offer say the same thing. You get a repeatable way to put the right people in front of your business.',
      '["Landing page development","Conversion-focused copywriting","Meta Ads campaign setup","Google Ads campaign setup","Lead capture integration","Campaign tracking setup"]'::jsonb,
      '["One landing page and one campaign per platform","Ad accounts are created in your name; you own them","Ad spend is paid by you directly to Meta and Google and is not included","Campaign setup and launch; ongoing management is not included","Two rounds of revisions on page and ad copy"]'::jsonb,
      '2–3 weeks', 12000000, 2)
    returning id into v_acq;

    insert into public.packages (slug, name, audience, description, deliverables, scope, delivery_time, price_minor, sort_order)
    values (
      'conversion-optimization', 'Conversion Optimization',
      'For businesses that already have visitors and leads but need a better conversion experience.',
      'We go through your funnel stage by stage, find where buyers are dropping out, fix the page doing the most damage and hand you a tested plan for the rest.',
      '["Conversion audit","Funnel analysis","Landing page optimization","Customer journey improvements","A/B testing strategy","Conversion tracking recommendations"]'::jsonb,
      '["Audit of one funnel, from first visit to enquiry or sale","Optimization implemented on one existing landing page","Written findings and a prioritised action plan","Needs read access to your analytics and ad accounts","Running the A/B tests after handover is not included"]'::jsonb,
      '10–14 days', 8000000, 3)
    returning id into v_cro;

    insert into public.bundle_offer (id, slug, name, headline, description, price_minor, package_ids, extras, scope, active)
    values (
      true, 'growth-suite', 'The Complete SYNERGOX Growth Suite',
      'Why purchase each solution separately when you can get the complete growth system in one payment?',
      'Every package, planned as one project and built to work together: the website that earns trust, the campaigns that bring the right people to it, and the optimization that turns more of them into customers.',
      20000000, array[v_web, v_acq, v_cro],
      '["Combined implementation strategy","Coordinated project delivery"]'::jsonb,
      '["Everything listed in each included package, on the same scope terms","One combined strategy session before any build work starts","One project lead and one timeline across all three packages","Delivered in sequence over 6–8 weeks","Ad spend, domain, hosting and third-party fees are not included"]'::jsonb,
      true)
    on conflict (id) do nothing;

    insert into public.site_content (key, value) values ('_seed_funnel_v1', 'true'::jsonb);
  end if;
end $$;

insert into public.bundle_offer (id) values (true) on conflict (id) do nothing;


-- ═══════════════════════ HELPERS (internal) ═══════════════════════

create or replace function public._text_list(p jsonb, p_max_items integer, p_max_len integer)
returns jsonb
language sql immutable
as $$
  select coalesce(jsonb_agg(to_jsonb(left(btrim(x.v), p_max_len)) order by x.ord), '[]'::jsonb)
    from (select e.v, e.ord
            from jsonb_array_elements_text(case when jsonb_typeof(p) = 'array' then p else '[]'::jsonb end)
                 with ordinality as e(v, ord)
           where btrim(e.v) <> ''
           order by e.ord
           limit p_max_items) x;
$$;

create or replace function public._package_json(p public.packages)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'id', p.id, 'slug', p.slug, 'name', p.name, 'audience', p.audience, 'description', p.description,
    'deliverables', p.deliverables, 'scope', p.scope, 'delivery_time', p.delivery_time,
    'price_minor', p.price_minor, 'active', p.active, 'checkout_enabled', p.checkout_enabled,
    'sort_order', p.sort_order, 'updated_at', p.updated_at);
$$;

-- The bundle with its totals worked out from the packages as they are NOW.
-- `valid` is false whenever the bundle would not be a genuine saving, and the
-- website never shows or sells an invalid bundle.
create or replace function public._bundle_json()
returns jsonb
language sql stable
set search_path = public, pg_temp
as $$
  with b as (select * from public.bundle_offer limit 1),
  inc as (select p.* from public.packages p, b where p.id = any (b.package_ids) and p.active),
  t as (select coalesce(sum(price_minor), 0)::bigint as total, count(*)::int as n from inc)
  select jsonb_build_object(
           'slug', b.slug, 'name', b.name, 'headline', b.headline, 'description', b.description,
           'price_minor', b.price_minor,
           'total_minor', t.total,
           'savings_minor', greatest(t.total - b.price_minor, 0),
           'package_ids', to_jsonb(b.package_ids),
           'packages', coalesce((
             select jsonb_agg(jsonb_build_object(
                      'id', i.id, 'slug', i.slug, 'name', i.name, 'price_minor', i.price_minor,
                      'deliverables', i.deliverables, 'delivery_time', i.delivery_time)
                    order by i.sort_order, i.created_at)
               from inc i), '[]'::jsonb),
           'extras', b.extras, 'scope', b.scope, 'active', b.active,
           'valid', (b.active and t.n >= 2 and b.price_minor > 0 and b.price_minor < t.total),
           'updated_at', b.updated_at)
    from b, t;
$$;

-- The exit offer with the price it would actually charge.
create or replace function public._exit_json()
returns jsonb
language sql stable
set search_path = public, pg_temp
as $$
  with b as (select public._bundle_json() as j),
  x as (select * from public.exit_offer limit 1),
  p as (
    select case when x.special_price_minor is not null
                 and x.special_price_minor < (b.j ->> 'price_minor')::bigint
                then x.special_price_minor else (b.j ->> 'price_minor')::bigint end as price,
           (x.special_price_minor is not null
            and x.special_price_minor < (b.j ->> 'price_minor')::bigint) as special
      from x, b)
  select jsonb_build_object(
           'enabled', x.enabled, 'headline', x.headline, 'subheadline', x.subheadline, 'body', x.body,
           'cta_label', x.cta_label, 'dismiss_label', x.dismiss_label,
           'special_price_minor', x.special_price_minor,
           'price_minor', p.price,
           'is_special', p.special,
           'savings_minor', greatest((b.j ->> 'total_minor')::bigint - p.price, 0),
           'min_seconds', x.min_seconds, 'min_scroll_percent', x.min_scroll_percent,
           'desktop_trigger', x.desktop_trigger, 'mobile_trigger', x.mobile_trigger,
           'suppress_days', x.suppress_days, 'updated_at', x.updated_at)
    from x, b, p;
$$;

create or replace function public._order_json(o public.orders)
returns jsonb
language sql stable
as $$
  select to_jsonb(o) - 'token';
$$;

create or replace function public._valid_email(p text)
returns boolean language sql immutable as $$
  select p is not null and char_length(p) <= 320 and p ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$';
$$;


-- ═══════════════════════ PUBLIC FUNCTIONS ═══════════════════════
-- Callable with the website's public key.

-- Everything the public pages need to show the offer.
create or replace function public.public_funnel()
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'currency', (select currency from public.funnel_settings limit 1),
    'packages', coalesce((
      select jsonb_agg(public._package_json(p) - 'active' - 'sort_order' - 'updated_at'
                       order by p.sort_order, p.created_at)
        from public.packages p where p.active), '[]'::jsonb),
    'bundle', public._bundle_json(),
    'exit', public._exit_json());
$$;

-- Events the browser may report. Purchases are never taken from the browser.
create or replace function public.track_funnel_event(p_event text, p_session text default null, p_props jsonb default '{}'::jsonb)
returns void
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_props jsonb := coalesce(p_props, '{}'::jsonb);
begin
  if p_event not in ('package_cta_click', 'bundle_cta_click', 'exit_popup_shown', 'exit_popup_click',
                     'exit_popup_dismissed', 'blueprint_downloaded', 'checkout_view', 'booking_cta_click') then
    return;
  end if;
  if p_session is null or char_length(p_session) not between 8 and 64 then return; end if;
  if jsonb_typeof(v_props) <> 'object' or pg_column_size(v_props) > 600 then v_props := '{}'::jsonb; end if;
  -- One of each per visit is enough for these; ignore repeats.
  if p_event in ('exit_popup_shown', 'exit_popup_dismissed', 'exit_popup_click', 'checkout_view', 'blueprint_downloaded')
     and exists (select 1 from public.funnel_events e
                  where e.session_id = p_session and e.event = p_event
                    and e.props = v_props
                    and e.created_at > now() - interval '30 minutes') then
    return;
  end if;
  insert into public.funnel_events (event, session_id, props) values (p_event, p_session, v_props);
end;
$$;

-- The Blueprint opt-in. Saves the lead with where and when it came from,
-- records consent for the emails described on the form, and queues email 1.
create or replace function public.funnel_optin(
  p_name text, p_email text, p_consent_text text,
  p_session text default null, p_referrer text default null, p_utm jsonb default '{}'::jsonb,
  p_source text default 'synergox.co/blueprint')
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_email  text := lower(btrim(coalesce(p_email, '')));
  v_name   text := left(btrim(coalesce(p_name, '')), 120);
  v_source text := left(coalesce(nullif(btrim(p_source), ''), 'synergox.co/blueprint'), 120);
  v_utm    jsonb := case when jsonb_typeof(p_utm) = 'object' and pg_column_size(p_utm) <= 1200 then p_utm else '{}'::jsonb end;
  v_meta   jsonb;
  v_lead   text;
  v_new    boolean := false;
begin
  if v_name = '' or not public._valid_email(v_email) then
    raise exception 'A first name and a valid email are required' using errcode = '22023';
  end if;
  if btrim(coalesce(p_consent_text, '')) = '' then
    raise exception 'Consent is required' using errcode = '22023';
  end if;
  -- A crude brake on scripted floods; real visitors never get near it.
  if (select count(*) from public.subscribers where created_at > now() - interval '1 minute') > 60 then
    raise exception 'Too many requests, try again in a minute' using errcode = '53400';
  end if;

  v_meta := jsonb_strip_nulls(jsonb_build_object(
    'source', v_source,
    'leadMagnet', 'The Business Growth Blueprint',
    'referrer', nullif(left(coalesce(p_referrer, ''), 200), ''),
    'utm_source', nullif(left(coalesce(v_utm ->> 'utm_source', ''), 120), ''),
    'utm_medium', nullif(left(coalesce(v_utm ->> 'utm_medium', ''), 120), ''),
    'utm_campaign', nullif(left(coalesce(v_utm ->> 'utm_campaign', ''), 120), ''),
    'utm_content', nullif(left(coalesce(v_utm ->> 'utm_content', ''), 120), ''),
    'optin_at', now()));

  select l.id::text into v_lead from public.leads l
   where lower(l.email) = v_email order by l.created_at asc limit 1;
  if v_lead is null then
    insert into public.leads (name, email, meta) values (v_name, v_email, v_meta);
    v_new := true;
  else
    -- Keep where they FIRST came from; just note that they asked for the Blueprint.
    update public.leads l
       set meta = (v_meta - 'source' - 'referrer') || coalesce(l.meta::jsonb, '{}'::jsonb)
                  || jsonb_build_object('leadMagnet', 'The Business Growth Blueprint', 'optin_at', now()),
           name = coalesce(nullif(l.name, ''), v_name)
     where l.id::text = v_lead;
  end if;

  insert into public.subscribers (email, first_name, status, source, consent_text, consent_at, next_email_at)
  values (v_email, v_name, 'subscribed', v_source, left(btrim(p_consent_text), 600), now(), now())
  on conflict (email) do update
    set first_name      = excluded.first_name,
        status          = 'subscribed',
        consent_text    = excluded.consent_text,
        consent_at      = excluded.consent_at,
        unsubscribed_at = null,
        send_failures   = 0,
        next_email_at   = case when public.subscribers.sequence_step = 0 then now()
                               when public.subscribers.status = 'unsubscribed'
                                    and public.subscribers.sequence_step < 7 then now() + interval '1 day'
                               else public.subscribers.next_email_at end,
        updated_at      = now();

  insert into public.funnel_events (event, session_id, props)
  values ('optin_submitted', nullif(left(coalesce(p_session, ''), 64), ''),
          jsonb_build_object('source', v_source, 'new', v_new));

  return jsonb_build_object('ok', true, 'new', v_new);
end;
$$;

-- Unsubscribe / resubscribe, by the private token in the email link.
create or replace function public.subscription_status(p_token uuid)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
           'status', s.status,
           -- enough to recognise the address, not enough to harvest it
           'email_hint', left(s.email, 2) || '•••' || substring(s.email from position('@' in s.email)))
    from public.subscribers s where s.token = p_token;
$$;

create or replace function public.subscription_set(p_token uuid, p_subscribed boolean)
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_status text;
begin
  update public.subscribers s
     set status          = case when p_subscribed then 'subscribed' else 'unsubscribed' end,
         unsubscribed_at = case when p_subscribed then null else now() end,
         -- Coming back restarts the clock rather than sending a backlog at once.
         next_email_at   = case when p_subscribed and s.sequence_step between 1 and 6 then now() + interval '1 day'
                                when p_subscribed and s.sequence_step = 0 then now()
                                else s.next_email_at end,
         updated_at      = now()
   where s.token = p_token
  returning s.status into v_status;
  if v_status is null then return null; end if;
  return jsonb_build_object('status', v_status);
end;
$$;

-- Start a checkout. The price is worked out HERE from the packages table;
-- nothing the browser sends can change what is charged.
create or replace function public.funnel_create_order(
  p_slug text, p_email text, p_name text, p_phone text default null,
  p_offer text default 'sales_page', p_session text default null)
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_email    text := lower(btrim(coalesce(p_email, '')));
  v_name     text := left(btrim(coalesce(p_name, '')), 200);
  v_phone    text := nullif(left(btrim(coalesce(p_phone, '')), 60), '');
  v_offer    text := case when p_offer in ('sales_page', 'exit_popup', 'email', 'direct') then p_offer else 'sales_page' end;
  v_currency text;
  v_pkg      public.packages;
  v_bundle   jsonb;
  v_exit     jsonb;
  v_type     text;
  v_item     text;
  v_items    jsonb;
  v_list     bigint;
  v_amount   bigint;
  v_ref      text;
  v_token    uuid;
begin
  if v_name = '' or not public._valid_email(v_email) then
    raise exception 'A name and a valid email are required' using errcode = '22023';
  end if;
  if (select count(*) from public.orders o
       where lower(o.email) = v_email and o.created_at > now() - interval '1 hour') >= 12 then
    raise exception 'Too many checkout attempts. Please wait a little and try again.' using errcode = '53400';
  end if;

  select currency into v_currency from public.funnel_settings limit 1;
  v_bundle := public._bundle_json();

  if v_bundle is not null and p_slug = v_bundle ->> 'slug' then
    if not coalesce((v_bundle ->> 'valid')::boolean, false) then
      raise exception 'This offer is not available right now' using errcode = 'P0002';
    end if;
    v_type   := 'bundle';
    v_item   := v_bundle ->> 'name';
    v_items  := v_bundle -> 'packages';
    v_list   := (v_bundle ->> 'total_minor')::bigint;
    v_amount := (v_bundle ->> 'price_minor')::bigint;
    if v_offer = 'exit_popup' then
      v_exit := public._exit_json();
      if coalesce((v_exit ->> 'enabled')::boolean, false) then
        v_amount := (v_exit ->> 'price_minor')::bigint;
      end if;
    end if;
  else
    select * into v_pkg from public.packages p where p.slug = p_slug and p.active and p.checkout_enabled;
    if not found then
      raise exception 'This package is not available right now' using errcode = 'P0002';
    end if;
    v_type   := 'package';
    v_item   := v_pkg.name;
    v_items  := jsonb_build_array(jsonb_build_object(
                  'id', v_pkg.id, 'slug', v_pkg.slug, 'name', v_pkg.name, 'price_minor', v_pkg.price_minor,
                  'deliverables', v_pkg.deliverables, 'delivery_time', v_pkg.delivery_time));
    v_list   := v_pkg.price_minor;
    v_amount := v_pkg.price_minor;
  end if;

  if v_amount is null or v_amount <= 0 then
    raise exception 'This item has no price set yet' using errcode = 'P0002';
  end if;

  v_ref := 'SYX-' || to_char(now() at time zone 'utc', 'YYMMDD') || '-'
           || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

  insert into public.orders (reference, email, name, phone, item_type, item_slug, item_name, items,
                             list_minor, amount_minor, currency, offer_source, session_id)
  values (v_ref, v_email, v_name, v_phone, v_type, p_slug, v_item, v_items,
          v_list, v_amount, v_currency, v_offer, nullif(left(coalesce(p_session, ''), 64), ''))
  returning token into v_token;

  -- Someone who starts a checkout is a lead, even if they never opted in.
  if not exists (select 1 from public.leads l where lower(l.email) = v_email) then
    insert into public.leads (name, email, meta)
    values (v_name, v_email, jsonb_strip_nulls(jsonb_build_object(
              'source', 'synergox.co/checkout', 'phone', v_phone, 'interestedIn', v_item)));
  elsif v_phone is not null then
    update public.leads l set meta = jsonb_build_object('phone', v_phone) || coalesce(l.meta::jsonb, '{}'::jsonb)
     where lower(l.email) = v_email;
  end if;

  insert into public.funnel_events (event, session_id, props)
  values ('checkout_started', nullif(left(coalesce(p_session, ''), 64), ''),
          jsonb_build_object('slug', p_slug, 'type', v_type, 'offer', v_offer));

  return jsonb_build_object('token', v_token, 'reference', v_ref, 'amount_minor', v_amount,
                            'currency', v_currency, 'item_name', v_item, 'email', v_email);
end;
$$;

-- An order, as its buyer may see it. Only reachable with the private token.
create or replace function public.order_public(p_token uuid)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
           'reference', o.reference, 'status', o.status, 'created_at', o.created_at, 'paid_at', o.paid_at,
           'name', o.name, 'email', o.email, 'item_type', o.item_type, 'item_slug', o.item_slug,
           'item_name', o.item_name, 'items', o.items, 'list_minor', o.list_minor,
           'amount_minor', o.amount_minor, 'currency', o.currency, 'offer_source', o.offer_source,
           'failure_reason', o.failure_reason,
           'onboarding_status', o.onboarding_status, 'onboarding', o.onboarding)
    from public.orders o where o.token = p_token;
$$;

-- The project brief, sent after payment. Refused for an unpaid order.
create or replace function public.submit_onboarding(p_token uuid, p_data jsonb)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  if jsonb_typeof(p_data) <> 'object' or pg_column_size(p_data) > 12000 then
    raise exception 'That is more than the form allows' using errcode = '22023';
  end if;
  update public.orders o
     set onboarding = p_data,
         onboarding_status = case when o.onboarding_status = 'awaiting' then 'submitted' else o.onboarding_status end,
         onboarding_submitted_at = now(),
         updated_at = now()
   where o.token = p_token and o.status = 'paid';
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;


-- ═══════════════════════ SERVER-ONLY FUNCTIONS ═══════════════════════
-- Callable only with the service-role key held by the website's server.

create or replace function public.svc_order(p_reference text)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select to_jsonb(o) from public.orders o where o.reference = p_reference;
$$;

create or replace function public.svc_order_by_token(p_token uuid)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select to_jsonb(o) from public.orders o where o.token = p_token;
$$;

-- Called only after Paystack itself has confirmed the charge. Checks the
-- amount and currency again, and is safe to call twice (callback + webhook).
create or replace function public.svc_mark_order_paid(
  p_reference text, p_amount_minor bigint, p_currency text,
  p_gateway_id text default null, p_channel text default null,
  p_paid_at timestamptz default null, p_via text default 'callback')
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v public.orders;
begin
  select * into v from public.orders o where o.reference = p_reference for update;
  if not found then
    return jsonb_build_object('found', false);
  end if;
  if v.status = 'paid' then
    return jsonb_build_object('found', true, 'changed', false, 'paid', true, 'order', to_jsonb(v));
  end if;
  if upper(coalesce(p_currency, '')) <> upper(v.currency) or coalesce(p_amount_minor, 0) < v.amount_minor then
    update public.orders o
       set status = 'failed', updated_at = now(),
           failure_reason = format('Amount mismatch: expected %s %s, gateway reported %s %s',
                                   v.amount_minor, v.currency, coalesce(p_amount_minor, 0), coalesce(p_currency, '?'))
     where o.id = v.id
    returning * into v;
    return jsonb_build_object('found', true, 'changed', false, 'paid', false, 'mismatch', true, 'order', to_jsonb(v));
  end if;

  update public.orders o
     set status = 'paid',
         paid_at = coalesce(p_paid_at, now()),
         amount_paid_minor = p_amount_minor,
         gateway_id = left(p_gateway_id, 80),
         channel = left(p_channel, 40),
         verified_via = case when p_via in ('callback', 'webhook', 'admin') then p_via else 'callback' end,
         failure_reason = null,
         updated_at = now()
   where o.id = v.id
  returning * into v;

  -- The buyer is now a customer: reflect it on the lead and stop selling to them.
  update public.leads l
     set lead_status = 'converted', lead_status_updated_at = now()
   where lower(l.email) = lower(v.email) and l.lead_status <> 'converted';
  insert into public.lead_notes (lead_id, kind, body, author_email)
  select l.id::text, 'note', 'Purchased ' || v.item_name || ' (' || v.reference || ')', 'system'
    from public.leads l where lower(l.email) = lower(v.email);
  update public.subscribers s
     set next_email_at = null, updated_at = now()
   where s.email = lower(v.email) and s.sequence_step >= 1;

  return jsonb_build_object('found', true, 'changed', true, 'paid', true, 'order', to_jsonb(v));
end;
$$;

create or replace function public.svc_mark_order_failed(p_reference text, p_reason text)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  update public.orders o
     set status = 'failed', failure_reason = left(coalesce(p_reason, 'Payment was not completed'), 300), updated_at = now()
   where o.reference = p_reference and o.status = 'pending';
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- True exactly once per order, so the confirmation email is sent exactly once
-- even when the callback and the webhook arrive together.
create or replace function public.svc_claim_order_confirmation(p_reference text)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  update public.orders o set confirmation_sent_at = now()
   where o.reference = p_reference and o.status = 'paid' and o.confirmation_sent_at is null;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.svc_release_order_confirmation(p_reference text)
returns void
language sql security definer
set search_path = public, pg_temp
as $$
  update public.orders o set confirmation_sent_at = null where o.reference = p_reference;
$$;

create or replace function public.svc_subscriber(p_email text)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select to_jsonb(s) from public.subscribers s where s.email = lower(btrim(p_email));
$$;

create or replace function public.svc_subscriber_by_token(p_token uuid)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select to_jsonb(s) from public.subscribers s where s.token = p_token;
$$;

-- Subscribers whose next email is due. Only people who are still subscribed.
create or replace function public.svc_due_sequence(p_limit integer default 50)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb)
    from (select s.id, s.token, s.email, s.first_name, s.sequence_step
            from public.subscribers s
           where s.status = 'subscribed'
             and s.next_email_at is not null and s.next_email_at <= now()
             and s.sequence_step < 7
             and s.send_failures < 5
           order by s.next_email_at
           limit least(greatest(coalesce(p_limit, 50), 1), 200)) x;
$$;

-- Take responsibility for sending step N to one subscriber. True for exactly
-- one caller, so two overlapping runs can never send the same email twice.
create or replace function public.svc_claim_sequence(p_id uuid, p_step integer, p_next_at timestamptz)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  update public.subscribers s
     set sequence_step = p_step, next_email_at = p_next_at, updated_at = now(),
         last_delivery_at = case when p_step = 1 then now() else s.last_delivery_at end
   where s.id = p_id and s.status = 'subscribed' and s.sequence_step = p_step - 1;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- The send failed: put the step back and try again later.
create or replace function public.svc_release_sequence(p_id uuid, p_step integer)
returns void
language sql security definer
set search_path = public, pg_temp
as $$
  update public.subscribers s
     set sequence_step = p_step - 1, next_email_at = now() + interval '2 hours',
         send_failures = s.send_failures + 1, updated_at = now()
   where s.id = p_id and s.sequence_step = p_step;
$$;

-- Someone asked for the Blueprint again. True at most once every ten minutes.
create or replace function public.svc_claim_redelivery(p_id uuid)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  update public.subscribers s set last_delivery_at = now()
   where s.id = p_id and (s.last_delivery_at is null or s.last_delivery_at < now() - interval '10 minutes');
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.svc_log_email(
  p_email text, p_key text, p_status text, p_provider_id text default null,
  p_error text default null, p_subscriber uuid default null)
returns void
language sql security definer
set search_path = public, pg_temp
as $$
  insert into public.email_log (email, subscriber_id, email_key, status, provider_id, error)
  values (lower(left(p_email, 320)), p_subscriber, left(p_key, 60),
          case when p_status = 'sent' then 'sent' else 'failed' end,
          left(p_provider_id, 200), left(p_error, 1000));
$$;


-- ═══════════════════════ ADMIN FUNCTIONS ═══════════════════════

-- ── Packages ──
create or replace function public.admin_list_packages()
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return jsonb_build_object(
    'currency', (select currency from public.funnel_settings limit 1),
    'packages', coalesce((select jsonb_agg(public._package_json(p) order by p.sort_order, p.created_at)
                            from public.packages p), '[]'::jsonb),
    'bundle', public._bundle_json(),
    'exit', public._exit_json());
end;
$$;

create or replace function public.admin_save_package(
  p_id uuid, p_slug text, p_name text, p_audience text, p_description text,
  p_deliverables jsonb, p_scope jsonb, p_delivery_time text, p_price_minor bigint,
  p_active boolean default true, p_checkout_enabled boolean default true, p_sort integer default 0)
returns uuid
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_id  uuid;
  v_del jsonb := public._text_list(p_deliverables, 14, 120);
  v_sc  jsonb := public._text_list(p_scope, 10, 200);
begin
  perform public._require_admin();
  if btrim(coalesce(p_name, '')) = '' then
    raise exception 'A package needs a name' using errcode = '22023';
  end if;
  if p_price_minor is null or p_price_minor < 0 then
    raise exception 'A package needs a price' using errcode = '22023';
  end if;
  if jsonb_array_length(v_del) = 0 then
    raise exception 'List at least one deliverable' using errcode = '22023';
  end if;
  if p_id is null then
    if p_slug is null or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
      raise exception 'The link name may only use lowercase letters, numbers and dashes' using errcode = '22023';
    end if;
    if exists (select 1 from public.packages where slug = p_slug)
       or exists (select 1 from public.bundle_offer where slug = p_slug) then
      raise exception 'Another package already uses that link name' using errcode = '23505';
    end if;
    insert into public.packages (slug, name, audience, description, deliverables, scope, delivery_time,
                                 price_minor, active, checkout_enabled, sort_order)
    values (p_slug, btrim(p_name), nullif(btrim(coalesce(p_audience, '')), ''),
            nullif(btrim(coalesce(p_description, '')), ''), v_del, v_sc,
            nullif(btrim(coalesce(p_delivery_time, '')), ''), p_price_minor,
            coalesce(p_active, true), coalesce(p_checkout_enabled, true), coalesce(p_sort, 0))
    returning id into v_id;
  else
    update public.packages
       set name = btrim(p_name), audience = nullif(btrim(coalesce(p_audience, '')), ''),
           description = nullif(btrim(coalesce(p_description, '')), ''),
           deliverables = v_del, scope = v_sc,
           delivery_time = nullif(btrim(coalesce(p_delivery_time, '')), ''),
           price_minor = p_price_minor, active = coalesce(p_active, true),
           checkout_enabled = coalesce(p_checkout_enabled, true),
           sort_order = coalesce(p_sort, 0), updated_at = now()
     where id = p_id
    returning id into v_id;
    if v_id is null then raise exception 'Package not found' using errcode = 'P0002'; end if;
  end if;
  return v_id;
end;
$$;

create or replace function public.admin_delete_package(p_id uuid)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  delete from public.packages where id = p_id;
  get diagnostics v_count = row_count;
  if v_count > 0 then
    update public.bundle_offer set package_ids = array_remove(package_ids, p_id), updated_at = now();
  end if;
  return v_count > 0;
end;
$$;

create or replace function public.admin_set_currency(p_currency text)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  if p_currency not in ('NGN', 'GHS', 'KES', 'ZAR', 'USD') then
    raise exception 'Unsupported currency' using errcode = '22023';
  end if;
  update public.funnel_settings set currency = p_currency;
  return true;
end;
$$;

-- ── Bundle ──
-- Refuses a bundle that would not be a real saving over the packages in it.
create or replace function public.admin_save_bundle(
  p_name text, p_headline text, p_description text, p_price_minor bigint,
  p_package_ids uuid[], p_extras jsonb, p_scope jsonb, p_active boolean)
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_ids   uuid[];
  v_total bigint;
  v_n     integer;
begin
  perform public._require_admin();
  if btrim(coalesce(p_name, '')) = '' then
    raise exception 'The bundle needs a name' using errcode = '22023';
  end if;
  select coalesce(array_agg(p.id order by p.sort_order, p.created_at), '{}'),
         coalesce(sum(p.price_minor) filter (where p.active), 0), count(*) filter (where p.active)
    into v_ids, v_total, v_n
    from public.packages p where p.id = any (coalesce(p_package_ids, '{}'));
  if coalesce(p_active, false) then
    if v_n < 2 then
      raise exception 'An active bundle needs at least two active packages in it' using errcode = '22023';
    end if;
    if p_price_minor is null or p_price_minor <= 0 then
      raise exception 'Set the bundle price' using errcode = '22023';
    end if;
    if p_price_minor >= v_total then
      raise exception 'The bundle price must be lower than buying its packages separately' using errcode = '22023';
    end if;
  end if;
  update public.bundle_offer
     set name = btrim(p_name), headline = nullif(btrim(coalesce(p_headline, '')), ''),
         description = nullif(btrim(coalesce(p_description, '')), ''),
         price_minor = coalesce(p_price_minor, 0), package_ids = v_ids,
         extras = public._text_list(p_extras, 8, 120), scope = public._text_list(p_scope, 10, 200),
         active = coalesce(p_active, false), updated_at = now();
  return public._bundle_json();
end;
$$;

-- ── Exit offer ──
create or replace function public.admin_save_exit_offer(
  p_enabled boolean, p_headline text, p_subheadline text, p_body text,
  p_cta_label text, p_dismiss_label text, p_special_price_minor bigint,
  p_min_seconds integer, p_min_scroll_percent integer,
  p_desktop_trigger boolean, p_mobile_trigger text, p_suppress_days integer)
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_bundle jsonb := public._bundle_json();
begin
  perform public._require_admin();
  if btrim(coalesce(p_headline, '')) = '' or btrim(coalesce(p_cta_label, '')) = ''
     or btrim(coalesce(p_dismiss_label, '')) = '' then
    raise exception 'The headline and both button labels are required' using errcode = '22023';
  end if;
  if p_mobile_trigger not in ('off', 'back', 'scroll_up', 'back_and_scroll') then
    raise exception 'Unknown mobile trigger' using errcode = '22023';
  end if;
  if p_special_price_minor is not null then
    if p_special_price_minor <= 0 then
      raise exception 'The special price must be more than zero' using errcode = '22023';
    end if;
    if p_special_price_minor >= (v_bundle ->> 'price_minor')::bigint then
      raise exception 'A special price must be lower than the normal bundle price. Leave it empty to use the bundle price.' using errcode = '22023';
    end if;
  end if;
  update public.exit_offer
     set enabled = coalesce(p_enabled, false),
         headline = btrim(p_headline), subheadline = btrim(coalesce(p_subheadline, '')),
         body = btrim(coalesce(p_body, '')), cta_label = btrim(p_cta_label),
         dismiss_label = btrim(p_dismiss_label), special_price_minor = p_special_price_minor,
         min_seconds = least(greatest(coalesce(p_min_seconds, 20), 5), 600),
         min_scroll_percent = least(greatest(coalesce(p_min_scroll_percent, 25), 0), 90),
         desktop_trigger = coalesce(p_desktop_trigger, true),
         mobile_trigger = p_mobile_trigger,
         suppress_days = least(greatest(coalesce(p_suppress_days, 7), 0), 365),
         updated_at = now();
  return public._exit_json();
end;
$$;

-- ── Orders ──
create or replace function public.admin_list_orders(
  p_search text default null, p_status text default null, p_onboarding text default null,
  p_limit integer default 25, p_offset integer default 0)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare
  v_limit  integer := least(greatest(coalesce(p_limit, 25), 1), 200);
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
  v_like   text;
begin
  perform public._require_admin();
  if p_search is not null and btrim(p_search) <> '' then
    v_like := '%' || replace(replace(replace(btrim(p_search), '\', '\\'), '%', '\%'), '_', '\_') || '%';
  end if;
  return jsonb_build_object(
    'total', (select count(*) from public.orders o
               where (nullif(p_status, '') is null or o.status = p_status)
                 and (nullif(p_onboarding, '') is null or (o.status = 'paid' and o.onboarding_status = p_onboarding))
                 and (v_like is null or o.name ilike v_like or o.email ilike v_like
                      or o.reference ilike v_like or o.item_name ilike v_like)),
    'counts', (select coalesce(jsonb_object_agg(s.status, s.n), '{}'::jsonb)
                 from (select status, count(*) as n from public.orders group by 1) s),
    'rows', coalesce((
      select jsonb_agg(public._order_json(x) order by x.created_at desc)
        from (select o.* from public.orders o
               where (nullif(p_status, '') is null or o.status = p_status)
                 and (nullif(p_onboarding, '') is null or (o.status = 'paid' and o.onboarding_status = p_onboarding))
                 and (v_like is null or o.name ilike v_like or o.email ilike v_like
                      or o.reference ilike v_like or o.item_name ilike v_like)
               order by o.created_at desc
               limit v_limit offset v_offset) x), '[]'::jsonb));
end;
$$;

create or replace function public.admin_get_order(p_id uuid)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare v jsonb;
begin
  perform public._require_admin();
  select public._order_json(o) || jsonb_build_object(
           'lead_id', (select l.id::text from public.leads l
                        where lower(l.email) = lower(o.email) order by l.created_at limit 1))
    into v from public.orders o where o.id = p_id;
  return v;
end;
$$;

create or replace function public.admin_update_order(p_id uuid, p_onboarding_status text, p_notes text)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  if p_onboarding_status not in ('awaiting', 'submitted', 'in_progress', 'complete') then
    raise exception 'Unknown onboarding status' using errcode = '22023';
  end if;
  if p_notes is not null and char_length(p_notes) > 4000 then
    raise exception 'Notes are limited to 4000 characters' using errcode = '22023';
  end if;
  update public.orders o
     set onboarding_status = p_onboarding_status,
         admin_notes = nullif(btrim(coalesce(p_notes, '')), ''),
         updated_at = now()
   where o.id = p_id;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- ── Leads: now with purchase and subscription status ──
create or replace function public._lead_json(l public.leads)
returns jsonb
language sql stable
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id',         l.id::text,
    'created_at', l.created_at,
    'name',       l.name,
    'email',      l.email,
    'status',     l.lead_status,
    'status_updated_at', l.lead_status_updated_at,
    'phone',      nullif(l.meta::jsonb ->> 'phone', ''),
    'company',    nullif(l.meta::jsonb ->> 'company', ''),
    'website',    nullif(l.meta::jsonb ->> 'website', ''),
    'source',     nullif(l.meta::jsonb ->> 'source', ''),
    'purchase',   case when exists (select 1 from public.orders o
                                     where lower(o.email) = lower(l.email) and o.status = 'paid') then 'customer'
                       when exists (select 1 from public.orders o
                                     where lower(o.email) = lower(l.email)) then 'checkout_started'
                       else 'none' end,
    'paid_minor', (select coalesce(sum(o.amount_paid_minor), 0) from public.orders o
                    where lower(o.email) = lower(l.email) and o.status = 'paid'),
    'subscription', (select s.status from public.subscribers s where s.email = lower(l.email)),
    'meta',       coalesce(l.meta::jsonb, '{}'::jsonb),
    'record',     to_jsonb(l) - 'meta'
  );
$$;

create or replace function public._lead_matches(l public.leads, p_like text, p_status text, p_source text, p_purchase text)
returns boolean
language sql stable
set search_path = public, pg_temp
as $$
  select (nullif(p_status, '') is null or l.lead_status = p_status)
     and (nullif(p_source, '') is null or l.meta::jsonb ->> 'source' = p_source)
     and (p_like is null or l.name ilike p_like or l.email ilike p_like or l.meta::text ilike p_like)
     and (nullif(p_purchase, '') is null
          or (p_purchase = 'customer' and exists (
                select 1 from public.orders o where lower(o.email) = lower(l.email) and o.status = 'paid'))
          or (p_purchase = 'checkout_started' and exists (
                select 1 from public.orders o where lower(o.email) = lower(l.email))
              and not exists (
                select 1 from public.orders o where lower(o.email) = lower(l.email) and o.status = 'paid'))
          or (p_purchase = 'none' and not exists (
                select 1 from public.orders o where lower(o.email) = lower(l.email))));
$$;

-- Replaces the 0002 version (which had no purchase filter).
drop function if exists public.admin_list_leads(text, text, text, text, integer, integer);
create or replace function public.admin_list_leads(
  p_search text default null, p_status text default null, p_source text default null,
  p_sort text default 'newest', p_limit integer default 25, p_offset integer default 0,
  p_purchase text default null)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare
  v_limit  integer := least(greatest(coalesce(p_limit, 25), 1), 5000);
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
  v_like   text;
  v_total  bigint;
  v_rows   jsonb;
begin
  perform public._require_admin();
  if p_search is not null and btrim(p_search) <> '' then
    v_like := '%' || replace(replace(replace(btrim(p_search), '\', '\\'), '%', '\%'), '_', '\_') || '%';
  end if;

  select count(*) into v_total from public.leads l
   where public._lead_matches(l, v_like, p_status, p_source, p_purchase);

  select coalesce(jsonb_agg(x.j order by x.rn), '[]'::jsonb) into v_rows
    from (
      select public._lead_json(l) as j,
             row_number() over (order by
               case when p_sort = 'status' then public._status_rank(l.lead_status) end asc,
               case when p_sort = 'oldest' then l.created_at end asc,
               l.created_at desc) as rn
        from public.leads l
       where public._lead_matches(l, v_like, p_status, p_source, p_purchase)
       order by rn
       limit v_limit offset v_offset
    ) x;

  return jsonb_build_object(
    'total', v_total,
    'rows', v_rows,
    'sources', coalesce((select jsonb_agg(distinct s) from (
                 select l.meta::jsonb ->> 'source' as s from public.leads l) q where s is not null and s <> ''), '[]'::jsonb));
end;
$$;

-- Orders for one lead, for the lead detail page.
create or replace function public.admin_lead_orders(p_id text)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return jsonb_build_object(
    'orders', coalesce((
      select jsonb_agg(public._order_json(o) order by o.created_at desc)
        from public.orders o
       where lower(o.email) = (select lower(l.email) from public.leads l where l.id::text = p_id)), '[]'::jsonb),
    'subscriber', (
      select jsonb_build_object('status', s.status, 'consent_at', s.consent_at, 'consent_text', s.consent_text,
                                'sequence_step', s.sequence_step, 'next_email_at', s.next_email_at,
                                'unsubscribed_at', s.unsubscribed_at)
        from public.subscribers s
       where s.email = (select lower(l.email) from public.leads l where l.id::text = p_id)));
end;
$$;

-- ── Emails ──
create or replace function public.admin_email_stats()
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return jsonb_build_object(
    'subscribers', (select count(*) from public.subscribers),
    'subscribed', (select count(*) from public.subscribers where status = 'subscribed'),
    'unsubscribed', (select count(*) from public.subscribers where status = 'unsubscribed'),
    'due_now', (select count(*) from public.subscribers
                 where status = 'subscribed' and next_email_at <= now() and sequence_step < 7 and send_failures < 5),
    'stalled', (select count(*) from public.subscribers where status = 'subscribed' and send_failures >= 5),
    'by_step', (select coalesce(jsonb_object_agg(q.sequence_step::text, q.n), '{}'::jsonb)
                  from (select sequence_step, count(*) as n from public.subscribers group by 1) q),
    'by_key', (select coalesce(jsonb_object_agg(q.email_key, jsonb_build_object('sent', q.sent, 'failed', q.failed, 'last', q.last)), '{}'::jsonb)
                 from (select email_key, count(*) filter (where status = 'sent') as sent,
                              count(*) filter (where status = 'failed') as failed,
                              max(created_at) filter (where status = 'sent') as last
                         from public.email_log group by 1) q),
    'recent', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc)
        from (select e.created_at, e.email, e.email_key, e.status, e.error
                from public.email_log e order by e.created_at desc limit 30) x), '[]'::jsonb));
end;
$$;

-- ── The whole funnel in numbers. Every figure is counted from recorded
--    visits, events and orders; nothing is estimated. ──
create or replace function public.admin_funnel_overview(
  p_days integer default 30, p_tz text default 'Africa/Lagos',
  p_optin_path text default '/', p_sales_path text default '/growth-system')
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare
  v_days    integer := least(greatest(coalesce(p_days, 30), 1), 365);
  v_today   date;
  v_from    date;
  v_ts      timestamptz;
  v_track   timestamptz;
  v_visitors bigint; v_optin_visitors bigint; v_sales_visitors bigint; v_checkout_visitors bigint;
  v_optins bigint; v_started bigint; v_started_paid bigint;
  v_paid bigint; v_pkg_sales bigint; v_bundle_sales bigint; v_revenue bigint;
  v_exit_shown bigint; v_exit_click bigint; v_exit_dismiss bigint; v_exit_paid bigint; v_exit_revenue bigint;
begin
  perform public._require_admin();
  v_today := (now() at time zone p_tz)::date;
  v_from  := v_today - (v_days - 1);
  v_ts    := v_from::timestamp at time zone p_tz;

  select min(created_at) into v_track from public.page_views;
  select count(distinct session_id) into v_visitors from public.page_views where created_at >= v_ts;
  select count(distinct session_id) into v_optin_visitors from public.page_views where created_at >= v_ts and path = p_optin_path;
  select count(distinct session_id) into v_sales_visitors from public.page_views where created_at >= v_ts and path = p_sales_path;
  select count(distinct session_id) into v_checkout_visitors from public.page_views where created_at >= v_ts and path like '/checkout/%';

  select count(*) into v_optins from public.subscribers where created_at >= v_ts;

  select count(*), count(*) filter (where status = 'paid') into v_started, v_started_paid
    from public.orders where created_at >= v_ts;
  select count(*), count(*) filter (where item_type = 'package'), count(*) filter (where item_type = 'bundle'),
         coalesce(sum(amount_paid_minor), 0)
    into v_paid, v_pkg_sales, v_bundle_sales, v_revenue
    from public.orders where status = 'paid' and paid_at >= v_ts;

  select count(*) filter (where event = 'exit_popup_shown'),
         count(*) filter (where event = 'exit_popup_click'),
         count(*) filter (where event = 'exit_popup_dismissed')
    into v_exit_shown, v_exit_click, v_exit_dismiss
    from public.funnel_events where created_at >= v_ts;
  select count(*), coalesce(sum(amount_paid_minor), 0) into v_exit_paid, v_exit_revenue
    from public.orders where status = 'paid' and paid_at >= v_ts and offer_source = 'exit_popup';

  return jsonb_build_object(
    'days', v_days, 'from', v_from, 'to', v_today, 'tracking_since', v_track,
    'currency', (select currency from public.funnel_settings limit 1),
    'visitors', v_visitors,
    'optin_visitors', v_optin_visitors,
    'optins', v_optins,
    'optins_all_time', (select count(*) from public.subscribers),
    'optin_rate', case when v_optin_visitors = 0 then null
                       else least(100, round(100.0 * v_optins / v_optin_visitors, 1)) end,
    'sales_visitors', v_sales_visitors,
    'checkout_visitors', v_checkout_visitors,
    'orders_started', v_started,
    'orders_started_paid', v_started_paid,
    'abandonment_rate', case when v_started = 0 then null
                             else round(100.0 * (v_started - v_started_paid) / v_started, 1) end,
    'orders_paid', v_paid,
    'package_sales', v_pkg_sales,
    'bundle_sales', v_bundle_sales,
    'revenue_minor', v_revenue,
    'revenue_all_time_minor', (select coalesce(sum(amount_paid_minor), 0) from public.orders where status = 'paid'),
    'orders_paid_all_time', (select count(*) from public.orders where status = 'paid'),
    'aov_minor', case when v_paid = 0 then null else round(v_revenue::numeric / v_paid) end,
    'sales_rate', case when v_sales_visitors = 0 then null
                       else least(100, round(100.0 * v_paid / v_sales_visitors, 1)) end,
    'package_rate', case when v_sales_visitors = 0 then null
                         else least(100, round(100.0 * v_pkg_sales / v_sales_visitors, 1)) end,
    'bundle_rate', case when v_sales_visitors = 0 then null
                        else least(100, round(100.0 * v_bundle_sales / v_sales_visitors, 1)) end,
    'exit_shown', v_exit_shown,
    'exit_clicks', v_exit_click,
    'exit_dismissed', v_exit_dismiss,
    'exit_purchases', v_exit_paid,
    'exit_revenue_minor', v_exit_revenue,
    'exit_click_rate', case when v_exit_shown = 0 then null
                            else least(100, round(100.0 * v_exit_click / v_exit_shown, 1)) end,
    'exit_rate', case when v_exit_shown = 0 then null
                      else least(100, round(100.0 * v_exit_paid / v_exit_shown, 1)) end,
    'awaiting_onboarding', (select count(*) from public.orders where status = 'paid' and onboarding_status = 'awaiting'),
    'by_item', coalesce((
      select jsonb_agg(to_jsonb(q) order by q.sort_order, q.name)
        from (
          select i.slug, i.name, i.kind, i.sort_order,
                 (select count(*) from public.funnel_events e
                   where e.created_at >= v_ts and e.event in ('package_cta_click', 'bundle_cta_click', 'exit_popup_click')
                     and e.props ->> 'slug' = i.slug) as clicks,
                 (select count(*) from public.orders o where o.created_at >= v_ts and o.item_slug = i.slug) as checkouts,
                 (select count(*) from public.orders o
                   where o.status = 'paid' and o.paid_at >= v_ts and o.item_slug = i.slug) as sales,
                 (select coalesce(sum(o.amount_paid_minor), 0) from public.orders o
                   where o.status = 'paid' and o.paid_at >= v_ts and o.item_slug = i.slug) as revenue_minor
            from (select p.slug, p.name, 'package'::text as kind, p.sort_order from public.packages p
                  union all
                  select b.slug, b.name, 'bundle', 100000 from public.bundle_offer b) i
        ) q), '[]'::jsonb),
    'series', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'day', d.day::date, 'visitors', coalesce(v.n, 0), 'optins', coalesce(s.n, 0),
               'sales', coalesce(o.n, 0), 'revenue_minor', coalesce(o.rev, 0)) order by d.day), '[]'::jsonb)
        from generate_series(v_from::timestamp, v_today::timestamp, interval '1 day') as d(day)
        left join (select (created_at at time zone p_tz)::date as day, count(distinct session_id) as n
                     from public.page_views where created_at >= v_ts group by 1) v on v.day = d.day::date
        left join (select (created_at at time zone p_tz)::date as day, count(*) as n
                     from public.subscribers where created_at >= v_ts group by 1) s on s.day = d.day::date
        left join (select (paid_at at time zone p_tz)::date as day, count(*) as n, sum(amount_paid_minor) as rev
                     from public.orders where status = 'paid' and paid_at >= v_ts group by 1) o on o.day = d.day::date),
    'top_pages', (
      select coalesce(jsonb_agg(jsonb_build_object('path', q.path, 'n', q.n) order by q.n desc), '[]'::jsonb)
        from (select path, count(distinct session_id) as n
                from public.page_views where created_at >= v_ts group by 1 order by 2 desc limit 8) q),
    'by_source', (
      select coalesce(jsonb_agg(jsonb_build_object('source', q.source, 'n', q.n) order by q.n desc), '[]'::jsonb)
        from (select coalesce(nullif(meta::jsonb ->> 'utm_source', ''), nullif(meta::jsonb ->> 'referrer', ''), 'Direct / unknown') as source,
                     count(*) as n
                from public.leads where created_at >= v_ts group by 1 order by 2 desc limit 8) q),
    'recent_orders', coalesce((
      select jsonb_agg(public._order_json(x) order by x.created_at desc)
        from (select o.* from public.orders o order by o.created_at desc limit 6) x), '[]'::jsonb));
end;
$$;

-- For the settings page.
create or replace function public.admin_funnel_status()
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return jsonb_build_object(
    'packages', (select count(*) from public.packages),
    'orders', (select count(*) from public.orders),
    'subscribers', (select count(*) from public.subscribers),
    'events', (select count(*) from public.funnel_events),
    'emails_sent', (select count(*) from public.email_log where status = 'sent'));
end;
$$;

-- ═══════════════════════ WHO MAY CALL WHAT ═══════════════════════
do $$
declare
  r record;
  v_public text[] := array['public_content', 'track_page_view', 'request_consultation', 'confirm_consultation',
                           'public_funnel', 'track_funnel_event', 'funnel_optin', 'funnel_create_order',
                           'order_public', 'submit_onboarding', 'subscription_status', 'subscription_set'];
  v_internal text[] := array['is_admin', '_require_admin', '_lead_json', '_lead_matches', '_status_rank',
                             '_text_list', '_package_json', '_bundle_json', '_exit_json', '_order_json', '_valid_email'];
begin
  for r in
    select p.oid::regprocedure as sig, p.proname
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and (p.proname like 'admin\_%' or p.proname like 'svc\_%'
            or p.proname = any (v_public) or p.proname = any (v_internal))
  loop
    execute format('revoke all on function %s from public', r.sig);
    execute format('revoke all on function %s from anon', r.sig);
    execute format('revoke all on function %s from authenticated', r.sig);
    if r.proname = any (v_public) then
      execute format('grant execute on function %s to anon, authenticated, service_role', r.sig);
    elsif r.proname like 'admin\_%' then
      execute format('grant execute on function %s to authenticated, service_role', r.sig);
    else
      -- svc_* and helpers: the server's service-role key only
      execute format('grant execute on function %s to service_role', r.sig);
    end if;
  end loop;
end $$;

revoke all on public.subscribers, public.email_log, public.funnel_settings, public.packages,
              public.bundle_offer, public.exit_offer, public.orders, public.funnel_events
  from anon, authenticated;

notify pgrst, 'reload schema';
