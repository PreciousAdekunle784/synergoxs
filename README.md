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

### 1. Email form endpoint — `lib/site.ts`

```ts
export const FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_ID";
```

Create a form at formspree.io (or getform.io / usebasin.com), paste the endpoint
URL here. The form posts JSON `{ email, source }`. That's the only change needed.

Also in this file:
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

The whole set POSTs to `FORM_ENDPOINT` as flat JSON — currency, market, model,
revenue, spend, bottleneck, what they've tried, timeline, decision authority,
contact details, plus a `recommendation` field reading "Done for you" or
"Learn track". If the POST fails, the visitor still reaches the calendar and
sees a note asking them to email instead. Never block a booking on a form.

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

A visitor who isn't ready to book a call can still enter the funnel through the
free book. The flow:

1. Hero primary CTA — **"Get the free growth playbook"** — opens an opt-in modal
   (`components/OptIn.tsx`), driven by a small context provider
   (`components/OptInProvider.tsx`) so any component can trigger it via the
   `useOptIn()` hook.
2. The visitor enters first name + email. On submit, their details POST to
   `FORM_ENDPOINT` (same endpoint as every other form) with
   `source: "synergox.co/optin"` and `leadMagnet: "The Compounding Business"`.
3. The modal switches to a success screen, opens the book
   (`/public/growth-playbook.pdf`) in a new tab, and counts down
   `REDIRECT_DELAY` seconds.
4. It then redirects to `PAYMENT_URL` — the paid next step.

### The book

`public/growth-playbook.pdf` — **The Compounding Business**, a 74-page premium
guide written and designed for this funnel (source lives outside the site repo).
It's a real lead magnet: it teaches the whole seven-lever system, then closes by
transitioning to the done-for-you offer. Swap the file (keep the filename, or
change `PLAYBOOK_URL`) if you revise it.

### What you MUST set before this earns money

Two constants in `lib/site.ts`:

- **`PAYMENT_URL`** — paste your real checkout link (Paystack, Flutterwave,
  Stripe Payment Link, etc.). Until you do, it falls back to `/apply`, so no one
  hits a dead end — but no one can pay either.
- **`FORM_ENDPOINT`** — your Formspree / Getform / Basin URL (the placeholder
  `REPLACE_WITH_YOUR_ID` must be replaced or no lead is captured).

### Emailing the book automatically — the honest setup

**A static site on Vercel cannot email a file or write to a CRM by itself.** It
has no server that runs after the form submits. So the opt-in does the two
things it *can* do client-side — it opens the book for the visitor immediately,
and it POSTs the lead to `FORM_ENDPOINT`. The actual "email the PDF to every new
subscriber" step is one connection in an email tool, not a code change.

Since you don't have an email tool yet, the simplest setup that does everything:

1. **Create a free MailerLite or Brevo account** (both have a permanent free
   tier that covers a few hundred to a few thousand contacts). Either works;
   MailerLite is the friendlier of the two to start with.
2. **Upload `growth-playbook.pdf`** to that tool's file manager, or host it where
   it already is (it's public at `/growth-playbook.pdf` on your live site).
3. **Build a one-email automation:** trigger = "subscriber joins group",
   action = send an email containing the download link. This is the email that
   actually delivers the book.
4. **Point the form at it.** Two options:
   - Easiest: replace the opt-in form's `FORM_ENDPOINT` with the email tool's
     own embedded-form action URL, so new emails land straight in your list and
     the automation fires.
   - Or keep Formspree and connect Formspree → your email tool with a Zapier /
     Make automation ("new Formspree submission → add subscriber").

Once that automation exists, every opt-in gets the book by email automatically,
and you have the lead on a list you can follow up with — which, per the book's
own Chapter 6, is where most of the money actually is.

### Analytics

`lib/analytics.ts` fires five funnel events to `dataLayer` / `gtag`, with a safe
no-op fallback so nothing breaks before you install tracking:

| Event | Fires when |
|---|---|
| `lead_email_submitted` | opt-in form submitted |
| `lead_book_sent` | success screen shown, book delivered |
| `redirect_to_payment` | visitor sent to `PAYMENT_URL` |
| `payment_page_viewed` | `/apply` (or your payment page) loads |
| `purchase_completed` | **you call this** from your checkout success page |

To capture the full funnel, add Google Tag Manager or GA4 in `app/layout.tsx`,
and on your checkout's "thank you" page call:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "purchase_completed" });
</script>
```
