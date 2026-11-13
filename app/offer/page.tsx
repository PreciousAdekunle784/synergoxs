import type { Metadata } from "next";
import Link from "next/link";
import { BOOKING_PAGE, OFFER_AMOUNT_KOBO, OFFER_CURRENCY, OFFER_LABEL } from "@/lib/site";
import PayButton from "@/components/PayButton";
import OfferProof from "@/components/OfferProof";
import { Check, Cross, Tick } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Your growth system, built for you",
  description:
    "The Growth System Build: we build the offer, the funnel, the ads and the follow-up that turn strangers into customers. One-time fee, no retainer, and you own all of it.",
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

const deliverables = [
  {
    t: "An offer they can't compare on price",
    d: "We rebuild your core offer into a stacked, risk-reversed proposition priced against the transformation, so you stop competing with whoever's cheapest.",
  },
  {
    t: "A page built to convert, not just to exist",
    d: "One visitor, one action, with the trust, proof and objection-handling that turns attention into commitment.",
  },
  {
    t: "One traffic channel, proven first",
    d: "We find a source with a cost per customer that works and prove it, instead of spraying budget across six channels badly.",
  },
  {
    t: "Follow-up for everyone who doesn't buy today",
    d: "The email and nurture sequences most businesses never send. This is where a lot of the revenue is hiding.",
  },
  {
    t: "Tracking you'll actually look at",
    d: "A simple dashboard of the four numbers that matter, so growth becomes something you forecast instead of something you hope for.",
  },
  {
    t: "Every asset in your name from day one",
    d: "Ad accounts, code, list, funnel. All yours from the first week. Leaving us never means rebuilding anything.",
  },
];

const compare = [
  {
    label: "Whole system built (offer, funnel, ads, follow-up)",
    diy: "You, from scratch",
    free: "One piece only",
    agency: "Sometimes",
    syx: true,
  },
  {
    label: "Funnel designed to convert, not just look good",
    diy: "no",
    free: "Maybe",
    agency: "Varies",
    syx: true,
  },
  {
    label: "Ads judged on cost per customer",
    diy: "no",
    free: "Rarely",
    agency: "Often vanity metrics",
    syx: true,
  },
  {
    label: "You own every asset from day one",
    diy: "yes",
    free: "Usually",
    agency: "Often locked in",
    syx: true,
  },
  {
    label: "Time it costs you",
    diy: "Months of your life",
    free: "Heavy management",
    agency: "Lots of meetings",
    syx: "Minimal. We drive",
  },
  {
    label: "Ongoing monthly retainer",
    diy: "—",
    free: "Per project",
    agency: "Usually",
    syx: "No. One-time build",
  },
  {
    label: "Scope guarantee (don't ship it, don't bill it)",
    diy: "—",
    free: "no",
    agency: "no",
    syx: true,
  },
] as const;

const included = [
  "The full offer rebuild",
  "The conversion page and funnel",
  "Traffic channel setup and first campaigns",
  "Follow-up and nurture automation",
  "Tracking dashboard and weekly reporting",
  "The Compounding Business (the playbook)",
];

const forYou = [
  "You already have a product or service people buy. You just can't make the flow of customers predictable.",
  "You'd rather run your business than spend a year becoming a growth marketer.",
  "You can handle more customers if we send them. The constraint is acquisition, not delivery.",
  "You want to own the system, not rent an agency forever.",
];

const notForYou = [
  "You want a magic button that needs nothing from you. This is a build, and it needs your offer and your approvals.",
  "You don't yet have something people pay for. Fix the offer first; the playbook shows you how.",
  "You want the cheapest option on the market. That's a race we don't run.",
  "You need results next week. Real systems take a few weeks to build and tune.",
];

const reversals = [
  {
    t: "Ship it, or it's free.",
    d: "Every stage of the build is scoped and priced separately. A stage we don't deliver is a stage you don't pay for. It's a clause in your agreement, not a promise on a page.",
  },
  {
    t: "You own everything from day one.",
    d: "Accounts, code, list, creative. All in your name from week one. If we ever part ways, you keep a working system, not a pile of things to rebuild.",
  },
  {
    t: "No twelve-month lock-in.",
    d: "The build is a one-time engagement. No retainer trap, no cancellation penalty, no clawback on work already delivered.",
  },
];

