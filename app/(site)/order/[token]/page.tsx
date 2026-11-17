import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { rpc } from "@/lib/supabase/rpc";
import { getContent } from "@/lib/content/get";
import { briefFieldsFor } from "@/lib/funnel/brief";
import type { PublicOrder } from "@/lib/funnel/types";
import { formatMoney } from "@/lib/money";
import { SALES_PAGE, SITE_URL } from "@/lib/site";
import { settleOrder } from "@/lib/server/orders";
import { UUID_RE } from "@/lib/server/request";
import { Arrow, Check, Included } from "@/components/Icons";
import OnboardingForm from "@/components/funnel/OnboardingForm";
import { CheckAgain, PurchaseConfirmed } from "@/components/funnel/OrderClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

const when = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(iso)) + " WAT"
    : "—";

function origin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE_URL;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`;
}

/**
 * Where a buyer lands after Paystack, and the private page for their order.
 *
 * Arriving here proves nothing by itself. Unless the order is already
 * recorded as paid, the server asks Paystack what happened to the
 * transaction and shows whichever of these is true:
 *   paid      confirmation, receipt, next steps and the project brief
 *   pending   no payment received (abandoned, or a transfer still on its way)
 *   failed    the payment was declined, with a way to try again
 */
export default async function OrderPage({ params }: { params: { token: string } }) {
  if (!UUID_RE.test(params.token)) notFound();

  const load = async () => (await rpc<PublicOrder | null>("order_public", { p_token: params.token })).data;
  let order = await load();
  if (!order) notFound();

  let note: string | null = null;
  let unavailable = false;
  if (order.status !== "paid") {
    const result = await settleOrder(order.reference, "callback", origin());
    if (result.state === "unavailable") unavailable = true;
    else if (result.state !== "paid") note = result.reason;
    order = (await load()) ?? order;
  }

  const { contact } = await getContent();
  const cur = order.currency;
  const first = order.name.trim().split(/\s+/)[0];

  /* ───────────── Not paid ───────────── */
  if (order.status !== "paid") {
    const failed = order.status === "failed";
    return (
      <section className="pb-24 pt-[120px] md:pb-28 md:pt-[160px]">
        <div className="shell max-w-2xl">
          <p className="eyebrow">Order {order.reference}</p>
          <h1 className="h-display mt-5 text-[2.4rem] sm:text-[3.3rem]">
            {unavailable ? (
              <>We couldn&apos;t <span className="accent accent-green">confirm this yet.</span></>
            ) : failed ? (
              <>The payment <span className="accent accent-green">didn&apos;t go through.</span></>
            ) : (
              <>We haven&apos;t received <span className="accent accent-green">a payment yet.</span></>
            )}
          </h1>

          <div className="lede mt-6 space-y-4">
            {unavailable ? (
              <p>
                Our connection to the payment provider is down, so we can&apos;t check your payment from here right now.
                If you were charged, your money is safe: every payment is matched to its order, and we&apos;ll confirm
                yours by email as soon as it&apos;s verified.
              </p>
            ) : failed ? (
              <p>
                {order.failure_reason ? `Paystack reported: “${order.failure_reason}”. ` : ""}
                Nothing has been confirmed for this order. This is usually a card limit, a declined bank prompt or a
                lost connection, and a second attempt often works.
              </p>
            ) : (
              <p>
                {order.item_name} is reserved under this order, but no payment has reached us. If you closed the payment
                page, nothing was charged and you can pick up where you left off. If you paid by bank transfer, it can
                take a few minutes to arrive.
              </p>
            )}
          </div>

          <dl className="mt-8 border-y-2 border-ink">
            <div className="ledger-row">
              <dt className="ledger-label">Item</dt>
              <dd className="text-right text-[0.95rem] font-semibold text-ink">{order.item_name}</dd>
            </div>
            <div className="ledger-row">
              <dt className="ledger-label">Amount</dt>
              <dd className="ledger-figure">{formatMoney(order.amount_minor, cur)}</dd>
            </div>
            <div className="ledger-row">
              <dt className="ledger-label">Status</dt>
              <dd className="font-mono text-[0.86rem] uppercase tracking-[0.08em] text-ink">
                {unavailable ? "Not yet verified" : failed ? "Not paid" : "Awaiting payment"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/checkout/${order.item_slug}${order.offer_source === "exit_popup" ? "?offer=exit" : ""}`} className="btn-primary">
              {failed ? "Try the payment again" : "Go to payment"} <Arrow />
            </Link>
            <Link href={`/order/${params.token}`} className="btn-outline" prefetch={false}>
              I&apos;ve paid — check again
            </Link>
          </div>
          {!failed && !unavailable && <CheckAgain />}
          {note && !failed && !unavailable && <p className="sr-only">{note}</p>}

          <p className="mt-8 text-[0.92rem] leading-relaxed text-body">
            Charged but still seeing this? Write to{" "}
            <a href={`mailto:${contact.email}?subject=Order ${order.reference}`} className="link">
              {contact.email}
            </a>{" "}
            with the order number above and we&apos;ll sort it out the same day.
          </p>
        </div>
      </section>
    );
  }

  /* ───────────── Paid ───────────── */
  const briefDone = order.onboarding_status !== "awaiting";
  const fields = briefFieldsFor(order.items).map(({ only: _only, ...f }) => f);
  const saving = Math.max(order.list_minor - order.amount_minor, 0);

  const steps = [
    { t: "Payment confirmed", d: `Verified with Paystack on ${when(order.paid_at)}.`, done: true },
    {
      t: "Your project brief",
      d: briefDone ? "Received. Thank you." : "Tell us about your business below. About five minutes.",
      done: briefDone,
    },
    { t: "Kickoff", d: "We review your brief and confirm your start by email within two working days.", done: false },
    { t: "Delivery", d: "One point of contact, agreed review dates, everything built in accounts you own.", done: false },
  ];

  return (
    <>
      <PurchaseConfirmed reference={order.reference} value={order.amount_minor / 100} currency={cur} item={order.item_slug} />

      <section className="relative overflow-hidden pb-14 pt-[110px] md:pt-[150px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-mist to-paper" />
        <div className="shell relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <span className="flex h-12 w-12 animate-rise items-center justify-center bg-green text-ink">
              <Check size={24} />
            </span>
            <p className="eyebrow mt-6 animate-rise [animation-delay:0.05s]">Payment confirmed · Order {order.reference}</p>
            <h1 className="h-display mt-4 animate-rise text-[2.6rem] [animation-delay:0.1s] sm:text-[3.8rem]">
              Thank you, {first}. <span className="accent accent-green">You&apos;re in.</span>
            </h1>
            <p className="lede mt-6 max-w-xl animate-rise [animation-delay:0.2s]">
              Your payment for <strong className="font-semibold text-ink">{order.item_name}</strong> has been verified and
              a receipt is on its way to <span className="font-semibold text-ink [overflow-wrap:anywhere]">{order.email}</span>.
              {briefDone ? " We have your brief, and your kickoff is next." : " One thing left before we can start: your project brief."}
            </p>
            {!briefDone && (
              <a href="#brief" className="btn-primary mt-8 animate-rise [animation-delay:0.3s]">
                Complete your project brief <Arrow />
              </a>
            )}
          </div>

          {/* receipt */}
          <aside className="is-in animate-rise self-start border border-ink bg-paper [animation-delay:0.25s]" aria-label="Receipt">
            <div className="flex items-center justify-between border-b border-ink/15 bg-mist px-6 py-3.5">
              <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink">Receipt</p>
              <p className="bg-ink px-2 py-1 font-mono text-[0.66rem] uppercase leading-none tracking-[0.12em] text-green">Paid</p>
            </div>
            <dl className="px-6 py-3">
              <div className="ledger-row">
                <dt className="ledger-label">Order</dt>
                <dd className="ledger-figure !text-[0.88rem]">{order.reference}</dd>
              </div>
              <div className="ledger-row">
                <dt className="ledger-label">Purchased</dt>
                <dd className="text-right text-[0.95rem] font-semibold text-ink">{order.item_name}</dd>
              </div>
              {saving > 0 && (
                <div className="ledger-row">
                  <dt className="ledger-label">Individual value</dt>
                  <dd className="strike ledger-figure !text-mute">{formatMoney(order.list_minor, cur)}</dd>
                </div>
              )}
              <div className="ledger-row">
                <dt className="ledger-label">Paid, one-time</dt>
                <dd className="num font-mono text-[1.5rem] font-medium text-ink">{formatMoney(order.amount_minor, cur)}</dd>
              </div>
              {saving > 0 && (
                <div className="ledger-row">
                  <dt className="ledger-label !text-greenDeep">You saved</dt>
                  <dd className="ledger-figure !text-greenDeep">{formatMoney(saving, cur)}</dd>
                </div>
              )}
              <div className="ledger-row">
                <dt className="ledger-label">Date</dt>
                <dd className="text-right font-mono text-[0.82rem] text-ink">{when(order.paid_at)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* what happens next */}
      <section className="pb-16" aria-labelledby="next-h">
        <div className="shell">
          <h2 id="next-h" className="eyebrow">What happens next</h2>
          <ol className="mt-5 grid border-l border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className={`border-b border-r border-ink/15 p-6 ${s.done ? "bg-mist" : "bg-paper"}`}>
                <p className="flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mute">
                  {s.done ? <Included className="!mt-0" /> : <span className="flex h-[18px] w-[18px] items-center justify-center border border-ink/30 text-[0.62rem] text-ink">{i + 1}</span>}
                  {s.done ? "Done" : !briefDone && i === 1 ? "Now" : "Next"}
                </p>
                <h3 className="mt-3 font-display text-[1.3rem] font-extrabold uppercase leading-none text-ink" style={{ fontStretch: "82%" }}>
                  {s.t}
                </h3>
                <p className="mt-2.5 text-[0.93rem] leading-relaxed text-body">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* the brief */}
      <section id="brief" className="scroll-mt-24 bg-mist py-16 md:py-24" aria-labelledby="brief-h">
        <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{briefDone ? "Brief received" : "Step 2 of 2 · About five minutes"}</p>
            <h2 id="brief-h" className="h-section mt-5">
              {briefDone ? (
                <>We have your brief. <span className="accent accent-green">Kickoff is next.</span></>
              ) : (
                <>Tell us about <span className="accent accent-green">your business.</span></>
              )}
            </h2>
            <p className="lede mt-5">
              {briefDone
                ? "You'll hear from us by email within two working days to confirm your start. You can still add to or correct your answers below."
                : "This is what lets us start. Rough answers are fine: where something isn't decided yet, say so and we'll work it out together at kickoff."}
            </p>

            <div className="mt-8 border-t border-ink/15 pt-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">You bought</p>
              <ul className="mt-3 space-y-4">
                {order.items.map((it) => (
                  <li key={it.slug}>
                    <p className="text-[0.98rem] font-semibold text-ink">{it.name}</p>
                    <ul className="mt-1.5 space-y-1">
                      {it.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-[0.88rem] leading-snug text-body">
                          <Included className="!mt-[2px] !h-[14px] !w-[14px]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-ink/15 bg-paper p-6 sm:p-9">
            <OnboardingForm token={params.token} fields={fields} saved={order.onboarding} />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="shell flex flex-col gap-4 text-[0.95rem] leading-relaxed text-body sm:flex-row sm:items-center sm:justify-between">
          <p>
            Keep this page: the link in your receipt brings you back to it. Questions? Write to{" "}
            <a href={`mailto:${contact.email}?subject=Order ${order.reference}`} className="link">
              {contact.email}
            </a>
            .
          </p>
          <Link href={SALES_PAGE} className="inline-flex shrink-0 items-center gap-2 font-semibold text-ink underline decoration-green decoration-2 underline-offset-4">
            Back to the Growth System <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
