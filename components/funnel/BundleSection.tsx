import { formatMoney, percentOff } from "@/lib/money";
import type { Bundle } from "@/lib/funnel/types";
import Eyebrow from "@/components/Eyebrow";
import { ArrowTile, Included, Lock } from "@/components/Icons";
import { InView, Reveal } from "@/components/Primitives";
import BuyLink from "./BuyLink";
import CountUp from "./CountUp";

/**
 * The Complete Growth Suite.
 *
 * Every figure here is worked out from the packages as they are priced right
 * now: the total is their sum, the saving is that total minus the bundle
 * price. This component is only rendered for a bundle the database has
 * marked valid, i.e. one that genuinely costs less than its parts.
 */
export default function BundleSection({ bundle, currency }: { bundle: Bundle; currency: string }) {
  const pct = percentOff(bundle.total_minor, bundle.price_minor);
  const share = Math.max(8, Math.round((bundle.price_minor / bundle.total_minor) * 100));

  return (
    <section id="suite" className="scroll-mt-20 pb-20 md:pb-28" aria-labelledby="suite-h">
      <div className="slab-dark on-dark relative overflow-hidden px-5 py-16 sm:px-10 md:py-24">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div aria-hidden className="absolute -right-40 -top-40 h-[520px] w-[520px] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(0,197,81,0.28),transparent)] blur-2xl" />

        <div className="relative mx-auto max-w-shell">
          <div className="max-w-4xl">
            <Reveal>
              <Eyebrow>Best overall value · One payment</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="suite-h" className="h-display mt-6 text-[2.6rem] sm:text-[3.9rem] lg:text-[4.9rem]">
                {bundle.name}
              </h2>
            </Reveal>
            {bundle.headline && (
              <Reveal delay={0.1}>
                <p className="accent mt-6 max-w-3xl text-[1.6rem] leading-[1.15] text-green sm:text-[2rem]">{bundle.headline}</p>
              </Reveal>
            )}
            {bundle.description && (
              <Reveal delay={0.15}>
                <p className="lede mt-6 max-w-2xl">{bundle.description}</p>
              </Reveal>
            )}
          </div>

          {/* ── Option A / Option B ── */}
          <InView className="mt-12 grid items-stretch gap-5 lg:mt-16 lg:grid-cols-[0.92fr_1.08fr]">
            {/* A: separately */}
            <div className="flex flex-col border border-white/15 p-6 sm:p-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ash">Option A</p>
              <h3 className="mt-2 font-display text-[1.5rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "82%" }}>
                Purchase each package separately
              </h3>
              <div className="mt-6">
                {bundle.packages.map((p) => (
                  <div key={p.id} className="ledger-row">
                    <span className="text-[0.95rem] text-ash">{p.name}</span>
                    <span className="ledger-figure">{formatMoney(p.price_minor, currency)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <div className="flex items-baseline justify-between gap-4 border-t-2 border-white/40 pt-4">
                  <span className="ledger-label">Total individual value</span>
                  <span className="strike num font-mono text-[1.5rem] font-medium text-ash">
                    {formatMoney(bundle.total_minor, currency)}
                  </span>
                </div>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-ash">
                  {bundle.packages.length} separate payments, {bundle.packages.length} separate projects.
                </p>
              </div>
            </div>

            {/* B: the suite */}
            <div className="relative flex flex-col bg-paper p-6 text-ink shadow-[0_40px_80px_-40px_rgba(0,197,81,0.55)] sm:p-8">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-green" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-greenDeep">Option B</p>
                  <h3 className="mt-2 font-display text-[1.5rem] font-extrabold uppercase leading-none text-ink" style={{ fontStretch: "82%" }}>
                    The entire Growth Suite, one payment
                  </h3>
                </div>
                {pct > 0 && (
                  <span className="shrink-0 bg-ink px-2.5 py-2 font-mono text-[0.72rem] font-medium uppercase leading-none tracking-[0.08em] text-green">
                    Save {pct}%
                  </span>
                )}
              </div>

              <dl className="mt-6">
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/20 py-3">
                  <dt className="font-mono text-[0.74rem] uppercase tracking-[0.1em] text-mute">Total individual value</dt>
                  <dd className="strike num font-mono text-[1rem] font-medium text-mute">{formatMoney(bundle.total_minor, currency)}</dd>
                </div>
                <div className="flex items-end justify-between gap-4 border-b border-dashed border-ink/20 py-4">
                  <dt className="pb-1.5 font-mono text-[0.74rem] uppercase tracking-[0.1em] text-ink">Complete bundle price</dt>
                  <dd className="num font-mono text-[2.5rem] font-medium leading-none tracking-tight text-ink sm:text-[3.1rem]">
                    {formatMoney(bundle.price_minor, currency)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/20 py-3">
                  <dt className="font-mono text-[0.74rem] uppercase tracking-[0.1em] text-greenDeep">Savings</dt>
                  <dd className="font-mono text-[1.25rem] font-medium text-greenDeep">
                    <CountUp minor={bundle.savings_minor} currency={currency} delay={0.3} />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="font-mono text-[0.74rem] uppercase tracking-[0.1em] text-mute">Payment</dt>
                  <dd className="font-mono text-[0.86rem] font-medium uppercase tracking-[0.06em] text-ink">One-time payment</dd>
                </div>
              </dl>

              {/* the same comparison, drawn to scale */}
              <div className="mt-3 space-y-2" aria-hidden>
                <div className="flex items-center gap-3">
                  <span className="w-20 shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-mute">Separately</span>
                  <span className="h-2.5 flex-1 bg-mist">
                    <span className="block h-full w-full origin-left scale-x-0 bg-ink/25 transition-transform duration-1000 ease-out [.is-in_&]:scale-x-100" />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-20 shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink">The Suite</span>
                  <span className="h-2.5 flex-1 bg-mist">
                    <span
                      className="block h-full origin-left scale-x-0 bg-green transition-transform delay-200 duration-1000 ease-out [.is-in_&]:scale-x-100"
                      style={{ width: `${share}%` }}
                    />
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-7">
                <BuyLink slug={bundle.slug} kind="bundle" placement="suite_section" className="btn-primary btn-lg w-full justify-between">
                  <span className="text-left">Get the complete Growth Suite</span>
                  <ArrowTile />
                </BuyLink>
                <p className="mt-3.5 flex items-center justify-center gap-2 text-[0.8rem] text-mute">
                  <Lock />
                  Secure checkout by Paystack. Receipt sent by email.
                </p>
              </div>
            </div>
          </InView>

          {/* ── Everything included ── */}
          <div className="mt-14 lg:mt-20">
            <Reveal>
              <p className="eyebrow">Everything in the Suite</p>
            </Reveal>
            <div className="mt-6 grid gap-x-10 gap-y-10 border-t border-white/15 pt-8 md:grid-cols-2 lg:grid-cols-4">
              {bundle.packages.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-green">Plan {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display text-[1.25rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "82%" }}>
                    {p.name}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {p.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-ash">
                        <Included className="!h-4 !w-4" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              {bundle.extras.length > 0 && (
                <Reveal delay={bundle.packages.length * 0.05}>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-green">Only in the Suite</p>
                  <h3 className="mt-2 font-display text-[1.25rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "82%" }}>
                    Working as one
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {bundle.extras.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-ash">
                        <Included className="!h-4 !w-4" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            {bundle.scope.length > 0 && (
              <details className="group/d mt-10 border-y border-white/15 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.95rem] font-semibold text-white [&::-webkit-details-marker]:hidden">
                  What the Suite covers, and what it doesn't
                  <span aria-hidden className="relative h-3 w-3 shrink-0">
                    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white" />
                    <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white transition-transform duration-300 group-open/d:scale-y-0" />
                  </span>
                </summary>
                <ul className="mt-4 grid gap-x-10 gap-y-2.5 text-[0.92rem] leading-relaxed text-ash md:grid-cols-2">
                  {bundle.scope.map((s) => (
                    <li key={s} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.62em] h-[2px] w-2.5 shrink-0 bg-green" />
                      {s}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
