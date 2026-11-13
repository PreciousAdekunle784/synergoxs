-- ═══════════════════════════════════════════════════════════════════════════
-- SYNERGOX — admin dashboard, content management, first-party visit counts
--
-- HOW TO RUN:  Supabase → SQL Editor → paste this whole file → Run.
-- Safe to run more than once. It never drops or rewrites existing lead data.
--
-- SECURITY MODEL
--   • Every table has row level security ON with NO policies, so nothing can
--     be read or written through the REST API directly — not with the public
--     (anon) key, and not by a signed-in user either.
--   • All access goes through the functions below. Functions named admin_*
--     first check that the caller is a signed-in user listed in public.admins
--     and refuse otherwise. The website's public key can only call the four
--     public functions (read published content, record a page view, record a
--     consultation request, confirm a booking).
--   • No secret key is needed by the website for any of this.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────── 1. ADMINS ───────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Raises "insufficient privilege" (HTTP 401/403 through the API) for anyone
-- who is not an admin. Called first by every admin_* function.
create or replace function public._require_admin()
returns void
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Not authorised' using errcode = '42501';
  end if;
end;
$$;


-- ─────────────────────────── 2. LEADS ───────────────────────────
-- The leads table already exists (created by 0001_leads.sql). These statements
-- only ADD what the dashboard needs; existing rows and columns are untouched.
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text,
  email      text,
  meta       jsonb not null default '{}'::jsonb
);
alter table public.leads add column if not exists created_at timestamptz not null default now();
alter table public.leads add column if not exists name  text;
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists meta  jsonb default '{}'::jsonb;
alter table public.leads add column if not exists lead_status text not null default 'new';
alter table public.leads add column if not exists lead_status_updated_at timestamptz;
alter table public.leads enable row level security;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_lead_status_check') then
    alter table public.leads add constraint leads_lead_status_check
      check (lead_status in ('new','contacted','qualified','consultation_booked','converted','lost'));
  end if;
end $$;

create index if not exists leads_created_at_idx  on public.leads (created_at desc);
create index if not exists leads_lead_status_idx on public.leads (lead_status);

-- Notes and status changes on a lead. lead_id is stored as text so this works
-- whether leads.id is a uuid or a number.
create table if not exists public.lead_notes (
  id           uuid primary key default gen_random_uuid(),
  lead_id      text not null,
  kind         text not null default 'note' check (kind in ('note','status')),
  body         text not null check (char_length(body) between 1 and 4000),
  author_email text,
  created_at   timestamptz not null default now()
);
alter table public.lead_notes enable row level security;
create index if not exists lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);


-- ─────────────────────── 3. CONSULTATIONS ───────────────────────
-- One row per booking-form submission. "requested" when the form is sent,
-- "booked" when Calendly confirms a time. `token` is a private handle the
-- visitor's browser keeps so it can confirm its own request and no one else's.
create table if not exists public.consultations (
  id                   uuid primary key default gen_random_uuid(),
  token                uuid not null unique default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  name                 text not null check (char_length(name) between 1 and 200),
  email                text not null check (char_length(email) between 3 and 320),
  phone                text check (char_length(phone) <= 60),
  company              text check (char_length(company) <= 200),
  website              text check (char_length(website) <= 300),
  answers              jsonb not null default '{}'::jsonb,
  status               text not null default 'requested'
                         check (status in ('requested','booked','completed','no_show','cancelled')),
  booked_at            timestamptz,
  scheduled_at         timestamptz,
  calendly_event_uri   text check (char_length(calendly_event_uri) <= 500),
  calendly_invitee_uri text check (char_length(calendly_invitee_uri) <= 500),
  admin_notes          text check (char_length(admin_notes) <= 4000)
);
alter table public.consultations enable row level security;
create index if not exists consultations_created_idx   on public.consultations (created_at desc);
create index if not exists consultations_scheduled_idx on public.consultations (scheduled_at);


-- ─────────────────────── 4. PAGE VIEWS ───────────────────────
-- First-party visit counts. No cookies, no IP address, no personal data:
-- a path, a referring site and a random id that lasts one browser session.
create table if not exists public.page_views (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path       text not null check (char_length(path) between 1 and 300),
  referrer   text check (char_length(referrer) <= 300),
  session_id text not null check (char_length(session_id) between 8 and 64)
);
alter table public.page_views enable row level security;
create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_session_idx on public.page_views (session_id, path, created_at desc);


