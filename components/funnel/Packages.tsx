import Link from "next/link";
import { BOOKING_PAGE } from "@/lib/site";
import { formatMoney } from "@/lib/money";
import type { Package } from "@/lib/funnel/types";
import { Arrow, Included } from "@/components/Icons";
import { Stagger, StaggerItem } from "@/components/Primitives";
import BuyLink from "./BuyLink";

/**
 * The individual packages. Each is a complete offer with its own price and
 * its own checkout: none of them depends on, or is hidden by, the bundle.
 */
export default function Packages({ packages, currency }: { packages: Package[]; currency: string }) {
  const cols = packages.length >= 3 ? "lg:grid-cols-3" : packages.length === 2 ? "lg:grid-cols-2" : "";
  return (
    <Stagger className={`mt-12 grid gap-5 ${cols}`}>
      {packages.map((p, i) => (
        <StaggerItem key={p.id} className="flex">
          <article
            id={`plan-${p.slug}`}
            aria-labelledby={`plan-${p.slug}-h`}
            className="card-accent group flex w-full scroll-mt-28 flex-col border border-ink/15 bg-paper transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ink hover:shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-ink/15 px-6 py-3.5 sm:px-7">
              <span className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink">
                Plan {String(i + 1).padStart(2, "0")}
              </span>
              {p.delivery_time && (
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-mute">
                  Delivered in {p.delivery_time}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col px-6 pb-7 pt-6 sm:px-7">
              <h3
                id={`plan-${p.slug}-h`}
                className="font-display text-[1.9rem] font-extrabold uppercase leading-[0.95] text-ink"
                style={{ fontStretch: "78%", letterSpacing: "-0.01em" }}
              >
                {p.name}
              </h3>
              {p.audience && <p className="mt-3 text-[0.95rem] font-medium leading-snug text-ink">{p.audience}</p>}
              {p.description && <p className="mt-3 text-[0.94rem] leading-relaxed text-body">{p.description}</p>}

              <div className="mt-6 flex items-end justify-between gap-3 border-y border-ink/15 py-4">
                <p className="num font-mono text-[1.9rem] font-medium leading-none tracking-tight text-ink">
                  {formatMoney(p.price_minor, currency)}
                </p>
                <p className="pb-0.5 text-right font-mono text-[0.66rem] uppercase leading-snug tracking-[0.12em] text-mute">
                  One-time
                  <br />
                  payment
                </p>
              </div>

              <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mute">What you get</p>
              <ul className="mt-3 space-y-2.5">
                {p.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[0.95rem] leading-snug text-ink">
                    <Included />
                    {d}
                  </li>
                ))}
              </ul>

              {p.scope.length > 0 && (
                <details className="group/d mt-6 border-t border-ink/15 pt-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.9rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    Scope and delivery terms
                    <span aria-hidden className="relative h-3 w-3 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink" />
                      <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink transition-transform duration-300 group-open/d:scale-y-0" />
                    </span>
                  </summary>
                  <ul className="mt-3 space-y-2 text-[0.88rem] leading-relaxed text-body">
                    {p.scope.map((s) => (
                      <li key={s} className="flex gap-2.5">
                        <span aria-hidden className="mt-[0.62em] h-[2px] w-2.5 shrink-0 bg-ink/40" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="mt-auto pt-7">
                {p.checkout_enabled ? (
                  <BuyLink slug={p.slug} kind="package" placement="package_card" className="btn-dark w-full justify-between">
                    <span className="text-left">Get {p.name}</span>
                    <Arrow />
                  </BuyLink>
                ) : (
                  <Link href={BOOKING_PAGE} className="btn-outline w-full justify-between">
                    <span className="text-left">Talk to us about this</span>
                    <Arrow />
                  </Link>
                )}
              </div>
            </div>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
