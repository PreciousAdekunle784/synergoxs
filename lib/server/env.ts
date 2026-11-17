import "server-only";

/**
 * Server-side secrets and settings. None of these are ever sent to the
 * browser: no NEXT_PUBLIC_ prefix, and this module refuses to be imported
 * from client code.
 *
 * Set them in Vercel → Project → Settings → Environment Variables.
 */
const clean = (v: string | undefined) => (v ?? "").trim();

export const env = {
  /** Supabase → Project Settings → API → service_role key. Lets the server mark orders paid and run the email sequence. */
  get serviceKey() {
    return clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  },
  /** Paystack → Settings → API Keys & Webhooks → Secret key (sk_live_… or sk_test_…). */
  get paystackSecret() {
    return clean(process.env.PAYSTACK_SECRET_KEY);
  },
  get paystackBase() {
    return clean(process.env.PAYSTACK_API_BASE) || "https://api.paystack.co";
  },
  /** Resend → API Keys. */
  get resendKey() {
    return clean(process.env.RESEND_API_KEY);
  },
  get resendBase() {
    return clean(process.env.RESEND_API_BASE) || "https://api.resend.com";
  },
  /** Must be an address on a domain verified in Resend. */
  get emailFrom() {
    return clean(process.env.EMAIL_FROM) || "SYNERGOX <hello@synergox.co>";
  },
  get emailReplyTo() {
    return clean(process.env.EMAIL_REPLY_TO);
  },
  /** Where "new order" and "brief received" notices go. Defaults to the contact email. */
  get notifyEmail() {
    return clean(process.env.ORDER_NOTIFY_EMAIL);
  },
  /** Protects the scheduled email run. Vercel Cron sends it automatically once set. */
  get cronSecret() {
    return clean(process.env.CRON_SECRET);
  },
};

export const isConfigured = {
  database: () => env.serviceKey !== "",
  payments: () => env.paystackSecret !== "",
  email: () => env.resendKey !== "",
  cron: () => env.cronSecret !== "",
};

/** For the dashboard's settings page: what is switched on. Never the values. */
export function integrationStatus() {
  return {
    serviceKey: isConfigured.database(),
    paystack: isConfigured.payments(),
    paystackMode: env.paystackSecret.startsWith("sk_live_")
      ? ("live" as const)
      : env.paystackSecret.startsWith("sk_test_")
        ? ("test" as const)
        : null,
    resend: isConfigured.email(),
    emailFrom: env.emailFrom,
    cron: isConfigured.cron(),
  };
}
