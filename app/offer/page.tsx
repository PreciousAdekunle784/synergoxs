import type { Metadata } from "next";
import Link from "next/link";
import { OFFER_AMOUNT_KOBO, OFFER_CURRENCY } from "@/lib/site";
import PayButton from "@/components/PayButton";
import OfferProof from "@/components/OfferProof";

export const metadata: Metadata = {
  title: "Your Growth System, Built For You — Synergox",
  description:
    "We install the exact system from The Compounding Business inside your business — offer, funnel, traffic, follow-up — built, launched, and optimised by people who do it every week.",
  robots: { index: false, follow: false },
};

function price() {
  const major = OFFER_AMOUNT_KOBO / 100;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: OFFER_CURRENCY,
      maximumFractionDigits: major % 1 === 0 ? 0 : 2,
    }).format(major);
  } catch {
    return `${OFFER_CURRENCY} ${major.toLocaleString()}`;
  }
}

export default function OfferPage() {
  const P = price();

  return (
    <div className="bg-void">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 500px at 50% -5%, rgba(0,197,81,0.12), transparent 65%)",
          }}
        />
        <div className="shell max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-signal/25 bg-signal/[0.06] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-signal">
              You&apos;ve read the book · Now skip the years
            </span>
          </div>

          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tightest text-ink sm:text-[3.4rem] md:text-[4rem]">
            You now know the system.
            <br />
            <span className="text-signal">We&apos;ll build it for you</span> in
            weeks, not years.
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-[1.05rem] leading-relaxed text-inkMute md:text-[1.15rem]">
            The Compounding Business showed you the seven levers. Here&apos;s the
            uncomfortable truth: knowing them and having the time, the team, and
            the scars to install them correctly are two very different things.
            You could spend the next eighteen months learning that the expensive
            way. Or we can do it with you, starting this week.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <PayButton className="btn-signal px-9 py-5 text-[1.05rem] shadow-press" />
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-inkFaint">
              One-time {P} · Secure checkout · Scope guarantee
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── THE REAL PROBLEM ─────────────────────── */}
      <section className="border-t border-hair py-20 md:py-28">
        <div className="shell max-w-2xl">
          <p className="eyebrow text-signal">Let&apos;s be honest about what happens next</p>
          <h2 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink md:text-[2.6rem]">
            Most people who read a guide like that do nothing with it.
          </h2>
          <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-inkMute">
            <p>
              Not because they&apos;re lazy. Because they&apos;re already running
              a business. The offer rewrite, the funnel build, the traffic
              testing, the follow-up sequences, the tracking — each one is a
              project, and you have a company to run while you attempt all of
              them at once, for the first time, with no one to tell you which
              order to do them in.
            </p>
            <p>
              So the book becomes another PDF in a folder. Six months later
              nothing has changed, except now you also feel guilty about it.
            </p>
            <p className="border-l-2 border-signal pl-6 font-display text-[1.25rem] font-semibold leading-snug tracking-tighter2 text-ink">
              The bottleneck was never information. It was implementation — and
              implementation is exactly the thing you can hand to someone else.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── WHAT YOU GET ─────────────────────── */}
      <section className="border-t border-hair bg-pitch py-20 md:py-28">
        <div className="shell max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-signal">What we actually build</p>
            <h2 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink md:text-[2.6rem]">
              We install the whole system. You approve it and watch it run.
            </h2>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-inkMute">
              This isn&apos;t advice, a course, or a call where we tell you what
              to do. We build the machine — the same seven levers from the book —
              inside your business, launch it, and tune it until the numbers move.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "An offer they can't compare on price",
                d: "We rebuild your core offer into a stacked, risk-reversed proposition, priced against the transformation — so you stop competing with whoever's cheapest.",
              },
              {
                n: "02",
                t: "A conversion machine, not a website",
                d: "A page built to move one visitor to one action, with the trust, proof and objection-handling that turns attention into commitment.",
              },
              {
                n: "03",
                t: "One traffic channel, proven and scaled",
                d: "We find a source with a cost per customer that works, prove it, then scale it — instead of spraying budget across six channels badly.",
              },
              {
                n: "04",
                t: "Follow-up that closes the 80% who don't buy today",
                d: "The email and nurture sequences most businesses never send — the ones where the majority of the revenue actually lives.",
              },
              {
                n: "05",
                t: "Tracking you'll actually look at",
                d: "A simple dashboard of the four numbers that matter, so growth becomes something you forecast instead of something you hope for.",
              },
              {
                n: "06",
                t: "Every asset in your name from day one",
                d: "Ad accounts, code, list, funnel — all yours from the first week. There's no version of leaving us that means rebuilding anything.",
              },
            ].map((f) => (
              <div
                key={f.n}
                className="rounded-slab border border-hair bg-panel p-7 shadow-lift"
              >
                <span className="font-mono text-[0.72rem] text-signal">{f.n}</span>
                <h3 className="mt-3 font-display text-[1.25rem] font-extrabold tracking-tighter2 text-ink">
                  {f.t}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-inkMute">
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── VALUE STACK + PRICE ─────────────────────── */}
      <section className="border-t border-hair py-20 md:py-28">
        <div className="shell max-w-2xl">
          <div className="text-center">
            <p className="eyebrow text-signal">What this is worth</p>
            <h2 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink md:text-[2.6rem]">
              Priced against what it replaces.
            </h2>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-inkMute">
              A full-time growth marketer in Lagos runs ₦4–8M a year before they
              produce a thing. A senior agency retainer starts around ₦1.5M a
              month. Learning it yourself costs something worse than money — the
              time you don&apos;t get back and the customers you lose while you
              figure it out.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-slab border border-hair bg-panel shadow-lift">
            <div className="border-b border-hair bg-pitch px-7 py-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-inkMute">
                Everything included
              </span>
            </div>
            {[
              ["The full offer rebuild", "₦450,000"],
              ["The conversion machine (page + funnel)", "₦650,000"],
              ["Traffic channel setup & first campaigns", "₦400,000"],
              ["Follow-up + nurture automation", "₦350,000"],
              ["Tracking dashboard & weekly reporting", "₦250,000"],
              ["The Compounding Business (the book)", "Free"],
            ].map(([item, val]) => (
              <div
                key={item}
                className="flex items-center justify-between gap-4 border-b border-hair/60 px-7 py-4"
              >
                <span className="flex items-center gap-3 text-[0.97rem] text-ink/90">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path d="M3.5 8l3 3 5-7" stroke="#00C551" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </span>
                <span className="font-mono text-[0.85rem] text-inkFaint line-through">
                  {val}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-7 py-5">
              <span className="font-display text-[1.05rem] font-bold text-inkMute">
                Total value
              </span>
              <span className="font-mono text-[0.95rem] text-inkMute line-through">
                ₦2,450,000+
              </span>
            </div>

            <div className="bg-signal/[0.06] px-7 py-8 text-center">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-signal">
                Your price today
              </p>
              <p className="mt-2 font-display text-[3rem] font-extrabold leading-none tracking-tightest text-ink md:text-[3.6rem]">
                {P}
              </p>
              <p className="mt-3 text-[0.9rem] text-inkMute">
                One-time. Not a monthly retainer.
              </p>
              <div className="mt-7 flex flex-col items-center gap-3">
                <PayButton className="btn-signal w-full max-w-sm px-9 py-5 text-[1.05rem] shadow-press" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-inkFaint">
                  Secure Paystack checkout · Card, transfer, USSD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── RISK REVERSAL ─────────────────────── */}
      <section className="border-t border-hair bg-pitch py-20 md:py-28">
        <div className="shell max-w-2xl">
          <p className="eyebrow text-signal">The risk is on us</p>
          <h2 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink md:text-[2.6rem]">
            You don&apos;t take the leap. We do.
          </h2>
          <div className="mt-10 space-y-5">
            {[
              {
                t: "Ship it, or it's free.",
                d: "Every stage of the build is scoped and priced separately. A stage we don't deliver is a stage you don't pay for. It's a clause in your agreement, not a promise on a page.",
              },
              {
                t: "You own everything from day one.",
                d: "Accounts, code, list, creative — all in your name from week one. If we ever part ways, you keep a working system, not a pile of things to rebuild.",
              },
              {
                t: "No twelve-month lock-in.",
                d: "The build is a one-time engagement. No retainer trap, no cancellation penalty, no clawback on work already delivered.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-card border border-hair bg-panel p-6">
                <h3 className="font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                  {c.t}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-inkMute">
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PROOF ─────────────────────── */}
      <OfferProof />

      {/* ─────────────────────── OBJECTIONS ─────────────────────── */}
      <section className="border-t border-hair bg-pitch py-20 md:py-28">
        <div className="shell max-w-2xl">
          <p className="eyebrow text-signal">Before you decide</p>
          <h2 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink md:text-[2.6rem]">
            The three things you&apos;re thinking right now.
          </h2>
          <div className="mt-10 space-y-8">
            {[
              {
                q: "\u201cCan't I just do this myself with the book?\u201d",
                a: "You can — and some people should. But the book is the map, not the miles. If your time is better spent running the business you already have than spending a year becoming a growth marketer, that's exactly what this is for. You've already got the knowledge; this is the execution.",
              },
              {
                q: "\u201cWhat if it doesn't work for my business?\u201d",
                a: "That's why the build is scoped in stages and why you own everything as we go. If a stage doesn't ship, you don't pay for it. And because we start by finding your single biggest leak, we're not guessing — we build against the constraint that's actually costing you money.",
              },
              {
                q: "\u201cWhy is it a one-time price and not a retainer?\u201d",
                a: "Because you should own your growth system, not rent it from us forever. We build the machine, hand you the keys, and if you want ongoing optimisation later, that's your choice — not a condition of getting started.",
              },
            ].map((o) => (
              <div key={o.q}>
                <h3 className="font-display text-[1.2rem] font-bold tracking-tighter2 text-ink">
                  {o.q}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-inkMute">
                  {o.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── FINAL CLOSE ─────────────────────── */}
      <section className="relative overflow-hidden border-t border-hair py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(700px 400px at 50% 110%, rgba(0,197,81,0.14), transparent 65%)",
          }}
        />
        <div className="shell max-w-2xl text-center">
          <h2 className="font-display text-[2.2rem] font-extrabold leading-[1.05] tracking-tightest text-ink md:text-[3rem]">
            A year from now, the system will either be built or it won&apos;t.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[1.05rem] leading-relaxed text-inkMute">
            The only question is whether you spent that year building it alone,
            or whether it was already running while you ran your business. The
            customers are out there right now, choosing whoever converts them
            best. Let&apos;s make that you.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <PayButton className="btn-signal px-9 py-5 text-[1.05rem] shadow-press" />
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-inkFaint">
              One-time {P} · Ship-it guarantee · You own it all
            </p>
          </div>
          <p className="mt-10 text-[0.9rem] text-inkFaint">
            Not ready to commit?{" "}
            <Link href="/apply" className="text-inkMute underline decoration-hair underline-offset-4 hover:text-ink">
              Book a call first
            </Link>{" "}
            and we&apos;ll map your leak before you decide.
          </p>
        </div>
      </section>
    </div>
  );
}
