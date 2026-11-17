import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadFunnel } from "@/lib/funnel/get";
import type { Funnel } from "@/lib/funnel/types";
import { formatMoney, percentOff } from "@/lib/money";
import { BOOKING_PAGE, SALES_PAGE } from "@/lib/site";
import { Arrow, Included } from "@/components/Icons";
import CheckoutForm from "@/components/funnel/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

/**
 * Checkout for one package, or for the Growth Suite.
 * Prices are read fresh from the database on every visit (never from cache,
 * never from the link), and again by the server when the order is created.
 */
export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { offer?: string; src?: string };
}) {
  let funnel: Funnel | null = null;
  try {
    funnel = await loadFunnel();
  } catch {
    funnel = null;
  }

  if (!funnel) {
    return (
      <section className="pb-24 pt-[130px] md:pt-[170px]">
        <div className="shell max-w-2xl">
          <p className="eyebrow">Checkout</p>
          <h1 className="h-display mt-5 text-[2.4rem] sm:text-[3.2rem]">
            Checkout is <span className="accent accent-green">unavailable right now.</span>
          </h1>
          <p className="lede mt-5">
            We couldn&apos;t load current prices, so we won&apos;t take a payment. Nothing has been charged. Please try
            again in a few minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/checkout/${params.slug}`} className="btn-dark">Try again</Link>
            <Link href={SALES_PAGE} className="btn-outline">Back to the packages</Link>
          </div>
        </div>
      </section>
    );
  }

  const { currency } = funnel;
  const bundle = funnel.bundle?.valid ? funnel.bundle : null;
  const isBundle = !!bundle && params.slug === bundle.slug;
  const pkg = isBundle ? null : funnel.packages.find((p) => p.slug === params.slug && p.checkout_enabled);
  if (!isBundle && !pkg) notFound();

  const exit = funnel.exit;
  const viaExit = isBundle && searchParams.offer === "exit" && !!exit?.enabled;
  const offer = viaExit ? "exit_popup" : searchParams.src === "email" ? "email" : "sales_page";

  const name = isBundle ? bundle!.name : pkg!.name;
  const amount = isBundle ? (viaExit ? exit!.price_minor : bundle!.price_minor) : pkg!.price_minor;
  const list = isBundle ? bundle!.total_minor : pkg!.price_minor;
  const saving = Math.max(list - amount, 0);
  const items = isBundle
    ? bundle!.packages
    : [{ id: pkg!.id, slug: pkg!.slug, name: pkg!.name, price_minor: pkg!.price_minor, deliverables: pkg!.deliverables, delivery_time: pkg!.delivery_time }];
  const scope = isBundle ? bundle!.scope : pkg!.scope;
  const upsell = !isBundle && bundle && bundle.package_ids.includes(pkg!.id) ? bundle : null;

  return (
    <section className="pb-20 pt-[96px] md:pb-28 md:pt-[124px]">
      <div className="shell">
        <Link href={`${SALES_PAGE}#packages`} className="inline-flex items-center gap-2 text-[0.88rem] text-mute transition-colors hover:text-ink">
          <Arrow className="rotate-180" /> Back to the packages
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
          {/* ── details ── */}
          <div>
            <p className="eyebrow">Secure checkout · Step 1 of 2</p>
            <h1 className="h-display mt-4 text-[2.3rem] sm:text-[3.1rem]">
              Your details, <span className="accent accent-green">then payment.</span>
            </h1>
            <p className="lede mt-4 max-w-lg">
              Three fields. The questions about your business come after you&apos;ve paid, in a short project brief.
            </p>
            <div className="mt-8 max-w-lg">
              <CheckoutForm slug={params.slug} offer={offer} amountMinor={amount} currency={currency} />
            </div>
          </div>

          {/* ── order summary ── */}
          <aside aria-labelledby="summary-h" className="lg:sticky lg:top-24 lg:self-start">
            <div className="is-in border border-ink bg-paper">
              <div className="flex items-center justify-between border-b border-ink/15 bg-mist px-6 py-3.5">
                <h2 id="summary-h" className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink">
                  Order summary
                </h2>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-mute">
                  {isBundle ? "Complete bundle" : "Single package"}
                </span>
              </div>

              <div className="px-6 pb-6 pt-5">
                <p className="font-display text-[1.7rem] font-extrabold uppercase leading-[0.95] text-ink" style={{ fontStretch: "80%" }}>
                  {name}
                </p>

                <div className="mt-5 space-y-5">
                  {items.map((it) => (
                    <div key={it.slug}>
                      {isBundle && (
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-[0.95rem] font-semibold text-ink">{it.name}</p>
                          <p className="num font-mono text-[0.9rem] text-mute">{formatMoney(it.price_minor, currency)}</p>
                        </div>
                      )}
                      <ul className={`space-y-1.5 ${isBundle ? "mt-2" : ""}`}>
                        {it.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-body">
                            <Included className="!mt-[2px] !h-4 !w-4" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {isBundle && bundle!.extras.length > 0 && (
                    <div>
                      <p className="text-[0.95rem] font-semibold text-ink">Only in the Suite</p>
                      <ul className="mt-2 space-y-1.5">
                        {bundle!.extras.map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-body">
                            <Included className="!mt-[2px] !h-4 !w-4" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <dl className="mt-6 border-t-2 border-ink">
                  {saving > 0 && (
                    <>
                      <div className="ledger-row">
                        <dt className="ledger-label">Total individual value</dt>
                        <dd className="strike ledger-figure !text-mute">{formatMoney(list, currency)}</dd>
                      </div>
                      <div className="ledger-row">
                        <dt className="ledger-label !text-greenDeep">
                          {viaExit && exit!.is_special ? "Exit offer saving" : "Bundle saving"} ({percentOff(list, amount)}%)
                        </dt>
                        <dd className="ledger-figure !text-greenDeep">− {formatMoney(saving, currency)}</dd>
                      </div>
                    </>
                  )}
                  <div className="flex items-end justify-between gap-4 border-t border-dashed border-ink/15 pt-4">
                    <dt className="pb-1 font-mono text-[0.74rem] uppercase tracking-[0.1em] text-ink">
                      Total today
                      <span className="block normal-case tracking-normal text-mute">One-time payment</span>
                    </dt>
                    <dd className="num font-mono text-[2.2rem] font-medium leading-none tracking-tight text-ink">
                      {formatMoney(amount, currency)}
                    </dd>
                  </div>
                </dl>

                {scope.length > 0 && (
                  <details className="group/d mt-6 border-t border-ink/15 pt-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.9rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      Scope and delivery terms
                      <span aria-hidden className="relative h-3 w-3 shrink-0">
                        <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink" />
                        <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink transition-transform duration-300 group-open/d:scale-y-0" />
                      </span>
                    </summary>
                    <ul className="mt-3 space-y-2 text-[0.86rem] leading-relaxed text-body">
                      {scope.map((s) => (
                        <li key={s} className="flex gap-2.5">
                          <span aria-hidden className="mt-[0.62em] h-[2px] w-2.5 shrink-0 bg-ink/40" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>

            {/* A quiet alternative, never a blocker: the whole system for less than the parts. */}
            {upsell && (
              <div className="mt-4 border border-dashed border-ink/30 p-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-greenDeep">Before you pay</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
                  {name} is one of {upsell.packages.length} packages in{" "}
                  <strong className="font-semibold text-ink">{upsell.name}</strong>. All {upsell.packages.length} together are{" "}
                  <strong className="font-semibold text-ink">{formatMoney(upsell.price_minor, currency)}</strong> instead of{" "}
                  {formatMoney(upsell.total_minor, currency)}.
                </p>
                <Link href={`/checkout/${upsell.slug}`} className="link mt-3 inline-flex items-center gap-2 text-[0.92rem]">
                  Switch to the complete Suite <Arrow />
                </Link>
              </div>
            )}

            <p className="mt-5 text-[0.86rem] leading-relaxed text-mute">
              Not sure this is the right package?{" "}
              <Link href={BOOKING_PAGE} className="underline underline-offset-2 hover:text-ink">Book a free call first</Link>.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
