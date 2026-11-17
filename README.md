# SYNERGOX — two-step sales funnel

A free resource captures the lead; a long-form sales page sells three
fixed-scope packages and an all-in-one bundle; an exit-intent offer presents
the bundle once to people about to leave; Paystack takes payment; a project
brief and a seven-email sequence follow. Everything is run from `/admin`.

```
/                      Opt-in: The Business Growth Blueprint (first name + email)
   ↓ saves lead + consent, sends email 1, hands over the PDF
/growth-system         Sales page: problem → method → packages → Growth Suite
   ↓ any buy button                      ↘ exit intent → Growth Suite offer
/checkout/[package]    Name, email, phone → Paystack's hosted checkout
   ↓ Paystack returns here; the server verifies the payment
/order/[token]         Confirmed / not received / declined → project brief
```

Going live: **SETUP.txt**. Dashboard sign-in: **ADMIN_SETUP.txt**.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

---

## The pages

| Route | Job |
|---|---|
| `/` | Lead magnet page. Hero with the guide, what's inside (its real contents), who it's for, real pages from the PDF, final opt-in. Logo only in the header: the form is the one action. |
| `/growth-system` | Sales page. Problem, the DISCOVER → STRATEGIZE → BUILD → ACQUIRE → OPTIMIZE method, the three packages, the Growth Suite (Option A vs Option B), case study, what happens after paying, FAQ, final CTA. Mobile sticky bar. Exit-intent offer. |
| `/checkout/[slug]` | Checkout for one package or the bundle. Prices read fresh from the database. Quiet bundle suggestion for packages in it. |
| `/order/[token]` | Private order page (the link is in the receipt). Verifies with Paystack on arrival unless already paid. Paid → receipt, next steps, project brief. Otherwise → a recovery page. |
| `/unsubscribe?t=` | One deliberate click to unsubscribe; resubscribe if it was a mistake. |
| `/apply`, `/booked` | The existing free-call booking route, kept as the "talk to us first" option. |
| `/privacy`, `/terms` | Updated for opt-in consent, payments, scope guarantee and refunds. Have a lawyer review. |

Old addresses (`/offer`, `/services`, `/learn`, `/thank-you`, `/payment`)
redirect to the right new page.

## The free guide

`public/the-business-growth-blueprint.pdf` is a real 24-page guide: six
chapters, a 12-point scorecard, a worksheet and a one-page summary. It is
built from `scripts/blueprint/pages.mjs` (content) and `guide.css` (layout):

```bash
node scripts/build-blueprint.mjs
```

That also writes the page images in `public/blueprint/` used on the opt-in
page, so the previews are always the actual pages. Edit the content, re-run,
commit both.

## The offer

Packages, the bundle and the exit offer live in the database and are edited
in the dashboard. Prices are whole numbers in the smallest unit (kobo).

- **Bundle maths is never typed in.** The combined value is the sum of the
  included packages' current prices; the saving is that minus the bundle
  price. Computed in the database (`_bundle_json`) and shown everywhere from
  that one source: sales page, popup, checkout, order, emails, dashboard.
- **No fake discounts.** A bundle that isn't cheaper than its parts can't be
  saved, and if a later package price change makes it so, the bundle is
  hidden and can't be bought until fixed (the dashboard says why).
- **Packages are always buyable on their own.** The bundle never hides them.
- No countdown timers, no invented scarcity, no "unlimited" anything. Every
  package lists its scope and what isn't included.

## The exit-intent offer

`components/funnel/ExitIntent.tsx`. Mounted on the sales page only.

- Waits for **both** a minimum time on page and a minimum scroll depth
  (dashboard settings, default 20 s and 25 %).
- Desktop: pointer leaving through the top edge. Phones: the back button
  (one history step is added, so the first back shows the offer and the
  second leaves) and/or a fast flick back to the top from deep in the page.
- Never twice per visit; hidden for N days after a dismissal; never to
  someone who has bought on that device; never over another dialog or while
  typing; never in checkout.
- Always closable: ×, the "no thanks" line, Escape, tapping outside. Focus is
  trapped while open and returned afterwards.
- Shown, accepted and dismissed are recorded. Purchases are attributed from
  the order (`offer_source = exit_popup`), never from the browser.
- Dashboard → Exit-intent offer → "Preview the popup" opens it immediately
  without recording anything.

## Payments

`app/api/checkout`, `lib/server/paystack.ts`, `lib/server/orders.ts`,
`app/api/paystack/webhook`.

1. The browser sends the package and the buyer's details, never a price.
2. `funnel_create_order` works out the amount in the database and returns a
   private order token and a reference.
3. The server initialises the transaction with the secret key and sends the
   buyer to Paystack's page.
4. The buyer returns to `/order/[token]`; the server calls Paystack's verify
   endpoint. The signed webhook does the same thing independently.
