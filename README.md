# Synergox — Revenue Growth Partner

A conversion funnel built as a Next.js site. Dark-luxury, minimal, motion-led,
with an interactive CAC teardown as the credibility centrepiece.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Ship it

```bash
npm run build
```

Deploy to Vercel: push to GitHub, import the repo, accept the defaults.
There is no backend and no environment variables, so nothing can 40x on you.

---

## The three things to fill in before launch

### 1. The funnel backend — Supabase + Paystack

Set your env vars (`.env.example` → `.env.local` and Vercel), run the database
migration, and deploy the two Edge Functions. Full step-by-step is in
**"The funnel backend (Supabase + Paystack)"** below — this is what makes the
opt-in save leads, email the book, and take payment.

Also in `lib/site.ts`:
- `BOOKING_URL` — your Calendly link (already set)
- `EMAIL` — currently `hello@synergox.co`, change if different

### 2. Case study metrics — `components/Proof.tsx`

Look for the `EDIT ME` block at the top. Replace the three metrics with numbers
you can show a screenshot for. Placeholder metrics are deliberately build-level
facts (mobile-first, one vendor, nine funnel steps) rather than invented revenue
figures — swap them for real performance data as soon as you have it.

### 3. Testimonials — `components/Trust.tsx`

Only the first testimonial is real (the Kings Food Mart owner). The other two
are marked `real: false` and are **filtered out of the render** — the grid
shows one, two or three depending on how many are marked real. So the page is
safe to ship today.

Replace the placeholders with real quotes as you collect them and flip
`real: true`. Do not launch with invented quotes: a prospect who checks one and
finds nothing behind it will not book, and a fabricated endorsement is an
advertising-standards problem in both Nigeria and the EU.

---

## Structure

```
app/
  page.tsx          Home — the funnel, twelve sections in order
  services/         Services detail page (the "done for you" path)
  learn/            Courses, workshops, community (the "learn it" path)
  apply/            Ten-question qualification gate before the calendar
  guide/            Post-booking lead magnet page (noindex)
  privacy/          Privacy policy (template — have a lawyer review)
  terms/            Terms of service (template — have a lawyer review)
  layout.tsx        Fonts, metadata, Schema.org, nav + footer
  icon.png          Favicon (512px) — Next serves this automatically
  apple-icon.png    Home-screen icon (180px)
  favicon.ico       Legacy fallback (16/32/48/64)
  globals.css       Type scale, component classes, reduced-motion
components/
  Hero.tsx          Headline + live pipeline panel
  SystemPanel.tsx   The hero instrument
  Problem.tsx       Six symptoms
  Method.tsx        Acquire / Convert / Scale / Automate / Optimize
  Teardown.tsx      The interactive CAC model  ← signature element one
  Paths.tsx         "How do you want to grow?"  ← signature element two
  Services.tsx      Eight expandable capabilities
  Journey.tsx       Nine-step scroll-linked funnel spine
  Proof.tsx         Kings Food Mart case study
  Difference.tsx    Comparison table + seven-stage process
  Trust.tsx         Trust indicators + testimonials
  Questions.tsx     Objection handling + FAQ
  LeadCapture.tsx   Checklist opt-in, before the booking close
  Guarantee.tsx     The Ship-It Guarantee — clauses and exclusions
  FinalCTA.tsx      Risk reversals + the two doors restated
  StickyCTA.tsx     Mobile-only sticky bar
  Apply.tsx         The qualification flow + currency config
lib/
  site.ts           Booking URL, email, form endpoint
  services.ts       Service data (shared by home + /services)
```

## Design system

