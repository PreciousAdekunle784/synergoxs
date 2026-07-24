"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BOOKING_URL, FORM_ENDPOINT } from "@/lib/site";

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
  NGN: { symbol: "₦", label: "Nigerian Naira", rate: 1550, locale: "en-NG" },
  USD: { symbol: "$", label: "US Dollar", rate: 1, locale: "en-US" },
  GBP: { symbol: "£", label: "Pound Sterling", rate: 0.79, locale: "en-GB" },
  EUR: { symbol: "€", label: "Euro", rate: 0.92, locale: "de-DE" },
  GHS: { symbol: "₵", label: "Ghanaian Cedi", rate: 15, locale: "en-GH" },
  KES: { symbol: "KSh", label: "Kenyan Shilling", rate: 129, locale: "en-KE" },
  ZAR: { symbol: "R", label: "South African Rand", rate: 18, locale: "en-ZA" },
  CAD: { symbol: "C$", label: "Canadian Dollar", rate: 1.37, locale: "en-CA" },
  AUD: { symbol: "A$", label: "Australian Dollar", rate: 1.52, locale: "en-AU" },
  AED: { symbol: "AED", label: "UAE Dirham", rate: 3.67, locale: "en-AE" },
} as const;

type CurKey = keyof typeof CURRENCIES;

