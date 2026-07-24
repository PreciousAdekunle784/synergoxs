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

## The two things to fill in before launch

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

---

## Structure

```
app/
  page.tsx          Home — the funnel, ten sections in order
  services/         Services detail page
  guide/            Post-booking lead magnet page (noindex)
  privacy/          Privacy policy (template — have a lawyer review)
  terms/            Terms of service (template — have a lawyer review)
  layout.tsx        Fonts, metadata, Schema.org, nav + footer
  globals.css       Type scale, component classes, reduced-motion
components/
  Hero.tsx          Headline + live pipeline panel
  SystemPanel.tsx   The hero instrument
  Problem.tsx       Six symptoms
  Method.tsx        Acquire / Convert / Scale / Automate / Optimize
  Teardown.tsx      The interactive CAC model  ← the signature element
  Services.tsx      Eight expandable capabilities
  Journey.tsx       Nine-step scroll-linked funnel spine
  Proof.tsx         Kings Food Mart case study
  Difference.tsx    Comparison table + seven-stage process
  Questions.tsx     Objection handling + FAQ
  FinalCTA.tsx      Risk reversals, booking, email capture
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
- Home is ~147 kB first-load JS; other routes ~87–94 kB

## Notes

- Google Fonts load via `<link>` in `app/layout.tsx`. To self-host, swap for
  `next/font/local` and drop the woff2 files in `app/fonts/`.
- `/guide` is set to `noindex` and excluded in `robots.ts` — it's the
  post-booking page, not a public one. Add your PDF at `public/guide.pdf`.
- The teardown's benchmarks live at the top of `Teardown.tsx` as `TARGET`.
  They're typical mid-range figures. Adjust if your niche runs differently.