Colour is a rule, not a palette. Green (`signal`, #00C551) only marks things
that represent measurable movement — numbers, progress, arrows, gains.
Bone (#E9E5DA) marks the old way and losses. Everything else is graphite.
If you add a section, keep that rule or the page loses its logic.

| Token | Hex | Use |
|---|---|---|
| `void` | #050605 | Page background |
| `pitch` | #0A0C0A | Alternate section background |
| `panel` | #101310 | Cards, instrument surfaces |
| `hair` | #232722 | All borders and dividers |
| `signal` | #00C551 | Measurable movement only |
| `bone` | #E9E5DA | Loss, the old way |

Type: Bricolage Grotesque (display), Instrument Sans (body),
JetBrains Mono (data, eyebrows, labels).

## Accessibility & performance

- All interactive elements keyboard reachable with a visible green focus ring
- `prefers-reduced-motion` disables Lenis and all entrance animation
- Skip-to-content link, ARIA on tabs, accordions and the toggle
- Every route prerenders as static HTML
- Home is ~158 kB first-load JS; other routes ~87–94 kB
- Mobile sticky CTA appears after the hero and hides over the final close, so
  it never covers the real call to action

## Notes

- Google Fonts load via `<link>` in `app/layout.tsx`. To self-host, swap for
  `next/font/local` and drop the woff2 files in `app/fonts/`.
- `/guide` is set to `noindex` and excluded in `robots.ts` — it's the
  post-booking page, not a public one. Add your PDF at `public/guide.pdf`.
- The teardown's benchmarks live at the top of `Teardown.tsx` as `TARGET`.
  They're typical mid-range figures. Adjust if your niche runs differently.


## Page order, and why

The home page is a sales letter, so the sequence carries the argument:

1. **Hero** — reframes the assumption (not spend, conversion)
2. **Problem** — six symptoms, agitation
3. **Method** — the mechanism, so the claim has machinery behind it
4. **Teardown** — they find their own leak; this creates the want
5. **Paths** — the fork, placed the moment the problem becomes personal
6. **Services** → **Journey** → **Proof** — support for the done-for-you path
7. **Difference** → **Trust** → **Questions** — objections, in the order they occur
8. **Lead capture** — catches everyone not ready to book
9. **Final CTA** — risk reversal, then both doors restated

If you reorder anything, keep Teardown immediately before Paths. The fork only
works once the visitor has seen their own number.

## Headline

The hero headline was chosen from a shortlist against five criteria: curiosity,
biggest pain point, measurable transformation, differentiation, impossible to
ignore. Alternates worth A/B testing against the live one:

- "You don't have a traffic problem. You have a leak you can't see."
- "The 4% who convert aren't the problem. The 96% who leave are."
- "Every month you wait, your customers get more expensive."
- "Your best month wasn't luck. It just wasn't repeatable — yet."

Swap in `components/Hero.tsx` — the `lines` array at the top, where `g: true`
marks the words that render in green.


## The qualification gate

Every "book a call" button on the site points at `/apply`, not straight at
Calendly. Ten questions, roughly ninety seconds, then the calendar appears with
name and email prefilled and the answers attached.

**Currency is question one, deliberately.** Every money question after it is
rendered in the currency chosen, so a Lagos founder sees naira bands and a
London founder sees sterling. Nobody has to convert anything in their head, and
you get a revenue figure you can trust instead of one someone guessed at.

### Editing the currencies — `components/Apply.tsx`

```ts
const CURRENCIES = {
  NGN: { symbol: "₦", label: "Nigerian Naira", rate: 1550, locale: "en-NG" },
  ...
}
```

`rate` is units per 1 USD and is used *only* to generate readable answer bands.
It never touches billing and is never shown to the visitor as an exchange rate.
Bands round to two significant figures, so a stale rate makes a band slightly
wide — it can never make the form wrong. Worth refreshing once or twice a year,
NGN especially. Add or remove currencies freely; the form adapts.

To change the bands themselves, edit `REVENUE_BANDS` and `SPEND_BANDS`. They're
expressed in USD and converted per currency, so you only maintain one list.

### The disqualification branch

If someone reports the lowest revenue band **and** no current ad spend, they
don't reach the calendar. They get an honest explanation that a retainer would
eat the margin it's meant to create, and a route to the learn track — with a
"book the call anyway" link still available, because occasionally the model is
wrong about someone.

Tune the rule in `Apply.tsx`:

```ts
const underServed = a.revenueIndex === 0 && (a.spendIndex === 0 || a.spendIndex === -1);
```

This protects your calendar and your reputation at the same time. Delete it if
you'd rather speak to everyone.

### Where the answers go

The whole set is saved to your Supabase `leads` table via the `subscribe` Edge
Function — the answers land in the row's `meta` JSON (currency, market, model,
revenue, spend, bottleneck, what they've tried, timeline, decision authority,
plus a `recommendation` field reading "Done for you" or "Learn track"). If the
save fails, the visitor still reaches the calendar and sees a note asking them
to email instead. Never block a booking on a form.

### Reverting a CTA to direct booking

Any button can skip the gate — swap `href="/apply"` for
`href={BOOKING_URL}` with `target="_blank"`. If you A/B test one, make it the
hero button: gating the very first click costs some volume in exchange for
lead quality, and that trade is worth measuring rather than assuming.


## Favicon

Generated from your logo, cropped square to the mark itself with the flat black
surround trimmed, then padded and centred on `#050605` so it matches the site
background rather than sitting on pure black.

Next.js App Router picks these up automatically from `app/` — there are no
`<link>` tags to maintain:

| File | Size | Used for |
|---|---|---|
| `app/icon.png` | 512×512 | Browser tabs, bookmarks, PWA |
| `app/apple-icon.png` | 180×180 | iOS home screen |
| `app/favicon.ico` | 16/32/48/64 | Older browsers |

To regenerate after a logo change, drop the new file in and re-export at those
three sizes. Keep the mark centred with roughly 16% padding — at 16px a tightly
cropped mark turns to mush.

`public/logo.png` was re-exported from the same square crop, so the nav and
footer marks are sharper than the original screenshot.

## The Ship-It Guarantee

`components/Guarantee.tsx`, placed immediately before the final CTA — a
guarantee works hardest directly before the ask.

Four clauses, each one something you confirmed you can honour: ship it or it's
free, fee tied to the number, you own everything from day one, thirty days'
notice. All four are written as contract clauses rather than website promises,
because that's the claim being made.

**Don't delete the exclusions block.** The section states three things the
guarantee explicitly does not cover — a revenue figure, a timeline the client
delays, and money spent on ad platforms. A guarantee with no limits reads as
marketing; a guarantee with stated limits reads as a contract, and converts
better for exactly that reason. It also means nothing in the promise can be
quietly walked back later, which is what makes it safe for you to publish.

If you add a fifth clause, the test is: could a client hold you to it in a
document? If not, it belongs somewhere else in the copy.

To keep the page from repeating itself, two Trust indicators and the three
risk-reversal cards in the final CTA were replaced when this section landed —
the close now carries a four-item strip that links back up to the full terms.

## The lead-magnet funnel (the free book)

Every conversion CTA on the site does the **same thing**: opens the book opt-in.
The opt-in saves the lead to your database, emails the book, and then offers the
paid next step through a Paystack checkout popup. One message, one destination,
everywhere.

The single exception, by design, is the **`/learn` page**, which keeps a direct
**"Book a strategy call" → `/apply`** CTA — that page is for people who chose the
do-it-yourself path.

### One button, used everywhere

`components/BookCTA.tsx` is the single site-wide conversion button (Nav, Hero,
Teardown, Paths done-for-you card, Guarantee, final CTA, services, footer). It
opens the opt-in modal via `useOptIn()`. Change it once, it changes everywhere.

### The flow, end to end

1. A CTA opens the opt-in modal (`components/OptIn.tsx`).
2. Visitor enters first name + email and submits.
3. The modal calls your **Supabase Edge Function** (`subscribe`), which
   **saves the lead** to the `leads` table and **emails the book** via Resend.
4. The success screen appears and the book also opens in a new tab as a backstop.
5. Visitor clicks **"Continue to the next step"** → the **Paystack popup** opens
   (inline checkout, your public key) for the paid offer.
6. On successful payment, `purchase_completed` fires and they're sent to `/guide`.

Every step degrades gracefully: if Supabase isn't set, the success screen still
shows and links the book; if Paystack isn't set, "Continue" falls back to
`/apply`. So the site never dead-ends, even mid-setup.

### The book

`public/growth-playbook.pdf` — **The Compounding Business**, a 74-page premium
guide. It's a real lead magnet: teaches the whole seven-lever system, then
transitions to the done-for-you offer. Swap the file (keep the name) to revise.

---

## The funnel backend (Supabase + Paystack)

This is the part that turns the funnel from a demo into something that captures
leads, emails the book, and takes payment. Three pieces: **frontend env vars**,
**a database table**, and **two Edge Functions**.

### 1. Frontend env vars

Copy `.env.example` to `.env.local` and fill in the public values (also add them
in Vercel → Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxx
NEXT_PUBLIC_OFFER_AMOUNT_KOBO=5000000        # ₦50,000 — set your price (kobo)
NEXT_PUBLIC_OFFER_CURRENCY=NGN
NEXT_PUBLIC_OFFER_LABEL=Growth System Build — Deposit
```

These are all **public** keys — safe in the browser. Secret keys never go here.

### 2. The database

In the Supabase SQL editor, run `supabase/migrations/0001_leads.sql`. It creates
a `leads` table (email, name, source, paid status, a `meta` JSON column for the
qualification answers) with **Row Level Security on and no public policies** —
so leads can only be written by your Edge Functions, never read from the browser.

Every form on the site writes here: the opt-in (with the book emailed), the
homepage checklist capture (`sendBook:false`), and the `/apply` qualification
flow (answers stored in `meta`).

### 3. The Edge Functions

Two functions live in `supabase/functions/`. Deploy with the Supabase CLI:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase functions deploy subscribe
supabase functions deploy verify-payment
```

Then set their **secrets** (these are the sensitive keys — they live in Supabase,
never in the repo or the browser):

```bash
supabase secrets set RESEND_API_KEY=re_xxxx
supabase secrets set BOOK_URL=https://synergox.co/growth-playbook.pdf
supabase secrets set FROM_EMAIL="Synergox <hello@synergox.co>"
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxxx
```

- **`subscribe`** — saves the lead and emails the book via Resend.
- **`verify-payment`** — optional but recommended: verifies a Paystack
  transaction server-side so a "paid" state can't be faked, and marks the lead
  paid. Call it from a thank-you page with the transaction `reference` if you
  want server-verified payments.

### Emailing the book — Resend setup

1. Create a free [Resend](https://resend.com) account.
2. **Verify your sending domain** (add the DNS records Resend gives you). Until
   you do, you can only send from `onboarding@resend.dev` for testing.
3. Create an API key, set it as the `RESEND_API_KEY` secret above.
4. Set `FROM_EMAIL` to an address on your verified domain.

That's it — every opt-in now gets the book automatically, from your own domain,
and every lead is on a list (your `leads` table) you can export or follow up.

### Paystack setup

1. In your Paystack dashboard, grab your **public** key (`pk_live_…`) → put it in
   `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
2. Grab your **secret** key (`sk_live_…`) → set it as the `PAYSTACK_SECRET_KEY`
   Supabase secret (for `verify-payment`). It never touches the frontend.
3. Set the offer price in `NEXT_PUBLIC_OFFER_AMOUNT_KOBO` (kobo: ₦50,000 =
   `5000000`), plus currency and label.

The popup uses **inline checkout** (`lib/paystack.ts`), so payment happens right
on your site — no redirect away. On success it fires `purchase_completed` and
sends the buyer to `/guide`.

> **The book is free.** The Paystack popup charges for your **paid offer** (the
> done-for-you build/deposit), which is the upsell *after* the free book. The
> book is always delivered for free the moment someone opts in.

### Analytics

`lib/analytics.ts` fires five funnel events to `dataLayer` / `gtag`, with a safe
no-op fallback:

| Event | Fires when |
|---|---|
| `lead_email_submitted` | opt-in form submitted |
| `lead_book_sent` | success screen shown, book delivered |
| `payment_page_viewed` | Paystack popup opened (or `/apply` loaded) |
| `redirect_to_payment` | fallback redirect when Paystack isn't set |
| `purchase_completed` | Paystack payment succeeded |

Add Google Tag Manager or GA4 in `app/layout.tsx` and these start reporting the
full funnel automatically — `purchase_completed` now fires on its own from the
Paystack success callback, so you no longer need to wire it manually.