-- ─────────────────────── 5. WEBSITE CONTENT ───────────────────────
-- Edited text. Keys: 'copy' (headlines), 'contact' (email, links),
-- 'services' (the services list). A missing key means "use the built-in text".
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.site_content enable row level security;

create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  quote      text not null check (char_length(quote) between 1 and 1500),
  name       text not null check (char_length(name) between 1 and 120),
  role       text check (char_length(role) <= 160),
  published  boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;

create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  client     text not null check (char_length(client) between 1 and 120),
  sector     text check (char_length(sector) <= 160),
  headline   text check (char_length(headline) <= 300),
  problem    text check (char_length(problem) <= 1500),
  solution   text check (char_length(solution) <= 1500),
  outcome    text check (char_length(outcome) <= 1500),
  facts      jsonb not null default '[]'::jsonb,
  published  boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

-- Seed the one real project and its testimonial, once. Deleting them later
-- from the dashboard sticks: the marker row stops this from running again.
do $$
begin
  if not exists (select 1 from public.site_content where key = '_seed_v1') then
    insert into public.projects (client, sector, headline, problem, solution, outcome, facts, published, sort_order)
    values (
      'Kings Food Mart',
      'Grocery & foodstuff retail · Abuja, Nigeria',
      'Fifteen years of reputation, and nowhere online to send a customer who''d heard about it.',
      'Demand was arriving through WhatsApp and word of mouth, with nowhere to send it. Every enquiry was answered by hand, every order assembled one at a time, and online the brand looked like any other neighbourhood store.',
      'A full storefront: category structure, product presentation, a brand story on the homepage and a mobile-first ordering flow designed around how their customers already buy. Tuned to stay fast on Nigerian mobile data.',
      'The store is live, with an ordering path that runs without someone answering every enquiry manually. The brand now presents at the level it was already delivering at.',
      '["Mobile-first ordering flow","Copy, design and engineering by one team","Built to stay fast on mobile data"]'::jsonb,
      true, 0
    );
    insert into public.testimonials (quote, name, role, published, sort_order)
    values (
      'It blew her mind — the brand finally looked like what she''d built.',
      'Owner, Kings Food Mart',
      'Grocery retail · Abuja',
      true, 0
    );
    insert into public.site_content (key, value) values ('_seed_v1', 'true'::jsonb);
  end if;
end $$;


-- ═══════════════════════ PUBLIC FUNCTIONS ═══════════════════════
-- Callable with the website's public key.

-- Published content for the live site. Unpublished rows never leave the database.
create or replace function public.public_content()
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'copy',     (select value from public.site_content where key = 'copy'),
    'contact',  (select value from public.site_content where key = 'contact'),
    'services', (select value from public.site_content where key = 'services'),
    'testimonials', coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'quote', t.quote, 'name', t.name, 'role', t.role)
                       order by t.sort_order, t.created_at)
      from public.testimonials t where t.published), '[]'::jsonb),
    'projects', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', p.id, 'client', p.client, 'sector', p.sector, 'headline', p.headline,
               'problem', p.problem, 'solution', p.solution, 'outcome', p.outcome, 'facts', p.facts)
             order by p.sort_order, p.created_at)
      from public.projects p where p.published), '[]'::jsonb)
  );
$$;

create or replace function public.track_page_view(p_path text, p_referrer text default null, p_session text default null)
returns void
language plpgsql security definer
set search_path = public, pg_temp
as $$
begin
  if p_path is null or left(p_path, 1) <> '/' or char_length(p_path) > 300 then return; end if;
  if p_path like '/admin%' then return; end if;
  if p_session is null or char_length(p_session) not between 8 and 64 then return; end if;
  -- Ignore rapid repeats of the same page in the same session.
  if exists (select 1 from public.page_views v
             where v.session_id = p_session and v.path = p_path
               and v.created_at > now() - interval '10 seconds') then
    return;
  end if;
  insert into public.page_views (path, referrer, session_id)
  values (p_path, nullif(left(coalesce(p_referrer, ''), 300), ''), p_session);
end;
$$;

-- Called when the booking form is submitted. Returns the private token.
create or replace function public.request_consultation(
  p_name text, p_email text, p_phone text default null, p_company text default null,
  p_website text default null, p_answers jsonb default '{}'::jsonb)
