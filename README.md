# Synergox — growth marketing agency funnel

A Next.js site built around one conversion: **booking the free 30-minute
growth teardown call.** White, black and green. Static, fast, no backend of its
own.

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Deploy to Vercel: push to GitHub, import the repo, accept the defaults.

---

## The funnel

```
PRIMARY     any green button → /apply (5 questions) → calendar → /booked
FALLBACK    "free playbook" link → opt-in (name + email) → success screen → /apply
CHECKOUT    /offer → Paystack → /thank-you          (unlisted; send the link)
```

**One primary action.** Every green button is `components/CTA.tsx` and goes to
`/apply`. Its wording is edited in the dashboard (Website content → Hero).

**One fallback.** `components/PlaybookLink.tsx` opens the playbook opt-in
(`components/OptIn.tsx`). It is always a text link or an outline button, never
green, so it can't compete with the call. Its success screen offers the call.

**Conversion pages have no navigation.** `/apply`, `/booked`, `/offer` and
`/thank-you` show a logo and an email address, nothing else (see `FOCUS_PATHS`
in `components/Nav.tsx`).

### The booking page — `/apply`

Five questions, about a minute: what you sell, monthly revenue (with a currency
picker), ad spend, biggest bottleneck, then name, email, business name and
optionally phone and website. The first four are single taps that move on by
themselves.

On submit the answers are saved to Supabase (`meta` JSON on the lead), a
consultation record is created for the dashboard, and the Calendly calendar
appears on the same page with name and email prefilled. When Calendly confirms
a booking the record is marked booked and the visitor is taken to `/booked`. If the save
fails, the calendar still appears with a note — a booking is never blocked on a
form.

**The honest "no".** Lowest revenue band *and* no ad spend → the visitor gets a
straight explanation that a build would cost more than it returns, and a route
to `/learn`, with "book the call anyway" still available. Tune or delete the
rule in `components/Apply.tsx`:

```ts
const underServed = a.revenueIndex === 0 && a.spendIndex === 0;
```

Currencies and bands are at the top of the same file. `rate` is only used to
print readable ranges; it never touches billing.

### The paid offer — `/offer`

The checkout page for the Growth System Build (₦199,999, set by
`NEXT_PUBLIC_OFFER_AMOUNT_KOBO`). It is `noindex` and not linked from the menu:
send it to prospects who are ready to start, typically after their call.
Paystack opens inline; the payment is verified server-side, then `/thank-you`.

---

## The admin dashboard — `/admin`

Sign in at `/admin` to see how the site is doing and to change it without
touching code. One-time setup is in **ADMIN_SETUP.txt** (run one SQL file,
create your admin user).

| Screen | What it does |
|---|---|
| Overview | Visitors, leads, bookings, new inquiries, conversion rate, charts per day, pipeline, sources, latest submissions, recent activity |
| Leads | Search, filter, sort. Per lead: everything they submitted, status, internal notes, delete |
| Consultations | Each booking-form submission and whether it became a booked call. Status, call time, notes |
| Website content | Headlines and copy, services, case studies, testimonials, contact details and links |
| Settings | Change password, who can sign in, what is connected |

**Only real data.** Nothing on the overview is estimated. A number whose
source isn't collecting yet shows "—" and says why.

**Content edits go live on save.** The public site reads its editable content
from the database (`lib/content/get.ts`), cached, and the cache is cleared the
moment something is saved. Anything you haven't edited uses the built-in text
in `lib/content/defaults.ts`. If the database can't be reached, the site falls
back to that built-in text rather than breaking.

**Testimonials and case studies** are managed entirely in the dashboard.
Only published ones are shown; with none published, that section of the home
page is left out. Publishing a testimonial requires ticking a box confirming
it is a real client's own words, used with their agreement.

### How it is secured

- Supabase Auth for sign-in; the session is two httpOnly cookies scoped to
  `/admin`.
- `middleware.ts` blocks `/admin` without a session; every page and action
  then verifies admin membership in the database.
- Every table has row level security on with no policies. All reads and
  writes go through database functions in
  `supabase/migrations/0002_admin_dashboard.sql`, and each `admin_*` function
  checks the caller is an admin.
- The site only holds the public key. No service-role key is used.

---

## Things to fill in

### 1. The dashboard — ADMIN_SETUP.txt

Run the migration and create your admin user. Then add real testimonials and
case studies under Website content.

### 2. Backend keys — `lib/site.ts`

Supabase URL + anon key, Paystack public key. Full walkthrough in
**SETUP.txt**; lead-saving troubleshooting in **FIX_LEADS.txt**. The Calendly
link and contact email have defaults there but are edited in the dashboard.

### 3. Facts used in copy — `lib/site.ts`

`CALL_MINUTES`, `PLAYBOOK_PAGES`. Change once, updates everywhere.

---

## Home page order, and why

Each section answers the question the one before it raises.