5. `svc_mark_order_paid` (service key only) checks amount and currency, marks
   the order paid, converts the lead, stops the sales emails. Safe to call
   twice. The receipt goes out exactly once.

Underpayment, declined cards, abandoned checkouts and forged return links
are all handled and tested.

## Email

`lib/email/templates.ts` (the words), `lib/email/render.ts` (HTML + plain
text from the same blocks), `lib/server/sequence.ts` (sending).

| # | Email | When |
|---|---|---|
| 1 | Your Business Growth Blueprint is here | Immediately on opt-in |
| 2 | The customers you paid for and never got | +1 day |
| 3 | Why "more marketing" keeps producing the same result | +2 days |
| 4 | The five steps we run for every client | +2 days |
| 5 | Three ways to work with us (and one way to get all three) | +1 day, live prices |
| 6 | "Is this right for my business?" — straight answers | +2 days |
| 7 | Where would you start? | +2 days |

Plus the order receipt, and notices to the business for each order and brief.

- Sent only to subscribers who are still subscribed. Consent wording and time
  are stored with each subscriber.
- Every sequence email carries a one-click unsubscribe link and the
  `List-Unsubscribe` headers mail apps use.
- Buyers are taken off the sequence when their payment is confirmed.
- A daily Vercel Cron job (`vercel.json` → `/api/cron/emails`, protected by
  `CRON_SECRET`) sends whatever is due. Each step is claimed before sending,
  so overlapping runs can't double-send; a failed send is retried later and
  logged.

## The dashboard — `/admin`

Overview, Funnel analytics, Leads (filter, export CSV), Orders (onboarding
tracking, re-check with Paystack), Consultations, Packages, Growth Suite
bundle, Exit-intent offer, Emails (preview, test send, log), Website content,
Settings (which integrations are connected).

**Only real data.** Every figure is counted from page views, funnel events,
subscribers and orders. A number whose source isn't collecting yet shows "—"
with the reason.

## Security

- Every table has row level security on with no policies; everything goes
  through database functions. `admin_*` check the caller is an admin;
  `svc_*` can only be called with the service-role key, which lives in the
  server environment; public functions do only what an anonymous visitor may.
- Admin sessions are httpOnly cookies scoped to `/admin`, guarded by
  `middleware.ts` and re-checked in the database on every page and action.
- Orders and subscriptions are reached only by random private tokens.
- Form endpoints refuse cross-site posts; the opt-in has a honeypot and a
  rate brake; the lead export neutralises spreadsheet formulas.

## Design

White first, near-black for type and emphasis panels, soft grey sections,
electric green for the one action on screen.

| Token | Hex | Use |
|---|---|---|
| `paper` | #FFFFFF | The page |
| `mist` | #F5F6F4 | Alternate sections, quiet panels |
| `ink` | #0A0C0A | Type, dark panels, footer |
| `green` | #00C551 | Primary buttons and marks, always with black text |
| `greenDeep` | #007A35 | Green text on white (AA contrast) |

Type: **Bricolage Grotesque** condensed and uppercase for the poster
headlines, **Instrument Serif** italic for the one phrase each headline
turns on, **Instrument Sans** for reading, **IBM Plex Mono** for labels and
every price, so figures line up like a ledger. Corners are tight (4–10 px).
All self-hosted through `next/font`.

Motion is CSS where it can be, Framer Motion for scroll reveals. The sales
page's hero line draws itself through the three surfaces it connects; struck
prices are crossed out as they scroll into view. `prefers-reduced-motion`
removes movement everywhere.

The SYNERGOX logo (`public/logo.png`, `app/icon.png`) is used exactly as
supplied.

## Structure

```
app/(site)/            page.tsx (opt-in) · growth-system · checkout/[slug] · order/[token]
                       unsubscribe · apply · booked · privacy · terms
app/api/               optin · checkout · paystack/webhook · cron/emails · blueprint · unsubscribe
app/admin/(dash)/      overview · analytics · leads · orders · consultations · packages
                       bundle · exit-offer · emails · content · settings
components/funnel/     opt-in form, guide mockup, packages, bundle, exit offer, checkout, order
components/admin/      dashboard shell, charts, forms, offer editors
lib/funnel/            offer data, browser helpers, project brief, server actions
lib/email/             templates and renderer
lib/server/            env, Paystack, orders, email sending, sequence (server only)
scripts/               build-blueprint.mjs + the guide's content
supabase/migrations/   0002 (dashboard) · 0003 (sales funnel)
```

## Analytics

The dashboard needs nothing external. If Google Tag Manager or GA4 is added
later, `lib/analytics.ts` already pushes `lead_email_submitted`,
`package_selected`, `bundle_selected`, `exit_offer_shown/accepted/dismissed`,
`begin_checkout`, `purchase_completed` (only after server verification) and
`onboarding_submitted`.