returns uuid
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_token uuid;
begin
  if p_name is null or btrim(p_name) = '' or p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'A name and a valid email are required' using errcode = '22023';
  end if;
  if pg_column_size(coalesce(p_answers, '{}'::jsonb)) > 8000 then
    raise exception 'Answers too large' using errcode = '22023';
  end if;
  insert into public.consultations (name, email, phone, company, website, answers)
  values (left(btrim(p_name), 200), lower(left(btrim(p_email), 320)),
          nullif(left(btrim(coalesce(p_phone, '')), 60), ''),
          nullif(left(btrim(coalesce(p_company, '')), 200), ''),
          nullif(left(btrim(coalesce(p_website, '')), 300), ''),
          coalesce(p_answers, '{}'::jsonb))
  returning token into v_token;
  return v_token;
end;
$$;

-- Called when Calendly confirms a time. Only works with the token the same
-- browser was given, and only moves a request forward to "booked".
create or replace function public.confirm_consultation(
  p_token uuid, p_event_uri text default null, p_invitee_uri text default null,
  p_scheduled_at timestamptz default null)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_count integer;
begin
  update public.consultations c
     set status               = 'booked',
         booked_at            = coalesce(c.booked_at, now()),
         scheduled_at         = coalesce(p_scheduled_at, c.scheduled_at),
         calendly_event_uri   = coalesce(left(p_event_uri, 500), c.calendly_event_uri),
         calendly_invitee_uri = coalesce(left(p_invitee_uri, 500), c.calendly_invitee_uri),
         updated_at           = now()
   where c.token = p_token and c.status in ('requested', 'booked');
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;


-- ═══════════════════════ ADMIN FUNCTIONS ═══════════════════════

-- Who am I? Returns null (not an error) for anyone who is not an admin.
create or replace function public.admin_whoami()
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or not public.is_admin() then return null; end if;
  return jsonb_build_object(
    'user_id', auth.uid(),
    'email', (select u.email from auth.users u where u.id = auth.uid()));
end;
$$;

create or replace function public._status_rank(p text)
returns integer language sql immutable as $$
  select case p when 'new' then 1 when 'contacted' then 2 when 'qualified' then 3
                when 'consultation_booked' then 4 when 'converted' then 5 when 'lost' then 6 else 9 end;
$$;

-- One lead as the dashboard sees it. Phone, business name and the rest come
-- from the answers the form stored in `meta`.
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
    'meta',       coalesce(l.meta::jsonb, '{}'::jsonb),
    'record',     to_jsonb(l) - 'meta'
  );
$$;

create or replace function public.admin_list_leads(
  p_search text default null, p_status text default null, p_source text default null,
  p_sort text default 'newest', p_limit integer default 25, p_offset integer default 0)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare
  v_limit  integer := least(greatest(coalesce(p_limit, 25), 1), 200);
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
  v_like   text;
  v_total  bigint;
  v_rows   jsonb;
begin
  perform public._require_admin();
  if p_search is not null and btrim(p_search) <> '' then
    v_like := '%' || replace(replace(replace(btrim(p_search), '\', '\\'), '%', '\%'), '_', '\_') || '%';
  end if;

  select count(*) into v_total
    from public.leads l
   where (nullif(p_status, '') is null or l.lead_status = p_status)
     and (nullif(p_source, '') is null or l.meta::jsonb ->> 'source' = p_source)
     and (v_like is null or l.name ilike v_like or l.email ilike v_like or l.meta::text ilike v_like);

  select coalesce(jsonb_agg(x.j order by x.rn), '[]'::jsonb) into v_rows
    from (
      select public._lead_json(l) as j,
             row_number() over (order by
               case when p_sort = 'status' then public._status_rank(l.lead_status) end asc,
               case when p_sort = 'oldest' then l.created_at end asc,
               l.created_at desc) as rn
        from public.leads l
       where (nullif(p_status, '') is null or l.lead_status = p_status)
         and (nullif(p_source, '') is null or l.meta::jsonb ->> 'source' = p_source)
         and (v_like is null or l.name ilike v_like or l.email ilike v_like or l.meta::text ilike v_like)
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

create or replace function public.admin_get_lead(p_id text)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare
  v_lead  jsonb;
  v_email text;
begin
  perform public._require_admin();
  select public._lead_json(l), lower(l.email) into v_lead, v_email
    from public.leads l where l.id::text = p_id;
  if v_lead is null then return null; end if;
  return jsonb_build_object(
    'lead', v_lead,
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object('id', n.id, 'kind', n.kind, 'body', n.body,
                                          'author_email', n.author_email, 'created_at', n.created_at)
                       order by n.created_at desc)
        from public.lead_notes n where n.lead_id = p_id), '[]'::jsonb),
    'consultations', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'status', c.status, 'created_at', c.created_at,
                                          'booked_at', c.booked_at, 'scheduled_at', c.scheduled_at)
                       order by c.created_at desc)
        from public.consultations c where v_email is not null and lower(c.email) = v_email), '[]'::jsonb));
