"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BOOKED_PAGE,
  CALL_MINUTES,
  SUBSCRIBE_FN,
  SUPABASE_ANON_KEY,
  SUPABASE_IS_SET,
  SUPABASE_URL,
} from "@/lib/site";
import type { Testimonial } from "@/lib/content/defaults";
import { useContact } from "./ContactProvider";
import { track } from "@/lib/analytics";
import { Arrow, Check, Tick } from "./Icons";
import Eyebrow from "./Eyebrow";

/* ------------------------------------------------------------------ *
 * CURRENCIES — EDIT ME OCCASIONALLY
 *
 * `rate` is units per 1 USD, used ONLY to generate readable answer bands.
 * Nothing here touches billing, and nothing is shown to the visitor as an
 * exchange rate. Bands are rounded to clean numbers, so a stale rate makes
 * a band slightly wide — it never makes the form wrong.
 *
 * Worth refreshing once or twice a year. NGN especially.
 * ------------------------------------------------------------------ */
const CURRENCIES = {
  NGN: { symbol: "₦", label: "Nigerian Naira", rate: 1550 },
  USD: { symbol: "$", label: "US Dollar", rate: 1 },
  GBP: { symbol: "£", label: "Pound Sterling", rate: 0.79 },
  EUR: { symbol: "€", label: "Euro", rate: 0.92 },
  GHS: { symbol: "₵", label: "Ghanaian Cedi", rate: 15 },
  KES: { symbol: "KSh", label: "Kenyan Shilling", rate: 129 },
  ZAR: { symbol: "R", label: "South African Rand", rate: 18 },
  CAD: { symbol: "C$", label: "Canadian Dollar", rate: 1.37 },
  AUD: { symbol: "A$", label: "Australian Dollar", rate: 1.52 },
  AED: { symbol: "AED", label: "UAE Dirham", rate: 3.67 },
} as const;

type CurKey = keyof typeof CURRENCIES;

/** Best guess at the visitor's currency from their browser region. They can change it. */
const REGION_CURRENCY: Record<string, CurKey> = {
  NG: "NGN", US: "USD", GB: "GBP", GH: "GHS", KE: "KES", ZA: "ZAR",
  CA: "CAD", AU: "AUD", AE: "AED", IE: "EUR", DE: "EUR", FR: "EUR",
  ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR", PT: "EUR", AT: "EUR", FI: "EUR",
};

function guessCurrency(): CurKey {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region ?? "";
    return REGION_CURRENCY[region] ?? "NGN";
  } catch {
    return "NGN";
  }
}

/**
 * Round to two significant figures, so consecutive bands always line up
 * (7.8m, 31m, 230m) instead of drifting the way 1/2/5 rounding does.
 */
function niceRound(n: number) {
  if (n <= 0) return 0;
  const mag = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.round(n / mag) * mag;
}

function compact(v: number) {
  if (v >= 1_000_000) return `${+(v / 1_000_000).toFixed(1)}m`.replace(".0m", "m");
  if (v >= 1_000) return `${+(v / 1_000).toFixed(1)}k`.replace(".0k", "k");
  return `${Math.round(v)}`;
}

function bandLabel(cur: CurKey, lowUsd: number | null, highUsd: number | null) {
  const c = CURRENCIES[cur];
  const fmt = (usd: number) => `${c.symbol}${compact(niceRound(usd * c.rate))}`;
  if (lowUsd === null && highUsd !== null) return `Under ${fmt(highUsd)}`;
  if (lowUsd !== null && highUsd === null) return `${fmt(lowUsd)}+`;
  return `${fmt(lowUsd!)} – ${fmt(highUsd!)}`;
}

/* Bands are expressed in USD and converted per currency: one list to maintain. */
const REVENUE_BANDS: [number | null, number | null][] = [
  [null, 5000],
  [5000, 20000],
  [20000, 50000],
  [50000, 150000],
  [150000, null],
];

