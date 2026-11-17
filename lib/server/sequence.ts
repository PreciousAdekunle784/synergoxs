import "server-only";
import { SITE_URL } from "@/lib/site";
import { getContent } from "@/lib/content/get";
import { getFunnel } from "@/lib/funnel/get";
import { SEQUENCE, sequenceByStep, type EmailContext } from "@/lib/email/templates";
import { isConfigured } from "./env";
import { svc } from "./db";
import { sendEmail } from "./email";

export type Subscriber = {
  id: string;
  token: string;
  email: string;
  first_name: string | null;
  status?: "subscribed" | "unsubscribed";
  sequence_step: number;
};

export const unsubscribeUrl = (token: string, siteUrl = SITE_URL) => `${siteUrl}/unsubscribe?t=${token}`;
export const downloadUrl = (token: string, siteUrl = SITE_URL) => `${siteUrl}/api/blueprint?t=${token}`;

export async function emailContext(s: Pick<Subscriber, "token" | "first_name">, siteUrl = SITE_URL): Promise<EmailContext> {
  const [content, funnel] = await Promise.all([getContent(), getFunnel()]);
  return {
    firstName: (s.first_name ?? "").trim(),
    siteUrl,
    downloadUrl: downloadUrl(s.token, siteUrl),
    unsubscribeUrl: unsubscribeUrl(s.token, siteUrl),
    contactEmail: content.contact.email,
    location: content.contact.location,
    funnel,
  };
}

/** When the email after `step` should go out, or null after the last one. */
function nextAt(step: number): string | null {
  const next = sequenceByStep(step + 1);
  if (!next) return null;
  return new Date(Date.now() + next.delayDays * 86_400_000).toISOString();
}

/**
 * Sends one step of the sequence to one subscriber.
 *
 * The step is claimed in the database first (so two overlapping runs can't
 * both send it) and handed back if the send fails, to be retried later.
 */
export async function sendStep(s: Subscriber, step: number, siteUrl = SITE_URL) {
  const tpl = sequenceByStep(step);
  if (!tpl) return { sent: false as const, reason: "no such step" };
  if (!isConfigured.database() || !isConfigured.email()) return { sent: false as const, reason: "not configured" };

  const claim = await svc<boolean>("svc_claim_sequence", { p_id: s.id, p_step: step, p_next_at: nextAt(step) });
  if (claim.error) return { sent: false as const, reason: claim.error.message };
  if (!claim.data) return { sent: false as const, reason: "already sent, or unsubscribed" };

  const ctx = await emailContext(s, siteUrl);
  const result = await sendEmail({
    to: s.email,
    email: tpl.build(ctx),
    key: tpl.key,
    subscriberId: s.id,
    unsubscribeUrl: ctx.unsubscribeUrl,
  });
  if (!result.ok) {
    await svc("svc_release_sequence", { p_id: s.id, p_step: step });
    return { sent: false as const, reason: result.error };
  }
  return { sent: true as const };
}

/**
 * Called right after an opt-in. Sends email 1 at once; if this person already
 * has it and asked again, sends the Blueprint again (at most every ten minutes).
 * Returns whether an email actually left.
 */
export async function deliverBlueprint(email: string, siteUrl = SITE_URL): Promise<boolean> {
  if (!isConfigured.database() || !isConfigured.email()) return false;
  const { data: s } = await svc<Subscriber | null>("svc_subscriber", { p_email: email });
  if (!s || s.status !== "subscribed") return false;

  if (s.sequence_step === 0) return (await sendStep(s, 1, siteUrl)).sent;

  const again = await svc<boolean>("svc_claim_redelivery", { p_id: s.id });
  if (!again.data) return true; // sent moments ago; the copy in their inbox is still good
  const ctx = await emailContext(s, siteUrl);
  const result = await sendEmail({
    to: s.email,
    email: SEQUENCE[0].build(ctx),
    key: "blueprint_redelivery",
    subscriberId: s.id,
    unsubscribeUrl: ctx.unsubscribeUrl,
  });
  return result.ok;
}

/** The scheduled run: everyone whose next email is due. */
export async function runDueSequence(limit = 60) {
  const summary = { due: 0, sent: 0, failed: 0, skipped: 0, errors: [] as string[] };
  if (!isConfigured.database() || !isConfigured.email()) {
    summary.errors.push("Email sending is not configured (SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY are both needed).");
    return summary;
  }
  const { data, error } = await svc<Subscriber[]>("svc_due_sequence", { p_limit: limit });
  if (error || !data) {
    summary.errors.push(error?.message ?? "Could not read due emails");
    return summary;
  }
  summary.due = data.length;
  for (const s of data) {
    const r = await sendStep(s, s.sequence_step + 1);
    if (r.sent) summary.sent++;
    else if (r.reason === "already sent, or unsubscribed") summary.skipped++;
    else {
      summary.failed++;
      if (summary.errors.length < 5) summary.errors.push(r.reason);
    }
  }
  return summary;
}