end;
$$;

create or replace function public.admin_update_lead_status(p_id text, p_status text)
returns jsonb
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_old text;
begin
  perform public._require_admin();
  if p_status not in ('new','contacted','qualified','consultation_booked','converted','lost') then
    raise exception 'Unknown status' using errcode = '22023';
  end if;
  select l.lead_status into v_old from public.leads l where l.id::text = p_id for update;
  if not found then raise exception 'Lead not found' using errcode = 'P0002'; end if;
  if v_old is distinct from p_status then
    update public.leads set lead_status = p_status, lead_status_updated_at = now() where id::text = p_id;
    insert into public.lead_notes (lead_id, kind, body, author_email)
    values (p_id, 'status', v_old || ' → ' || p_status,
            (select u.email from auth.users u where u.id = auth.uid()));
  end if;
  return jsonb_build_object('status', p_status, 'changed', v_old is distinct from p_status);
end;
$$;

create or replace function public.admin_add_lead_note(p_id text, p_body text)
returns uuid
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  perform public._require_admin();
  if p_body is null or btrim(p_body) = '' or char_length(p_body) > 4000 then
    raise exception 'A note needs between 1 and 4000 characters' using errcode = '22023';
  end if;
  if not exists (select 1 from public.leads l where l.id::text = p_id) then
    raise exception 'Lead not found' using errcode = 'P0002';
  end if;
  insert into public.lead_notes (lead_id, kind, body, author_email)
  values (p_id, 'note', btrim(p_body), (select u.email from auth.users u where u.id = auth.uid()))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.admin_delete_lead_note(p_note_id uuid)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  delete from public.lead_notes where id = p_note_id and kind = 'note';
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.admin_delete_lead(p_id text)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  delete from public.leads where id::text = p_id;
  get diagnostics v_count = row_count;
  if v_count > 0 then delete from public.lead_notes where lead_id = p_id; end if;
  return v_count > 0;
end;
$$;

create or replace function public.admin_list_consultations(p_status text default null)
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return coalesce((
    select jsonb_agg((to_jsonb(c) - 'token') || jsonb_build_object(
             'lead_id', (select l.id::text from public.leads l
                          where lower(l.email) = lower(c.email) order by l.created_at desc limit 1))
           order by c.created_at desc)
      from public.consultations c
     where nullif(p_status, '') is null or c.status = p_status), '[]'::jsonb);
end;
$$;

-- p_clear_time = true removes the scheduled time; otherwise a null time leaves it as it is.
create or replace function public.admin_update_consultation(
  p_id uuid, p_status text default null, p_scheduled_at timestamptz default null,
  p_clear_time boolean default false, p_notes text default null)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  if p_status is not null and p_status not in ('requested','booked','completed','no_show','cancelled') then
    raise exception 'Unknown status' using errcode = '22023';
  end if;
  if p_notes is not null and char_length(p_notes) > 4000 then
    raise exception 'Notes are limited to 4000 characters' using errcode = '22023';
  end if;
  update public.consultations c
     set status       = coalesce(p_status, c.status),
         booked_at    = case when coalesce(p_status, c.status) = 'booked' then coalesce(c.booked_at, now()) else c.booked_at end,
         scheduled_at = case when p_clear_time then null else coalesce(p_scheduled_at, c.scheduled_at) end,
         admin_notes  = case when p_notes is null then c.admin_notes else nullif(btrim(p_notes), '') end,
         updated_at   = now()
   where c.id = p_id;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.admin_delete_consultation(p_id uuid)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  delete from public.consultations where id = p_id;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- Everything the overview page shows, in one call. Days are counted in p_tz.
