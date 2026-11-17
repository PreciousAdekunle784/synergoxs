"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CONSENT_TEXT, SALES_PAGE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { attribution, contact, flags, sessionId } from "@/lib/funnel/client";
import { ArrowTile, Lock } from "../Icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The Blueprint request: first name and email, nothing else.
 *
 * On submit the server validates, saves the lead with where it came from,
 * records consent for the emails named below the button, sends the guide,
 * and this form then moves the visitor on to the sales page.
 */
export default function OptInForm({
  cta,
  id,
  size = "lg",
}: {
  cta: string;
  /** makes field ids unique when the form appears twice on a page */
  id: string;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot: hidden from people
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ field?: "name" | "email"; message: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName === "") {
      setError({ field: "name", message: "Add your first name so we know who to send it to." });
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError({ field: "email", message: "That email doesn't look right. Check it and try again." });
      return;
    }

    setBusy(true);
    setError(null);
    track("lead_email_submitted", { form: id });
    const { utm, referrer } = attribution();

    try {
      const res = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, company, session: sessionId(), referrer, utm }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        field?: "name" | "email";
        redirect?: string;
        emailed?: boolean;
      } | null;

      if (!res.ok || !data?.ok) {
        setBusy(false);
        setError({
          field: data?.field,
          message: data?.error ?? "Something went wrong on our side. Please try again in a moment.",
        });
        return;
      }

      contact.save(cleanName, cleanEmail);
      flags.markOptedIn();
      flags.welcome.set();
      track("lead_blueprint_sent", { emailed: data.emailed === true });
      router.push(data.redirect ?? `${SALES_PAGE}?welcome=1`);
    } catch {
      setBusy(false);
      setError({ message: "We couldn't reach the server. Check your connection and try again." });
    }
  }

  const errId = `${id}-error`;

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="field-label">
            First name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            aria-invalid={error?.field === "name" || undefined}
            aria-describedby={error?.field === "name" ? errId : undefined}
            placeholder="Ada"
            className="field"
            maxLength={120}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="field-label">
            Email address
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            aria-invalid={error?.field === "email" || undefined}
            aria-describedby={error?.field === "email" ? errId : undefined}
            placeholder="you@company.com"
            className="field"
            maxLength={320}
          />
        </div>
      </div>

      {/* Not for people: off-screen, unlabelled for assistive tech, skipped by Tab. */}
      <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" name="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      {error && (
        <p id={errId} role="alert" className="mt-3 text-[0.9rem] font-medium text-[#B42318]">
          {error.message}
        </p>
      )}

      <button type="submit" disabled={busy} className={`btn-primary mt-4 w-full justify-between ${size === "lg" ? "btn-lg" : ""}`}>
        <span className="text-left">{busy ? "Sending your Blueprint…" : cta}</span>
        <ArrowTile />
      </button>

      <p className="mt-3.5 flex items-start gap-2 text-[0.8rem] leading-relaxed text-mute">
        <Lock className="mt-[3px]" />
        <span>
          {CONSENT_TEXT}{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy policy
          </Link>
          .
        </span>
      </p>
    </form>
  );
}