| # | Section | The question it answers |
|---|---|---|
| 1 | Hero | What is this, and what do I do next? |
| 2 | Problem | Is this about me? |
| 3 | Calculator | What is it costing me? |
| 4 | What we build | What would you actually do? |
| 5 | How it works | How long, and how much of my time? |
| 6 | Case study | Has it worked for anyone? |
| 7 | Testimonials | What's it like to work with you? |
| 8 | Why Synergox | Why you and not another agency? |
| 9 | Guarantee | What if it doesn't work? |
| 10 | FAQ | Everything else. |
| 11 | Final CTA | The ask, with what they get. |

The calculator's benchmarks are `TARGET` at the top of
`components/Teardown.tsx`. They're typical mid-range figures, stated as
targets, not promises.

**The guarantee.** Four clauses, each one something you can be held to in a
contract, plus three stated exclusions. Keep the exclusions: a guarantee with
limits reads as a contract; one without reads as marketing.

---

## Design system

Tokens are in `tailwind.config.ts`; component classes in `app/globals.css`.

| Token | Hex | Use |
|---|---|---|
| `paper` | #FFFFFF | The page. Dominant. |
| `mist` | #F5F6F4 | Alternate section background, quiet panels |
| `line` | #E3E6E1 | Borders |
| `ink` | #0A0C0A | Headlines, black blocks, footer |
| `body` / `mute` | #454C45 / #5E665E | Paragraph text / captions |
| `green` | #00C551 | Fills: primary buttons, bars, ticks. Always with black text |
| `greenDeep` | #007A35 | Green *text* on white (plain `green` fails contrast) |

Rules that keep it consistent:

- **White first.** Black is for type, the footer and the occasional emphasis
  block (`slab-dark on-dark`). Don't add a black section without removing one.
- **Green means "do this" or "this is the point".** One green button style,
  one destination.
- `.hl` puts a green marker under a key phrase; the text stays black.
- Classes: `.btn-primary`, `.btn-dark`, `.btn-outline`, `.card`, `.field`,
  `.eyebrow`, `.h-section`, `.lede`, `.section`, `.shell`.

Type: Bricolage Grotesque (headlines) and Instrument Sans (body), self-hosted
through `next/font` — no request to Google at runtime.

## Motion

Animation is CSS where it can be (hero entrance, page transition, button and
card hovers, background drift) and Framer Motion for scroll reveals, staggered
grids and accordions (`components/Primitives.tsx`). No other animation library.

- Hero: words rise one by one, the marker draws under the key phrase, the
  rest follows in sequence; two soft shapes drift slowly behind it.
- Sections fade and rise as they enter; card grids arrive staggered; the green
  marker under a headline draws itself the first time it is seen.
- Buttons lift and catch a band of light on hover; cards lift and grow a green
  top edge; the header tightens once you scroll; mobile menu items slide in.
- `prefers-reduced-motion`: movement is removed everywhere, a plain fade is
  kept, and the page is fully usable.

One thing to remember if you add a page-level animation: never leave a
`transform` applied to a wrapper after it finishes. It breaks
`position: fixed` children such as the mobile sticky bar. See the comment on
the `page` animation in `tailwind.config.ts`.

## Structure

```
app/
  layout.tsx            Document shell and fonts only
  (site)/               The public website (navigation + footer)
    page.tsx              Home
    apply/                Booking page (form → calendar)
    booked/               Call confirmed
    offer/                Paid build + checkout          (noindex)
    thank-you/            Payment confirmed              (noindex)
    services/ learn/      Services; the do-it-yourself track
    privacy/ terms/       Legal templates — have a lawyer review
  admin/                The dashboard
    login/                Sign in
    (dash)/               Overview, leads, consultations, content, settings
  api/booking/confirm/  Records a confirmed Calendly booking
  opengraph-image.tsx   Social share card
middleware.ts           Guards /admin
components/
  CTA.tsx               The primary button (→ /apply)
  PlaybookLink.tsx      The fallback action (opens the opt-in)
  Apply.tsx             Booking flow
  Primitives.tsx        Reveal, Stagger, Mark, SectionHead
  TrackPageView.tsx     First-party visit counting
  admin/                Dashboard shell, forms, charts, editors
  …                     One file per home-page section
lib/
  site.ts               Keys, funnel routes, copy facts
  content/              Built-in text + the database merge
  admin/                Session, server actions, shared constants
  supabase/             Database-function and auth calls (server side)
  analytics.ts          Event dispatch (GTM / GA4 if installed)
supabase/migrations/    Database script for the dashboard
```

## Analytics

Two separate things:

- **Visit counting for the dashboard** is built in (`TrackPageView.tsx`): page
  path, referring site and a per-session random id. No cookies.
- **Marketing events** (`lib/analytics.ts`) push to `dataLayer` / `gtag` when
  GTM or GA4 is installed and do nothing otherwise: `booking_page_viewed`,
  `application_submitted`, `call_booked`, `lead_email_submitted`,
  `lead_book_sent`, `payment_page_viewed`, `purchase_completed`. Neither GTM
  nor GA4 is installed.

## Accessibility & performance

- Keyboard reachable throughout, visible focus rings, skip link, focus trapped
  in the modal, labelled form fields with inline errors.
- `prefers-reduced-motion` disables entrance animation and smooth scrolling.
- Above-the-fold animation is CSS-only, so the headline never waits on
  JavaScript.
- Every route is prerendered as static HTML.