/**
 * Round to two significant figures.
 *
 * An earlier version snapped to 1/2/5 x powers of ten, which looked tidier but
 * lied: 7.75m rounded UP to 10m while 31m rounded DOWN to 20m, so consecutive
 * bands stopped lining up. Two sig figs keeps every band honest and still reads
 * cleanly once compacted (7.8m, 31m, 230m).
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

type Answers = {
  currency: CurKey | "";
  market: string;
  model: string;
  revenue: string;
  revenueIndex: number;
  spend: string;
  spendIndex: number;
  bottleneck: string;
  tried: string[];
  timeline: string;
  authority: string;
  name: string;
  email: string;
  company: string;
  website: string;
};

const EMPTY: Answers = {
  currency: "",
  market: "",
  model: "",
  revenue: "",
  revenueIndex: -1,
  spend: "",
  spendIndex: -1,
  bottleneck: "",
  tried: [],
  timeline: "",
  authority: "",
  name: "",
  email: "",
  company: "",
  website: "",
};

function Choice({
  label,
  selected,
  onClick,
  hint,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-4 rounded-card border px-6 py-5 text-left transition-all duration-300 ${
        selected
          ? "border-signal bg-signal/[0.07]"
          : "border-hair bg-panel hover:border-inkFaint hover:bg-rail"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-signal bg-signal" : "border-inkFaint"
        }`}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 15 15" fill="none">
            <path
              d="M3.5 8l3 3 5-7"
              stroke="#050605"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span
          className={`block text-[1rem] leading-snug ${
            selected ? "text-ink" : "text-ink/85"
          }`}
        >
          {label}
        </span>
        {hint && (
          <span className="mt-1 block text-[0.83rem] leading-snug text-inkFaint">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}

export default function Apply() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  const cur = (a.currency || "USD") as CurKey;

  /** Below this, an agency retainer can't return. Send them to the courses. */
  const underServed =
    a.revenueIndex === 0 && (a.spendIndex === 0 || a.spendIndex === -1);

  const steps = useMemo(
    () => [
      {
        id: "currency",
        eyebrow: "First, the basics",
        q: "What currency do you sell in?",
        sub: "Everything after this — revenue, budget, the numbers we model on the call — will be shown in it.",
        valid: () => a.currency !== "",
        body: (
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(CURRENCIES) as CurKey[]).map((k) => (
              <Choice
                key={k}
                label={`${CURRENCIES[k].symbol}  ${k}`}
                hint={CURRENCIES[k].label}
                selected={a.currency === k}
                onClick={() => {
                  set("currency", k);
                  set("revenue", "");
                  set("revenueIndex", -1);
                  set("spend", "");
                  set("spendIndex", -1);
                }}
              />
            ))}
          </div>
        ),
      },
      {
        id: "market",
        eyebrow: "Where you sell",
        q: "Which market do most of your customers sit in?",
        sub: "This decides the channels, the ad costs we model against, and who runs your account.",
        valid: () => a.market !== "",
        body: (
          <div className="grid gap-3">
            {[
              "Nigeria",
              "Rest of Africa",
              "United Kingdom or Europe",
              "United States or Canada",
              "Middle East",
              "Australia, Asia or elsewhere",
            ].map((m) => (
              <Choice
                key={m}
                label={m}
                selected={a.market === m}
                onClick={() => set("market", m)}
              />
            ))}
          </div>
        ),
      },
      {
        id: "model",
        eyebrow: "What you sell",
        q: "How does the business make money?",
        sub: "The funnel shape changes completely between these. There's no wrong answer.",
        valid: () => a.model !== "",
        body: (
          <div className="grid gap-3">
            {[
              ["Services sold on a call", "Consulting, agency, professional services, B2B"],
              ["Products sold online", "E-commerce, D2C, retail with a storefront"],
              ["Software or subscription", "SaaS, memberships, recurring plans"],
              ["Local or appointment-based", "Clinics, trades, salons, restaurants, fitness"],
              ["Something else", "Tell us on the call"],
            ].map(([m, hint]) => (
              <Choice
                key={m}
                label={m}
                hint={hint}
                selected={a.model === m}
                onClick={() => set("model", m)}
              />
            ))}
          </div>
        ),
      },
      {
        id: "revenue",
        eyebrow: "The numbers",
        q: "Roughly what does the business turn over each month?",
        sub: `In ${cur}. A range is fine — nobody is holding you to it, and it never leaves us.`,
        valid: () => a.revenueIndex >= 0,
        body: (
          <div className="grid gap-3 sm:grid-cols-2">
            {REVENUE_BANDS.map(([lo, hi], i) => {
              const label = bandLabel(cur, lo, hi);
              return (
                <Choice
                  key={i}
                  label={label}
                  selected={a.revenueIndex === i}
                  onClick={() => {
                    set("revenueIndex", i);
                    set("revenue", `${label} ${cur}/mo`);
                  }}
                />
              );
            })}
          </div>
        ),
      },
      {
        id: "spend",
        eyebrow: "The numbers",
        q: "What are you currently putting into paid acquisition each month?",
        sub: `In ${cur}. If the answer is nothing yet, say so — it's a common starting point, not a problem.`,
        valid: () => a.spendIndex >= 0,
        body: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Choice
              label="Nothing yet"
              hint="All organic, referral or word of mouth"
              selected={a.spendIndex === 0}
              onClick={() => {
                set("spendIndex", 0);
                set("spend", "Nothing yet");
              }}
            />
            {SPEND_BANDS.map(([lo, hi], i) => {
              const label = bandLabel(cur, lo, hi);
              return (
                <Choice
                  key={i}
                  label={label}
                  selected={a.spendIndex === i + 1}
                  onClick={() => {
                    set("spendIndex", i + 1);
                    set("spend", `${label} ${cur}/mo`);
                  }}
                />
              );
            })}
          </div>
        ),
      },
      {
        id: "bottleneck",
        eyebrow: "The problem",
        q: "Where do you think you're losing the most?",
        sub: "Your instinct is usually close. The teardown on the call will tell us whether it's right.",
        valid: () => a.bottleneck !== "",
        body: (
          <div className="grid gap-3">
            {[
              ["Not enough people find us", "Traffic is the constraint"],
              ["Traffic arrives but doesn't convert", "The page or the offer"],
              ["Leads come in but never book", "The follow-up gap"],
              ["Calls happen but don't close", "Qualification or the sales conversation"],
              ["Customers buy once and vanish", "Retention and lifetime value"],
              ["Honestly, I don't know", "That's what the teardown is for"],
            ].map(([b, hint]) => (
              <Choice
                key={b}
                label={b}
                hint={hint}
                selected={a.bottleneck === b}
                onClick={() => set("bottleneck", b)}
              />
            ))}
          </div>
        ),
      },
      {
        id: "tried",
        eyebrow: "History",
        q: "What have you already tried?",
        sub: "Pick everything that applies. Knowing what didn't work saves us both a month.",
        valid: () => a.tried.length > 0,
        body: (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "An agency",
              "Freelancers",
              "An in-house marketer",
              "Running ads myself",
              "A website redesign",
              "Courses or coaching",
              "Nothing structured yet",
            ].map((t) => (
              <Choice
                key={t}
                label={t}
                selected={a.tried.includes(t)}
                onClick={() =>
                  set(
                    "tried",
                    a.tried.includes(t)
                      ? a.tried.filter((x) => x !== t)
                      : [...a.tried, t]
                  )
                }
              />
            ))}
          </div>
        ),
      },
      {
        id: "timeline",
        eyebrow: "Timing",
        q: "When would you want work to start?",
        sub: "We take on three builds a month, so this decides which conversation we're having.",
        valid: () => a.timeline !== "",
        body: (
          <div className="grid gap-3">
            {[
              ["As soon as possible", "Ready to move this month"],
              ["Within the next quarter", "Planning ahead, budget likely approved"],
              ["Later this year", "Early research"],
              ["Just exploring for now", "No timeline yet"],
            ].map(([t, hint]) => (
              <Choice
                key={t}
                label={t}
                hint={hint}
                selected={a.timeline === t}
                onClick={() => set("timeline", t)}
              />
            ))}
          </div>
        ),
      },
      {
        id: "authority",
        eyebrow: "Timing",
        q: "Who signs off on something like this?",
        sub: "Only so the right people are in the room. Nobody enjoys a second call to repeat the first one.",
        valid: () => a.authority !== "",
        body: (
          <div className="grid gap-3">
            {[
              "I do — it's my decision",
              "Me and one other person",
              "I'd need to take it to someone",
              "I'm researching on someone's behalf",
            ].map((t) => (
              <Choice
                key={t}
                label={t}
                selected={a.authority === t}
                onClick={() => set("authority", t)}
              />
            ))}
          </div>
        ),
      },
      {
        id: "contact",
        eyebrow: "Last step",
        q: "Where do we send the teardown?",
        sub: "We'll review your answers before the call, so it starts at minute one instead of minute fifteen.",
        valid: () => a.name.trim() !== "" && a.email.includes("@"),
        body: (
          <div className="grid gap-3">
            {[
              ["name", "Your name", "text", true],
              ["email", "Work email", "email", true],
              ["company", "Company name", "text", false],
              ["website", "Website (if you have one)", "url", false],
            ].map(([k, ph, type, req]) => (
              <div key={k as string}>
                <label htmlFor={`f-${k}`} className="sr-only">
                  {ph as string}
                </label>
                <input
                  id={`f-${k}`}
                  type={type as string}
                  required={req as boolean}
                  value={a[k as keyof Answers] as string}
                  onChange={(e) =>
                    set(k as keyof Answers, e.target.value as never)
                  }
                  placeholder={ph as string}
                  className="w-full rounded-card border border-hair bg-panel px-6 py-4 text-[1rem] text-ink placeholder:text-inkFaint focus:border-signal/60"
                />
              </div>
            ))}
          </div>
        ),
      },
    ],
    [a, cur]
  );

  const total = steps.length;
  const current = steps[step];
  const pct = Math.round(((step + (sent ? 1 : 0)) / total) * 100);

  async function finish() {
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          source: "synergox.co/apply",
          currency: a.currency,
          market: a.market,
          businessModel: a.model,
          monthlyRevenue: a.revenue,
          monthlyAdSpend: a.spend,
          biggestBottleneck: a.bottleneck,
          alreadyTried: a.tried.join(", "),
          timeline: a.timeline,
          decisionMaker: a.authority,
          name: a.name,
          email: a.email,
          company: a.company,
          website: a.website,
          recommendation: underServed ? "Learn track" : "Done for you",
        }),
      });
      if (!res.ok) setFailed(true);
    } catch {
      setFailed(true);
    }
    setSending(false);
    setSent(true);
  }

  const bookingUrl = `${BOOKING_URL}?name=${encodeURIComponent(
    a.name
  )}&email=${encodeURIComponent(a.email)}&a1=${encodeURIComponent(
    `${a.model} · ${a.revenue} · spend ${a.spend} · ${a.bottleneck}`
  )}`;

  /* ---------------------------------------------------------------- */
  if (sent) {
    return (
      <div className="mx-auto max-w-3xl">
        {underServed ? (
          <div className="rounded-slab border border-hair bg-panel p-9 shadow-lift md:p-14">
            <p className="eyebrow">Straight answer</p>
            <h2 className="mt-5 font-display text-[2rem] font-extrabold leading-tight tracking-tightest text-ink sm:text-[2.5rem]">
              We&apos;d be the wrong spend for you right now.
            </h2>
            <p className="body-lg mt-6">
              At your current revenue and ad budget, our fee would eat the
              margin the work is supposed to create. We could take the money.
              You&apos;d be worse off, and we&apos;d both know it by month
              three.
            </p>
            <p className="body-lg mt-4">
              The second door exists for exactly this. Same teardown method,
              same frameworks and templates — you run them yourself, at a
              fraction of the cost, and the skill stays with you when revenue
              does climb.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/learn" className="btn-signal shadow-press">
                Show me the learn track
              </Link>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Book the call anyway
              </a>
            </div>
            <p className="mt-6 text-[0.85rem] leading-relaxed text-inkFaint">
              The call is still free and we&apos;ll still run the teardown. We
              just won&apos;t pitch you a build you shouldn&apos;t buy.
            </p>
          </div>
        ) : (
          <div>
            <div className="rounded-slab border border-signal/25 bg-signal/[0.05] p-9 shadow-lift md:p-12">
              <p className="eyebrow text-signal">Qualified</p>
              <h2 className="mt-5 font-display text-[2rem] font-extrabold leading-tight tracking-tightest text-ink sm:text-[2.5rem]">
                You&apos;re a fit. Pick your time.
              </h2>
              <p className="body-lg mt-6 max-w-xl">
                Your answers are with us. We&apos;ll model your funnel before we
                speak, so the call opens with what we found instead of twenty
                minutes of questions you&apos;ve already answered.
              </p>
              {failed && (
                <p className="mt-5 rounded-card border border-bone/25 bg-bone/[0.05] px-5 py-4 text-[0.88rem] leading-relaxed text-bone">
                  One thing — your answers didn&apos;t reach us. Book below
                  anyway and forward this page, or email hello@synergox.co and
                  we&apos;ll take them manually.
                </p>
              )}
            </div>

            <div className="mt-6 overflow-hidden rounded-slab border border-hair bg-panel shadow-lift">
              <iframe
                src={`${bookingUrl}&hide_gdpr_banner=1&background_color=101310&text_color=f2f4f1&primary_color=00c551`}
                title="Book a strategy call with Synergox"
                className="h-[720px] w-full border-0"
                loading="lazy"
              />
            </div>

            <p className="mt-6 text-center text-[0.85rem] text-inkFaint">
              Calendar not loading?{" "}
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal hover:underline"
              >
                Open it in a new tab
              </a>
              .
            </p>
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">
            Step {step + 1} of {total}
          </span>
          <span className="num text-[0.78rem] text-inkFaint">{pct}%</span>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-rail">
          <motion.div
            className="h-full rounded-full bg-signal"
            animate={{ width: `${((step + 1) / total) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">{current.eyebrow}</p>
          <h2 className="mt-5 font-display text-[1.9rem] font-extrabold leading-[1.08] tracking-tightest text-ink sm:text-[2.35rem]">
            {current.q}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-inkMute">
            {current.sub}
          </p>
          <div className="mt-9">{current.body}</div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-hair pt-8">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-[0.9rem] text-inkMute transition-colors hover:text-ink disabled:opacity-30"
        >
          ← Back
        </button>

        {step < total - 1 ? (
          <button
            type="button"
            onClick={() => current.valid() && setStep((s) => s + 1)}
            disabled={!current.valid()}
            className="btn-signal shadow-press disabled:cursor-not-allowed disabled:opacity-35"
          >
            Continue
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path
                d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => current.valid() && finish()}
            disabled={!current.valid() || sending}
            className="btn-signal shadow-press disabled:cursor-not-allowed disabled:opacity-35"
          >
            {sending ? "Sending…" : "See my times"}
          </button>
        )}
      </div>

      <p className="mt-8 text-[0.8rem] leading-relaxed text-inkFaint">
        Ten questions, about ninety seconds. Your answers go to us and nowhere
        else — read the{" "}
        <Link href="/privacy" className="text-inkMute hover:text-ink">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
