import "server-only";
import { env, isConfigured } from "./env";
import { svc } from "./db";
import type { RenderedEmail } from "@/lib/email/render";

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; error: string; notConfigured?: boolean };

/**
 * Sends one email through Resend and records the outcome in email_log.
 * If Resend isn't configured this says so — it never pretends to have sent.
 */
export async function sendEmail(input: {
  to: string;
  email: RenderedEmail;
  key: string;
  subscriberId?: string | null;
  /** adds the one-click unsubscribe headers mail clients look for */
  unsubscribeUrl?: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!isConfigured.email()) {
    return { ok: false, error: "RESEND_API_KEY is not set on the server.", notConfigured: true };
  }
  const headers: Record<string, string> = {};
  if (input.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${input.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  let result: SendResult;
  try {
    const res = await fetch(`${env.resendBase}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.emailFrom,
        to: [input.to],
        subject: input.email.subject,
        html: input.email.html,
        text: input.email.text,
        reply_to: input.replyTo || env.emailReplyTo || undefined,
        headers: Object.keys(headers).length ? headers : undefined,
      }),
      cache: "no-store",
    });
    const body = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    result =
      res.ok && body?.id
        ? { ok: true, id: body.id }
        : { ok: false, error: body?.message ?? `Resend answered ${res.status}` };
  } catch (e) {
    result = { ok: false, error: e instanceof Error ? e.message : "Could not reach Resend" };
  }
  await svc("svc_log_email", {
    p_email: input.to,
    p_key: input.key,
    p_status: result.ok ? "sent" : "failed",
    p_provider_id: result.ok ? result.id : null,
    p_error: result.ok ? null : result.error,
    p_subscriber: input.subscriberId ?? null,
  });
  return result;
}