create or replace function public.admin_overview(p_days integer default 30, p_tz text default 'Africa/Lagos')
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
declare
  v_days    integer := least(greatest(coalesce(p_days, 30), 1), 365);
  v_today   date;
  v_from    date;
  v_from_ts timestamptz;
  v_track   timestamptz;
  v_rate_from timestamptz;
  v_visitors bigint;
  v_leads_rate bigint;
begin
  perform public._require_admin();
  v_today   := (now() at time zone p_tz)::date;
  v_from    := v_today - (v_days - 1);
  v_from_ts := v_from::timestamp at time zone p_tz;

  select min(created_at) into v_track from public.page_views;
  -- Conversion only compares like with like: leads since visits started being counted.
  v_rate_from := greatest(v_from_ts, coalesce(v_track, v_from_ts));
  select count(distinct session_id) into v_visitors from public.page_views where created_at >= v_from_ts;
  select count(*) into v_leads_rate from public.leads where created_at >= v_rate_from;

  return jsonb_build_object(
    'days', v_days,
    'from', v_from,
    'to', v_today,
    'tracking_since', v_track,
    'visitors', v_visitors,
    'page_views', (select count(*) from public.page_views where created_at >= v_from_ts),
    'visitors_all_time', (select count(distinct session_id) from public.page_views),
    'leads', (select count(*) from public.leads where created_at >= v_from_ts),
    'leads_all_time', (select count(*) from public.leads),
    'new_inquiries', (select count(*) from public.leads where lead_status = 'new'),
    'consultation_requests', (select count(*) from public.consultations where created_at >= v_from_ts),
    'bookings', (select count(*) from public.consultations where booked_at >= v_from_ts),
    'bookings_all_time', (select count(*) from public.consultations where booked_at is not null),
    'upcoming', (select count(*) from public.consultations where status = 'booked' and scheduled_at >= now()),
    'conversion_rate', case when v_track is null or v_visitors = 0 then null
                            -- capped: visits from browsers that opt out of counting can
                            -- make leads briefly outnumber counted visitors
                            else least(100, round(100.0 * v_leads_rate / v_visitors, 1)) end,
    'series', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'day', d.day::date, 'leads', coalesce(l.n, 0),
               'visitors', coalesce(v.n, 0), 'bookings', coalesce(b.n, 0)) order by d.day), '[]'::jsonb)
        from generate_series(v_from::timestamp, v_today::timestamp, interval '1 day') as d(day)
        left join (select (created_at at time zone p_tz)::date as day, count(*) as n
                     from public.leads where created_at >= v_from_ts group by 1) l on l.day = d.day::date
        left join (select (created_at at time zone p_tz)::date as day, count(distinct session_id) as n
                     from public.page_views where created_at >= v_from_ts group by 1) v on v.day = d.day::date
        left join (select (booked_at at time zone p_tz)::date as day, count(*) as n
                     from public.consultations where booked_at >= v_from_ts group by 1) b on b.day = d.day::date),
    'by_status', (
      select coalesce(jsonb_object_agg(s.lead_status, s.n), '{}'::jsonb)
        from (select lead_status, count(*) as n from public.leads group by 1) s),
    'by_source', (
      select coalesce(jsonb_agg(jsonb_build_object('source', s.source, 'n', s.n) order by s.n desc), '[]'::jsonb)
        from (select coalesce(nullif(meta::jsonb ->> 'source', ''), 'unknown') as source, count(*) as n
                from public.leads where created_at >= v_from_ts group by 1) s),
    'top_pages', (
      select coalesce(jsonb_agg(jsonb_build_object('path', s.path, 'n', s.n) order by s.n desc), '[]'::jsonb)
        from (select path, count(distinct session_id) as n
                from public.page_views where created_at >= v_from_ts group by 1 order by 2 desc limit 6) s),
    'latest', (
      select coalesce(jsonb_agg(x.j order by x.created_at desc), '[]'::jsonb)
        from (select public._lead_json(l) as j, l.created_at
                from public.leads l order by l.created_at desc limit 6) x),
    'activity', (
      select coalesce(jsonb_agg(jsonb_build_object('type', e.type, 'at', e.ts, 'who', e.who,
                                                   'detail', e.detail, 'lead_id', e.lead_id)
                                order by e.ts desc), '[]'::jsonb)
        from (
          select * from (
            select 'lead'::text as type, l.created_at as ts,
                   coalesce(nullif(l.name, ''), l.email, 'Someone') as who,
                   nullif(l.meta::jsonb ->> 'source', '') as detail, l.id::text as lead_id
              from public.leads l order by l.created_at desc limit 12) a
          union all
          select * from (
            select 'consultation_requested', c.created_at, c.name, c.company, null::text
              from public.consultations c order by c.created_at desc limit 12) b
          union all
          select * from (
            select 'call_booked', c.booked_at, c.name, c.company, null::text
              from public.consultations c where c.booked_at is not null order by c.booked_at desc limit 12) c2
          union all
          select * from (
            select case n.kind when 'status' then 'status_changed' else 'note_added' end, n.created_at,
                   coalesce((select coalesce(nullif(l.name, ''), l.email) from public.leads l where l.id::text = n.lead_id), 'a lead'),
                   case n.kind when 'status' then n.body else null end, n.lead_id
              from public.lead_notes n order by n.created_at desc limit 12) d
          order by ts desc
          limit 12
        ) e)
  );
