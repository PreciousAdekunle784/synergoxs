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
  Teardown.tsx      The interactive CAC model  ← signature element one
  Paths.tsx         "How do you want to grow?"  ← signature element two
  Services.tsx      Eight expandable capabilities
  Journey.tsx       Nine-step scroll-linked funnel spine
  Proof.tsx         Kings Food Mart case study
  Difference.tsx    Comparison table + seven-stage process
  Trust.tsx         Trust indicators + testimonials
  Questions.tsx     Objection handling + FAQ
  LeadCapture.tsx   Checklist opt-in, before the booking close
  FinalCTA.tsx      Risk reversals + the two doors restated
  StickyCTA.tsx     Mobile-only sticky bar
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
