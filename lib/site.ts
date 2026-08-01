export const BOOKING_URL = "https://calendly.com/adekunleprecious051/30min";
export const EMAIL = "hello@synergox.co";

/**
 * Lead capture endpoint. Swap for your Formspree / Getform / Basin URL.
 * The opt-in and all forms POST here as JSON.
 */
export const FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_ID";

/**
 * Where the free book lives. Sits in /public, so this path just works.
 * If you host it elsewhere (S3, Drive, email attachment only), point here.
 */
export const PLAYBOOK_URL = "/growth-playbook.pdf";
export const PLAYBOOK_TITLE = "The Compounding Business";

/**
 * The paid step visitors are redirected to after opting in.
 * PASTE YOUR REAL CHECKOUT LINK HERE — Paystack, Flutterwave, Stripe, etc.
 * Until you do, it falls back to /apply so no one hits a dead end.
 */
export const PAYMENT_URL = "/payment";

/** Seconds to show the success screen before redirecting to PAYMENT_URL. */
export const REDIRECT_DELAY = 3;