const objections = [
  {
    q: "“Can't I just do this myself with the playbook?”",
    a: "You can, and some people should. But the playbook is the map, not the miles. If your time is better spent running the business you already have than spending a year becoming a growth marketer, that's what this is for.",
  },
  {
    q: "“What if it doesn't work for my business?”",
    a: "That's why the build is scoped in stages and why you own everything as we go. If a stage doesn't ship, you don't pay for it. And because we start by finding your single biggest leak, we build against the constraint that's actually costing you money.",
  },
  {
    q: "“Why a one-time price and not a retainer?”",
    a: "Because you should own your growth system, not rent it from us forever. We build it and hand you the keys. If you want ongoing optimisation later, that's your choice, not a condition of getting started.",
  },
];

export default function OfferPage() {
  const P = price();

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="pb-16 pt-[112px] md:pb-24 md:pt-[152px]">
        <div className="shell max-w-3xl text-center">
          <p className="eyebrow">The {OFFER_LABEL} · One-time {P}</p>
          <h1 className="h-display mt-5 text-[2.5rem] sm:text-[3.4rem] md:text-[3.9rem]">
            Your growth system, built for you.{" "}
            <span className="hl">In weeks, not years.</span>
          </h1>
          <p className="lede mx-auto mt-6 max-w-xl">
            Knowing what a working funnel needs and having the time, the team
            and the scars to install it correctly are two very different
            things. You can learn it the slow way, or we can build it with you,
            starting this week.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <PayButton className="btn-primary btn-lg w-full sm:w-auto" />
            <p className="text-[0.86rem] text-mute">
              One-time payment · Secure Paystack checkout · Ship-It Guarantee
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── THE REAL PROBLEM ─────────────────────── */}
      <section className="section bg-mist">
        <div className="shell max-w-3xl">
          <p className="eyebrow">What usually happens next</p>
          <h2 className="h-section mt-5">
            Most people who read a guide do nothing with it.
          </h2>
          <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-body">
            <p>
              Not because they&apos;re lazy. Because they&apos;re already
              running a business. The offer rewrite, the funnel build, the
              traffic testing, the follow-up, the tracking: each one is a
              project, and you&apos;d be attempting all of them at once, for
              the first time, with nobody to tell you which order to do them in.
            </p>
            <p>
              So the playbook becomes another PDF in a folder. Six months later
              nothing has changed, except now you also feel guilty about it.
            </p>
            <p className="border-l-[3px] border-green pl-5 font-display text-[1.3rem] font-semibold leading-snug tracking-tighter2 text-ink">
              The bottleneck was never information. It was implementation, and
              implementation is exactly the thing you can hand to someone else.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── WHAT YOU GET ─────────────────────── */}
      <section className="section">
        <div className="shell max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">What we build</p>
            <h2 className="h-section mt-5">
              We install the whole system. You approve it and watch it run.
            </h2>
            <p className="lede mt-5">
              This isn&apos;t advice, a course, or a call where we tell you
              what to do. We build it inside your business, launch it, and tune
              it against cost per customer.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((f, i) => (
              <li key={f.t} className="card p-7">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-[0.9rem] font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-[1.2rem] font-extrabold leading-tight tracking-tighter2 text-ink">
                  {f.t}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-body">{f.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────────── COMPARISON ─────────────────────── */}
      <section className="section bg-mist">
        <div className="shell max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How this compares</p>
            <h2 className="h-section mt-5">
              Four ways to fix your customer acquisition.
            </h2>
            <p className="lede mt-5">
              You have options. Here&apos;s the honest trade-off on each.
            </p>
          </div>

          <div className="relative mt-12 overflow-x-auto rounded-slab border border-line bg-paper" tabIndex={0} role="region" aria-label="Comparison table">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-[28%] p-5" />
                  {["Do it yourself", "A freelancer", "A typical agency"].map((h) => (
                    <th key={h} scope="col" className="p-5 font-display text-[1rem] font-extrabold tracking-tighter2 text-mute">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="bg-ink p-5 font-display text-[1rem] font-extrabold tracking-tighter2 text-white">
                    Synergox
                  </th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <th scope="row" className="p-5 text-[0.92rem] font-semibold leading-snug text-ink">
                      {row.label}
                    </th>
                    {(["diy", "free", "agency"] as const).map((col) => (
                      <td key={col} className="p-5 text-[0.9rem] text-body">
                        {row[col] === "no" ? (
                          <>
                            <Cross className="text-mute" />
                            <span className="sr-only">No</span>
                          </>
                        ) : row[col] === "yes" ? (
                          <>
                            <Check className="text-ink" />
                            <span className="sr-only">Yes</span>
                          </>
                        ) : (
                          row[col]
                        )}
                      </td>
                    ))}
                    <td className="bg-ink p-5 text-[0.9rem] font-medium text-white">
                      {row.syx === true ? (
                        <>
                          <Check className="text-green" />
                          <span className="sr-only">Yes</span>
                        </>
                      ) : (
                        row.syx
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-[0.84rem] text-mute">
            A general comparison of typical arrangements, not a claim about any
            specific provider.
          </p>
        </div>
      </section>

      {/* ─────────────────────── FIT ─────────────────────── */}
      <section className="section">
        <div className="shell max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Let&apos;s make sure this fits</p>
            <h2 className="h-section mt-5">This isn&apos;t for everyone. On purpose.</h2>
            <p className="lede mt-5">
              We&apos;d rather turn you away now than take money for something
              that won&apos;t work for you.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-slab border-2 border-ink p-8">
              <p className="eyebrow !text-greenDeep">This is for you if</p>
              <ul className="mt-6 space-y-4">
                {forYou.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-ink">
                    <Tick className="mt-1" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-slab border border-line bg-mist p-8">
              <p className="eyebrow">This is not for you if</p>
              <ul className="mt-6 space-y-4">
                {notForYou.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-body">
                    <Cross className="mt-1.5 text-mute" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── PRICE ─────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="slab-dark on-dark px-6 py-16 sm:px-10 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">What it replaces</p>
              <h2 className="h-section mt-5">Priced against the alternatives.</h2>
              <p className="lede mt-5">
                A full-time growth marketer in Lagos typically runs ₦4–8M a
                year before they produce a thing. A senior agency retainer
                often starts around ₦1.5M a month. Learning it yourself costs
                something worse than money: the time you don&apos;t get back.
              </p>
              <p className="mt-4 text-[0.84rem] leading-relaxed text-ash">
                Salary and retainer figures are typical market ranges, shown
                for comparison. They are not quotes.
              </p>
            </div>

            <div className="rounded-slab bg-paper p-7 text-ink sm:p-9">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-mute">
                Everything included
              </p>
              <ul className="mt-5 space-y-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.98rem] text-ink">
                    <Tick className="mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-line pt-7 text-center">
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-mute">
                  One-time price
                </p>
                <p className="num mt-2 font-display text-[3rem] font-extrabold leading-none tracking-tightest text-ink md:text-[3.5rem]">
                  {P}
                </p>
                <p className="mt-3 text-[0.92rem] text-body">Not a monthly retainer.</p>
                <div className="mt-6">
                  <PayButton className="btn-primary btn-lg w-full" />
                </div>
                <p className="mt-3 text-[0.82rem] text-mute">
                  Secure Paystack checkout · Card, transfer or USSD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── RISK REVERSAL ─────────────────────── */}
      <section className="section bg-mist">
        <div className="shell max-w-5xl">
          <div className="max-w-2xl">
            <p className="eyebrow">The risk is on us</p>
            <h2 className="h-section mt-5">You don&apos;t take the leap. We do.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {reversals.map((c) => (
              <div key={c.t} className="card p-7">
                <Tick />
                <h3 className="mt-4 font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                  {c.t}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PROOF ─────────────────────── */}
      <OfferProof />

      {/* ─────────────────────── OBJECTIONS ─────────────────────── */}
      <section className="section bg-mist">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Before you decide</p>
          <h2 className="h-section mt-5">The three things you&apos;re thinking right now.</h2>
          <div className="mt-10 space-y-4">
            {objections.map((o) => (
              <div key={o.q} className="card p-7">
                <h3 className="font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                  {o.q}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body">{o.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── FINAL CLOSE ─────────────────────── */}
      <section className="section">
        <div className="shell max-w-3xl text-center">
          <h2 className="h-display text-[2.2rem] md:text-[3rem]">
            A year from now, the system will either be built or it won&apos;t.
          </h2>
          <p className="lede mx-auto mt-6 max-w-xl">
            The only question is whether you spent that year building it alone,
            or whether it was already running while you ran your business.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <PayButton className="btn-primary btn-lg w-full sm:w-auto" />
            <p className="text-[0.86rem] text-mute">
              One-time {P} · Ship-It Guarantee · You own it all
            </p>
            <p className="mt-1 max-w-md text-[0.86rem] text-mute">
              We take on a limited number of builds each month, so every one
              gets our full attention.
            </p>
          </div>
          <p className="mt-10 text-[0.95rem] text-body">
            Not ready to commit?{" "}
            <Link href={BOOKING_PAGE} className="link">
              Book a free teardown call first
            </Link>{" "}
            and we&apos;ll map your leak before you decide.
          </p>
        </div>
      </section>
    </>
  );
}
