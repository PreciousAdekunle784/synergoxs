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
`/apply`. Change the wording or the destination there and it changes
everywhere.

**One fallback.** `components/PlaybookLink.tsx` opens the playbook opt-in
(`components/OptIn.tsx`). It is always a text link or an outline button, never
green, so it can't compete with the call. Its success screen offers the call.

**Conversion pages have no navigation.** `/apply`, `/booked`, `/offer` and
`/thank-you` show a logo and an email address, nothing else (see `FOCUS_PATHS`
in `components/Nav.tsx`).

### The booking page — `/apply`

Five questions, about a minute: what you sell, monthly revenue (with a currency
picker), ad spend, biggest bottleneck, then name / email / website. The first
four are single taps that move on by themselves.

On submit the answers are saved to Supabase (`meta` JSON on the lead) and the
Calendly calendar appears on the same page with name and email prefilled. When
Calendly confirms a booking the visitor is taken to `/booked`. If the save
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

## Things to fill in

### 1. Testimonials — `components/Testimonials.tsx`

One quote is real (`kind: "verified"`). Six are **illustrative examples with
fictional profiles** (`kind: "sample"`); each card says so, and so does the
section. As real quotes come in, replace a sample's fields and flip `kind` to
`"verified"`. Don't remove the labels while a sample is on the page: an
invented quote presented as real is an advertising-standards problem.

### 2. Case study — `components/Proof.tsx`

Kings Food Mart. Everything there is checkable. Add a number only if you can
show a screenshot for it.

### 3. Backend keys — `lib/site.ts`

Supabase URL + anon key, Paystack public key, Calendly link, contact email.
Full walkthrough in **SETUP.txt**; lead-saving troubleshooting in
**FIX_LEADS.txt**.

### 4. Facts used in copy — `lib/site.ts`

`CALL_MINUTES`, `PLAYBOOK_PAGES`, `CASE_STUDY_URL`. Change once, updates
everywhere.

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

## Structure

```
app/
  page.tsx            Home
  apply/              Booking page (form → calendar)
  booked/             Call confirmed
  offer/              Paid build + checkout          (noindex)
  thank-you/          Payment confirmed              (noindex)
  services/           All eight capabilities
  learn/              The do-it-yourself track
  privacy/ terms/     Legal templates — have a lawyer review
  opengraph-image.tsx Social share card
components/
  CTA.tsx             The primary button (→ /apply)
  PlaybookLink.tsx    The fallback action (opens the opt-in)
  OptIn.tsx           Playbook opt-in modal
  Apply.tsx           Booking flow
  PayButton.tsx       Paystack checkout
  Hero / Problem / Teardown / System / Process / Proof /
  Testimonials / Difference / Guarantee / Questions / FinalCTA
  Nav / Footer / StickyCTA / Primitives / Icons / Eyebrow / LegalPage
lib/
  site.ts             Keys, links, funnel routes, copy facts
  services.ts         Service data (used by /services)
  analytics.ts        Event dispatch (GTM / GA4 if installed)
  paystack.ts         Paystack loader
```

## Analytics

`lib/analytics.ts` pushes to `dataLayer` / `gtag` when either is installed and
no-ops otherwise. Events, in funnel order: `booking_page_viewed`,
`application_submitted`, `call_booked` (the primary conversion),
`lead_email_submitted`, `lead_book_sent`, `payment_page_viewed`,
`purchase_completed`. Neither GTM nor GA4 is installed yet — add one to start
measuring.

## Accessibility & performance

- Keyboard reachable throughout, visible focus rings, skip link, focus trapped
  in the modal, labelled form fields with inline errors.
- `prefers-reduced-motion` disables entrance animation and smooth scrolling.
- Above-the-fold animation is CSS-only, so the headline never waits on
  JavaScript.
- Every route is prerendered as static HTML.
