export const BOOKING_URL = "https://calendly.com/adekunleprecious051/30min";
export const EMAIL = "hello@synergox.co";

/** The free book. Lives in /public, so this path just works. */
export const PLAYBOOK_URL = "/growth-playbook.pdf";
export const PLAYBOOK_TITLE = "The Compounding Business";

/**
 * ── Supabase ────────────────────────────────────────────────────────────
 * The opt-in calls a Supabase Edge Function that (1) saves the email to your
 * `leads` table and (2) emails the book via Resend. Only the PUBLIC anon key
 * and project URL live here — they're safe in the browser. Your Resend key and
 * service-role key stay as secrets inside Supabase, never in this repo.
 *
 * Set these in .env.local (see .env.example):
 *   NEXT_PUBLIC_SUPABASE_URL       https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  eyJhbGci...  (the anon/public key)
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** The Edge Function that saves the lead and sends the book. */
export const SUBSCRIBE_FN = `${SUPABASE_URL}/functions/v1/subscribe`;

/**
 * ── Paystack ────────────────────────────────────────────────────────────
 * After the book is sent, the success screen offers the paid next step via
 * Paystack's inline popup. Only your PUBLIC key belongs here (pk_live_… or
 * pk_test_…). The secret key stays in Supabase for payment verification.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY  pk_live_xxxx
 */
export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

/** Price of the paid offer, in the smallest currency unit (kobo for NGN). */
export const OFFER_AMOUNT_KOBO = Number(
  process.env.NEXT_PUBLIC_OFFER_AMOUNT_KOBO ?? "5000000" // ₦50,000 default — change this
);
export const OFFER_CURRENCY = process.env.NEXT_PUBLIC_OFFER_CURRENCY ?? "NGN";
export const OFFER_LABEL =
  process.env.NEXT_PUBLIC_OFFER_LABEL ?? "Growth System Build — Deposit";

/**
 * Fallback if Paystack isn't configured yet: where the success screen sends
 * people instead of opening the popup. Keeps the flow alive during setup.
 */
export const PAYMENT_FALLBACK_URL = "/apply";

/** Seconds on the success screen before the payment step is offered. */
export const REDIRECT_DELAY = 3;
