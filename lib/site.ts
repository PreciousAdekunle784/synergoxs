export const BOOKING_URL = "https://calendly.com/adekunleprecious051/30min";
export const EMAIL = "hello@synergox.co";

/** The free book. Lives in /public, so this path just works. */
export const PLAYBOOK_URL = "/growth-playbook.pdf";
export const PLAYBOOK_TITLE = "The Compounding Business";

/**
 * ── Supabase ────────────────────────────────────────────────────────────
 * Every form (opt-in, checklist, apply) calls a Supabase Edge Function that
 * (1) saves the lead to your `leads` table and (2) emails the book via Resend.
 * Only the PUBLIC url + anon key live here — both are browser-safe. Your Resend
 * key, Paystack secret, and service-role key stay as Supabase SECRETS, never in
 * this repo.
 *
 * You can hardcode the two public values here (simplest — no redeploy gotcha),
 * or set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel and
 * REDEPLOY after (NEXT_PUBLIC_* vars are baked in at build time).
 *
 * ►►► PASTE YOUR PROJECT URL + ANON KEY BETWEEN THE QUOTES BELOW. ◄◄◄
 * Both are in Supabase → Project Settings → API.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://kugpqkmvcwagjjyfifbm.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z3Bxa212Y3dhZ2pqeWZpZmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1Nzk4NzQsImV4cCI6MjEwMTE1NTg3NH0.DN7Ll4b4_vGSXu8IWlNxkwer-UkrUVhxiDqIB75Y8BI";

/** Edge Functions. These resolve automatically from SUPABASE_URL. */
export const SUBSCRIBE_FN = `${SUPABASE_URL}/functions/v1/subscribe`;
export const VERIFY_FN = `${SUPABASE_URL}/functions/v1/verify-payment`;

/** True only once real Supabase values are in place (not the placeholders). */
export const SUPABASE_IS_SET =
  !!SUPABASE_URL &&
  !SUPABASE_URL.startsWith("PASTE_") &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.startsWith("PASTE_");

/**
 * ── Paystack ────────────────────────────────────────────────────────────
 * Only your PUBLIC key belongs here. A Paystack public key (pk_live_… / pk_test_…)
 * is MEANT to be visible in the browser — there is no security risk in putting it
 * straight in this file, and doing so avoids the #1 gotcha: NEXT_PUBLIC_* env vars
 * are baked in at BUILD time, so setting one in Vercel without a fresh deploy
 * leaves it empty and the checkout won't open.
 *
 * ►►► PASTE YOUR LIVE PUBLIC KEY BETWEEN THE QUOTES BELOW. ◄◄◄
 * (It starts with pk_live_ — NOT the secret sk_live_ key.)
 */
export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ??
  "pk_test_ddc4b999eeb75c075045a6c1d6c9809e2d5210cf";

/** Price of the paid offer, in the smallest currency unit (kobo for NGN). */
export const OFFER_AMOUNT_KOBO = Number(
  process.env.NEXT_PUBLIC_OFFER_AMOUNT_KOBO ?? "19999900" // ₦199,999
);
export const OFFER_CURRENCY = process.env.NEXT_PUBLIC_OFFER_CURRENCY ?? "NGN";
export const OFFER_LABEL =
  process.env.NEXT_PUBLIC_OFFER_LABEL ?? "Growth System Build";

/**
 * The conversion-focused payment page the success screen redirects to. The
 * Paystack checkout button lives on that page (see app/offer/page.tsx).
 */
export const PAYMENT_PAGE = "/offer";

/** Seconds on the success screen before auto-redirecting to the payment page. */
export const REDIRECT_DELAY = 3;