end;
$$;

-- All content, including unpublished testimonials and projects.
create or replace function public.admin_get_content()
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return jsonb_build_object(
    'copy',     (select value from public.site_content where key = 'copy'),
    'contact',  (select value from public.site_content where key = 'contact'),
    'services', (select value from public.site_content where key = 'services'),
    'testimonials', coalesce((select jsonb_agg(to_jsonb(t) order by t.sort_order, t.created_at)
                                from public.testimonials t), '[]'::jsonb),
    'projects', coalesce((select jsonb_agg(to_jsonb(p) order by p.sort_order, p.created_at)
                            from public.projects p), '[]'::jsonb));
end;
$$;

-- p_value = null puts that part of the site back to its built-in text.
create or replace function public.admin_set_content(p_key text, p_value jsonb)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  if p_key not in ('copy', 'contact', 'services') then
    raise exception 'Unknown content key' using errcode = '22023';
  end if;
  if p_value is null or jsonb_typeof(p_value) = 'null' then
    delete from public.site_content where key = p_key;
    return true;
  end if;
  if pg_column_size(p_value) > 200000 then
    raise exception 'Content too large' using errcode = '22023';
  end if;
  insert into public.site_content (key, value, updated_at, updated_by)
  values (p_key, p_value, now(), (select u.email from auth.users u where u.id = auth.uid()))
  on conflict (key) do update
    set value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by;
  return true;
end;
$$;

create or replace function public.admin_save_testimonial(
  p_id uuid, p_quote text, p_name text, p_role text default null,
  p_published boolean default false, p_sort integer default 0)
returns uuid
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_id uuid;
begin
  perform public._require_admin();
  if btrim(coalesce(p_quote, '')) = '' or btrim(coalesce(p_name, '')) = '' then
    raise exception 'A quote and a name are required' using errcode = '22023';
  end if;
  if p_id is null then
    insert into public.testimonials (quote, name, role, published, sort_order)
    values (btrim(p_quote), btrim(p_name), nullif(btrim(coalesce(p_role, '')), ''),
            coalesce(p_published, false), coalesce(p_sort, 0))
    returning id into v_id;
  else
    update public.testimonials
       set quote = btrim(p_quote), name = btrim(p_name), role = nullif(btrim(coalesce(p_role, '')), ''),
           published = coalesce(p_published, false), sort_order = coalesce(p_sort, 0), updated_at = now()
     where id = p_id
    returning id into v_id;
    if v_id is null then raise exception 'Testimonial not found' using errcode = 'P0002'; end if;
  end if;
  return v_id;
end;
$$;

create or replace function public.admin_delete_testimonial(p_id uuid)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  delete from public.testimonials where id = p_id;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.admin_save_project(
  p_id uuid, p_client text, p_sector text default null, p_headline text default null,
  p_problem text default null, p_solution text default null, p_outcome text default null,
  p_facts jsonb default '[]'::jsonb, p_published boolean default false, p_sort integer default 0)