const SPEND_BANDS: [number | null, number | null][] = [
  [null, 1000],
  [1000, 5000],
  [5000, 20000],
  [20000, null],
];

const MODELS: [string, string][] = [
  ["Services sold on a call", "Consulting, agency, professional services, B2B"],
  ["Products sold online", "E-commerce, D2C, retail with a storefront"],
  ["Software or subscription", "SaaS, memberships, recurring plans"],
  ["Local or appointment-based", "Clinics, trades, salons, restaurants, fitness"],
  ["Something else", "Tell us on the call"],
];

const BOTTLENECKS: [string, string][] = [
  ["Not enough people find us", "Traffic is the constraint"],
  ["Traffic arrives but doesn't convert", "The page or the offer"],
  ["Leads come in but never book", "The follow-up gap"],
  ["Calls happen but don't close", "The sales conversation"],
  ["Customers buy once and vanish", "Retention and repeat purchase"],
  ["Honestly, I don't know", "That's what the teardown is for"],
];

type Answers = {
  currency: CurKey;
  model: string;
  revenue: string;
  revenueIndex: number;
  spend: string;
  spendIndex: number;
  bottleneck: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
};

const EMPTY: Answers = {
  currency: "NGN",
  model: "",
  revenue: "",
  revenueIndex: -1,
  spend: "",
  spendIndex: -1,
  bottleneck: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL = 5;

function Choice({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex min-h-[60px] w-full items-center gap-3.5 rounded-2xl border px-5 py-3.5 text-left transition-all duration-200 ${
        selected
          ? "border-ink bg-ink text-white"
          : "border-line bg-paper text-ink hover:border-ink"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-green bg-green text-ink" : "border-mute/50 group-hover:border-ink"
        }`}
      >
        {selected && <Check size={11} />}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.98rem] font-medium leading-snug">{label}</span>
        {hint && (
          <span className={`mt-0.5 block text-[0.83rem] leading-snug ${selected ? "text-ash" : "text-mute"}`}>
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}

const leaveWith = [
  "Your funnel modelled stage by stage, on your own numbers",
  "The one stage losing you the most customers, and what it's worth to fix",
  "A fix-first plan you can run with or without us",
];

const reassure = [
  {
    q: "Is this a sales pitch?",
    a: "No. If the numbers say we'd be the wrong spend for you right now, we'll tell you on the call instead of quoting.",
  },
  {
    q: "What do I need to prepare?",
    a: "Rough monthly figures for ad spend, leads and sales. If some of that doesn't exist yet, that's a finding, not a blocker.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. The teardown is free, and the findings are yours whether or not we ever work together.",
  },
];

export default function Apply({ testimonial }: { testimonial?: Testimonial }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const { email: EMAIL, bookingUrl: BOOKING_URL } = useContact();
  /** Private handle for this visitor's consultation record (see the migration). */
  const consultToken = useRef<string | null>(null);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const advance = useRef<ReturnType<typeof setTimeout>>();
  const firstRender = useRef(true);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    track("booking_page_viewed", { page: "apply" });
    // Sensible currency default, and prefill anyone who already asked for the playbook.
    let name = "";
    let email = "";
    try {
      name = sessionStorage.getItem("syx_name") ?? "";
      email = sessionStorage.getItem("syx_email") ?? "";
    } catch {
      /* ignore */
    }
    setA((prev) => ({ ...prev, currency: guessCurrency(), name, email }));
    return () => clearTimeout(advance.current);
  }, []);

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
  }, [step, sent]);

  // Calendly tells the parent page when a booking is confirmed.
  useEffect(() => {
    if (!sent) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if (e.data?.event === "calendly.event_scheduled") {
        track("call_booked", { source: "apply" });
        // Tell the dashboard this request is now a booked call. Never blocks
        // the visitor: if it fails they still reach the confirmation page.
        if (consultToken.current) {
          fetch("/api/booking/confirm", {
            method: "POST",
            keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: consultToken.current,
              eventUri: e.data?.payload?.event?.uri ?? null,
              inviteeUri: e.data?.payload?.invitee?.uri ?? null,
            }),
          }).catch(() => {});
        }
        router.push(BOOKED_PAGE);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [sent, router]);

  const cur = a.currency;

  /** Below this, an agency fee can't pay for itself. Send them to the learn track. */
  const underServed = a.revenueIndex === 0 && a.spendIndex === 0;

  /** Single-tap questions move on by themselves — no "Continue" to hunt for. */
  const pick = (apply: () => void) => {
    apply();
    clearTimeout(advance.current);
    advance.current = setTimeout(
      () => setStep((s) => Math.min(TOTAL - 1, s + 1)),
      reduce ? 0 : 260
    );
  };

  const steps = useMemo(
    () => [
      {
        id: "model",
        q: "First: what do you sell?",
        sub: "The funnel looks completely different between these. There's no wrong answer.",
        body: (
          <div className="grid gap-2.5">
            {MODELS.map(([m, hint]) => (
              <Choice
                key={m}
                label={m}
                hint={hint}
                selected={a.model === m}
                onClick={() => pick(() => set("model", m))}
              />
            ))}
          </div>
        ),
      },
      {
        id: "revenue",
        q: "Roughly what does the business turn over each month?",
        sub: "A range is fine. Nobody is holding you to it, and it never leaves us.",
        body: (
          <div>
            <label htmlFor="f-currency" className="field-label">
              Currency
            </label>
            <select
              id="f-currency"
              value={cur}
              onChange={(e) =>
                setA((prev) => ({
                  ...prev,
                  currency: e.target.value as CurKey,
                  revenue: "",
                  revenueIndex: -1,
                  spend: "",
                  spendIndex: -1,
                }))
              }
              className="field mb-4 appearance-none bg-[length:12px] bg-[right_1.25rem_center] bg-no-repeat pr-11"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%230A0C0A' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
              }}
            >
              {(Object.keys(CURRENCIES) as CurKey[]).map((k) => (
                <option key={k} value={k}>
                  {k} · {CURRENCIES[k].label}
                </option>
              ))}
            </select>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {REVENUE_BANDS.map(([lo, hi], i) => {
                const label = bandLabel(cur, lo, hi);
                return (
                  <Choice
                    key={i}
                    label={label}
                    selected={a.revenueIndex === i}
                    onClick={() =>
                      pick(() =>
                        setA((prev) => ({
                          ...prev,
                          revenueIndex: i,
                          revenue: `${label} ${cur}/mo`,
                        }))
                      )
                    }
                  />
                );
              })}
            </div>
          </div>
        ),
      },
      {
        id: "spend",
        q: "What goes into paid ads each month?",
        sub: `In ${cur}. If the answer is nothing yet, say so. It's a common starting point.`,
        body: (
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Choice
              label="Nothing yet"
              hint="Organic, referral or word of mouth"
              selected={a.spendIndex === 0}
              onClick={() =>
                pick(() =>
                  setA((prev) => ({ ...prev, spendIndex: 0, spend: "Nothing yet" }))
                )
              }
            />
            {SPEND_BANDS.map(([lo, hi], i) => {
              const label = bandLabel(cur, lo, hi);
              return (
                <Choice
                  key={i}
                  label={label}
                  selected={a.spendIndex === i + 1}
                  onClick={() =>
                    pick(() =>
                      setA((prev) => ({
                        ...prev,
                        spendIndex: i + 1,
                        spend: `${label} ${cur}/mo`,
                      }))
                    )
                  }
                />
              );
            })}
          </div>
        ),
      },
      {
        id: "bottleneck",
        q: "Where do you think you're losing the most?",
        sub: "Your instinct is usually close. The teardown will tell us whether it's right.",
        body: (
          <div className="grid gap-2.5">
            {BOTTLENECKS.map(([b, hint]) => (
              <Choice
                key={b}
                label={b}
                hint={hint}
                selected={a.bottleneck === b}
                onClick={() => pick(() => set("bottleneck", b))}
              />
            ))}
          </div>
        ),
      },
      {
        id: "contact",
        q: "Last one. Who should we send the invite to?",
        sub: "We review your answers before the call, so it opens with what we found.",
        body: (
          <div className="grid gap-4">
            <div>
              <label htmlFor="f-name" className="field-label">
                Your name
              </label>
              <input
                id="f-name"
                type="text"
                autoComplete="name"
                value={a.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  setErrors((er) => ({ ...er, name: undefined }));
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "f-name-err" : undefined}
                className="field"
              />
              {errors.name && (
                <p id="f-name-err" role="alert" className="mt-2 text-[0.86rem] font-medium text-[#B42318]">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="f-email" className="field-label">
                Work email
              </label>
              <input
                id="f-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={a.email}
                onChange={(e) => {
                  set("email", e.target.value);
                  setErrors((er) => ({ ...er, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "f-email-err" : undefined}
                placeholder="you@company.com"
                className="field"
              />
              {errors.email && (
                <p id="f-email-err" role="alert" className="mt-2 text-[0.86rem] font-medium text-[#B42318]">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="f-company" className="field-label">
                  Business name
                </label>
                <input
                  id="f-company"
                  type="text"
                  autoComplete="organization"
                  value={a.company}
                  onChange={(e) => set("company", e.target.value)}
                  maxLength={200}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="f-phone" className="field-label">
                  Phone or WhatsApp <span className="font-normal text-mute">(optional)</span>
                </label>
                <input
                  id="f-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={a.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  maxLength={40}
                  placeholder="+234…"
                  className="field"
                />
              </div>
            </div>
            <div>
              <label htmlFor="f-website" className="field-label">
                Website <span className="font-normal text-mute">(optional)</span>
              </label>
              <input
                id="f-website"
                type="text"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                value={a.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="yourbusiness.com"
                className="field"
              />
            </div>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a, cur, errors]
  );

  const current = steps[step];
  const isLast = step === TOTAL - 1;

  async function finish(e: React.FormEvent) {
    e.preventDefault();
    if (!isLast) return;

    const name = a.name.trim();
    const email = a.email.trim();
    const next: typeof errors = {};
    if (name === "") next.name = "Add your name so we know who we're speaking to.";
    if (!EMAIL_RE.test(email)) next.email = "That email doesn't look right. Check it and try again.";
    if (next.name || next.email) {
      setErrors(next);
      document.getElementById(next.name ? "f-name" : "f-email")?.focus();
      return;
    }

    setSending(true);
    setFailed(false);
    track("application_submitted", {
      recommendation: underServed ? "Learn track" : "Done for you",
    });
    try {
      sessionStorage.setItem("syx_email", email);
      sessionStorage.setItem("syx_name", name);
    } catch {
      /* ignore */
    }

    // Never block a booking on the form: if the save fails, the calendar still
    // appears with a note asking them to email instead.
    if (SUPABASE_IS_SET) {
      try {
        const res = await fetch(SUBSCRIBE_FN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            name,
            email,
            sendBook: false,
            meta: {
              source: "synergox.co/apply",
              currency: a.currency,
              businessModel: a.model,
              monthlyRevenue: a.revenue,
              monthlyAdSpend: a.spend,
              biggestBottleneck: a.bottleneck,
              company: a.company.trim(),
              phone: a.phone.trim(),
              website: a.website.trim(),
              recommendation: underServed ? "Learn track" : "Done for you",
            },
          }),
        });
        if (!res.ok) setFailed(true);
      } catch {
        setFailed(true);
      }

      // A consultation record for the dashboard, for everyone who is shown the
      // calendar. Best-effort: the lead above is already saved either way.
      if (!underServed) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/request_consultation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              apikey: SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              p_name: name,
              p_email: email,
              p_phone: a.phone.trim() || null,
              p_company: a.company.trim() || null,
              p_website: a.website.trim() || null,
              p_answers: {
                currency: a.currency,
                businessModel: a.model,
                monthlyRevenue: a.revenue,
                monthlyAdSpend: a.spend,
                biggestBottleneck: a.bottleneck,
              },
            }),
          });
          if (res.ok) {
            const token = await res.json();
            if (typeof token === "string") consultToken.current = token;
          }
        } catch {
          /* ignore */
        }
      }
    } else {
      console.warn("Supabase not set — application not saved (paste keys in lib/site.ts).");
    }

    setSending(false);
    setSent(true);
    window.scrollTo({ top: 0 });
  }

  const bookingUrl = useMemo(() => {
    const p = new URLSearchParams({
      name: a.name.trim(),
      email: a.email.trim(),
      a1: `${a.model} · ${a.revenue} · spend ${a.spend} · ${a.bottleneck}`,
    });
    return `${BOOKING_URL}?${p.toString()}`;
  }, [a, BOOKING_URL]);

  const firstName = a.name.trim().split(/\s+/)[0] ?? "";

  /* ─────────────────────────── AFTER THE FORM ─────────────────────────── */
  if (sent) {
    if (underServed) {
      return (
        <section className="pb-24 pt-[112px] md:pt-[140px]">
          <div className="shell max-w-3xl">
            <div className="card p-8 shadow-card md:p-12">
              <Eyebrow>A straight answer</Eyebrow>
              <h1
                ref={heading}
                tabIndex={-1}
                className="h-section mt-5 outline-none"
              >
                We&apos;d be the wrong spend for you right now.
              </h1>
              <p className="lede mt-5">
                At your current revenue, with no ad budget yet, our fee would
                eat the margin the work is supposed to create. We could take
                the money. You&apos;d be worse off, and we&apos;d both know it
                by month three.
              </p>
              <p className="lede mt-4">
                There&apos;s a better route for where you are. Same teardown
                method, same frameworks and templates, and you run them
                yourself at a fraction of the cost. The skill stays with you
                when revenue climbs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/learn" className="btn-primary">
                  Show me the learn track
                  <Arrow />
                </Link>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Book the call anyway
                </a>
              </div>
              <p className="mt-6 text-[0.88rem] leading-relaxed text-mute">
                The call is still free and we&apos;ll still run the teardown.
                We just won&apos;t pitch you a build you shouldn&apos;t buy.
              </p>
            </div>
          </div>
        </section>
      );
    }

    const embedUrl =
      `${bookingUrl}&hide_gdpr_banner=1&primary_color=00a344&embed_type=Inline` +
      `&embed_domain=${encodeURIComponent(
        typeof window !== "undefined" ? window.location.host : "synergox.co"
      )}`;

    return (
      <section className="pb-24 pt-[104px] md:pt-[128px]">
        <div className="shell max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-greenTint px-4 py-2 text-[0.8rem] font-semibold text-greenDeep">
              <Check size={13} />
              Answers received · One step left
            </span>
            <h1
              ref={heading}
              tabIndex={-1}
              className="h-section mt-5 outline-none"
            >
              {firstName ? `Thanks, ${firstName}. ` : ""}Pick a time that suits you.
            </h1>
            <p className="lede mx-auto mt-4 max-w-xl">
              {CALL_MINUTES} minutes, by video. We&apos;ll have modelled your
              funnel before we speak, so the call opens with what we found.
            </p>
          </div>

          {failed && (
            <p role="alert" className="mx-auto mt-6 max-w-2xl rounded-2xl border border-line bg-mist px-5 py-4 text-[0.92rem] leading-relaxed text-ink">
              One thing: your answers didn&apos;t reach us. Book your time
              below anyway, then email{" "}
              <a href={`mailto:${EMAIL}`} className="link">
                {EMAIL}
              </a>{" "}
              and we&apos;ll take them by hand.
            </p>
          )}

          <div className="mt-8 overflow-hidden rounded-slab border border-line bg-paper shadow-card">
            <iframe
              src={embedUrl}
              title="Choose a time for your growth teardown call"
              className="h-[1040px] w-full border-0 md:h-[720px]"
            />
          </div>

          <p className="mt-5 text-center text-[0.9rem] text-mute">
            Calendar not loading?{" "}
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="link">
              Open it in a new tab
            </a>
          </p>
        </div>
      </section>
    );
  }

  /* ─────────────────────────── THE BOOKING PAGE ─────────────────────────── */
  return (
    <section className="pb-20 pt-[104px] md:pb-28 md:pt-[136px]">
      <div className="shell grid gap-x-14 gap-y-8 lg:grid-cols-[1fr_minmax(0,500px)]">
        {/* Pitch */}
        <div className="lg:col-start-1 lg:row-start-1">
          <Eyebrow>Free growth teardown · {CALL_MINUTES} minutes</Eyebrow>
          <h1 className="h-display mt-5 text-[2.3rem] sm:text-[3rem] lg:text-[3.4rem]">
            Find out exactly where your funnel is{" "}
            <span className="hl">losing customers.</span>
          </h1>
          <p className="lede mt-5 max-w-xl">
            Five quick questions, then pick a time. On the call we model your
            funnel on your real numbers and tell you what fixing the weakest
            stage is worth.
          </p>
        </div>

        {/* Form */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start lg:sticky lg:top-24">
          <form
            onSubmit={finish}
            noValidate
            className="rounded-slab border border-line bg-paper p-6 shadow-lift sm:p-8"
          >
            <div>
              <div className="flex items-baseline justify-between text-[0.84rem]">
                <span className="font-semibold text-ink">
                  Question {step + 1} of {TOTAL}
                </span>
                <span className="text-mute">About a minute</span>
              </div>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={TOTAL}
                aria-valuenow={step + 1}
                aria-label="Progress"
              >
                <motion.div
                  className="h-full rounded-full bg-green"
                  initial={false}
                  animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7"
              >
                <h2
                  ref={heading}
                  tabIndex={-1}
                  className="font-display text-[1.45rem] font-extrabold leading-[1.12] tracking-tighter2 text-ink outline-none sm:text-[1.65rem]"
                >
                  {current.q}
                </h2>
                <p className="mt-2 text-[0.93rem] leading-relaxed text-body">{current.sub}</p>
                <div className="mt-6">{current.body}</div>
              </motion.div>
            </AnimatePresence>

            {isLast && (
              <button type="submit" disabled={sending} className="btn-primary mt-6 w-full">
                {sending ? "One moment…" : "Show me available times"}
                {!sending && <Arrow />}
              </button>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => {
                  clearTimeout(advance.current);
                  setStep((s) => Math.max(0, s - 1));
                }}
                disabled={step === 0}
                className="text-[0.9rem] font-medium text-body transition-colors hover:text-ink disabled:invisible"
              >
                ← Back
              </button>
              <p className="text-right text-[0.8rem] leading-relaxed text-mute">
                Your answers go to us and nowhere else.{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
                  Privacy
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Reasons + reassurance */}
        <div className="lg:col-start-1 lg:row-start-2">
          <div className="rounded-card bg-mist p-7">
            <p className="eyebrow">You leave the call with</p>
            <ul className="mt-5 space-y-3.5">
              {leaveWith.map((l) => (
                <li key={l} className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-ink">
                  <Tick className="mt-1" />
                  {l}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-8 space-y-6">
            {reassure.map((r) => (
              <div key={r.q}>
                <dt className="font-display text-[1.1rem] font-extrabold tracking-tighter2 text-ink">
                  {r.q}
                </dt>
                <dd className="mt-1.5 max-w-xl text-[0.96rem] leading-relaxed text-body">{r.a}</dd>
              </div>
            ))}
          </dl>

          {testimonial && (
            <figure className="on-dark mt-9 rounded-card bg-ink p-7 text-white">
              <blockquote className="font-display text-[1.25rem] font-semibold leading-snug tracking-tighter2">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[0.88rem] text-ash">
                {testimonial.name}
                {testimonial.role ? ` · ${testimonial.role}` : ""}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