returns uuid
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_id uuid;
begin
  perform public._require_admin();
  if btrim(coalesce(p_client, '')) = '' then
    raise exception 'A project needs a name' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_facts, '[]'::jsonb)) <> 'array' or pg_column_size(coalesce(p_facts, '[]'::jsonb)) > 4000 then
    raise exception 'Facts must be a short list' using errcode = '22023';
  end if;
  if p_id is null then
    insert into public.projects (client, sector, headline, problem, solution, outcome, facts, published, sort_order)
    values (btrim(p_client), nullif(btrim(coalesce(p_sector, '')), ''), nullif(btrim(coalesce(p_headline, '')), ''),
            nullif(btrim(coalesce(p_problem, '')), ''), nullif(btrim(coalesce(p_solution, '')), ''),
            nullif(btrim(coalesce(p_outcome, '')), ''), coalesce(p_facts, '[]'::jsonb),
            coalesce(p_published, false), coalesce(p_sort, 0))
    returning id into v_id;
  else
    update public.projects
       set client = btrim(p_client), sector = nullif(btrim(coalesce(p_sector, '')), ''),
           headline = nullif(btrim(coalesce(p_headline, '')), ''),
           problem = nullif(btrim(coalesce(p_problem, '')), ''),
           solution = nullif(btrim(coalesce(p_solution, '')), ''),
           outcome = nullif(btrim(coalesce(p_outcome, '')), ''),
           facts = coalesce(p_facts, '[]'::jsonb),
           published = coalesce(p_published, false), sort_order = coalesce(p_sort, 0), updated_at = now()
     where id = p_id
    returning id into v_id;
    if v_id is null then raise exception 'Project not found' using errcode = 'P0002'; end if;
  end if;
  return v_id;
end;
$$;

create or replace function public.admin_delete_project(p_id uuid)
returns boolean
language plpgsql security definer
set search_path = public, pg_temp
as $$
declare v_count integer;
begin
  perform public._require_admin();
  delete from public.projects where id = p_id;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- For the settings page: is everything in place?
create or replace function public.admin_status()
returns jsonb
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  perform public._require_admin();
  return jsonb_build_object(
    'admins', (select coalesce(jsonb_agg(u.email order by u.email), '[]'::jsonb)
                 from public.admins a join auth.users u on u.id = a.user_id),
    'leads', (select count(*) from public.leads),
    'consultations', (select count(*) from public.consultations),
    'page_views', (select count(*) from public.page_views),
    'tracking_since', (select min(created_at) from public.page_views),
    'testimonials', (select count(*) from public.testimonials),
    'projects', (select count(*) from public.projects));
end;
$$;


-- ═══════════════════════ WHO MAY CALL WHAT ═══════════════════════
do $$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig, p.proname
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and (p.proname like 'admin\_%'
            or p.proname in ('is_admin', '_require_admin', '_lead_json', '_status_rank',
                             'public_content', 'track_page_view',
                             'request_consultation', 'confirm_consultation'))
  loop
    execute format('revoke all on function %s from public', r.sig);
    execute format('revoke all on function %s from anon', r.sig);
    execute format('revoke all on function %s from authenticated', r.sig);
    if r.proname in ('public_content', 'track_page_view', 'request_consultation', 'confirm_consultation') then
      execute format('grant execute on function %s to anon, authenticated, service_role', r.sig);
    elsif r.proname like 'admin\_%' then
      execute format('grant execute on function %s to authenticated, service_role', r.sig);
    else
      -- helpers (_require_admin, _lead_json, _status_rank, is_admin): internal only
      execute format('grant execute on function %s to service_role', r.sig);
    end if;
  end loop;
end $$;

-- New tables: no direct access for the public or signed-in roles.
revoke all on public.admins, public.lead_notes, public.consultations, public.page_views,
              public.site_content, public.testimonials, public.projects
  from anon, authenticated;

-- Tell the API layer about the new functions.
notify pgrst, 'reload schema';


-- ═══════════════════════ ONE-TIME: MAKE YOURSELF AN ADMIN ═══════════════════════
-- 1. Supabase → Authentication → Users → "Add user". Enter your email and a
--    strong password, and tick "Auto confirm user".
-- 2. Run this line (with your email) in the SQL editor:
--
--      insert into public.admins (user_id)
--      select id from auth.users where email = 'you@example.com';
--
-- 3. Recommended: Authentication → Sign In / Providers → turn OFF
--    "Allow new users to sign up". (Signing up never grants dashboard access,
--    but there is no reason to leave it open.)
