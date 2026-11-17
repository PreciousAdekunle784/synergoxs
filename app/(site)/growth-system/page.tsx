import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content/get";
import { getFunnel, sellableBundle } from "@/lib/funnel/get";
import { formatMoney } from "@/lib/money";
import { BOOKING_PAGE, CALL_MINUTES, SITE_URL } from "@/lib/site";
import Eyebrow from "@/components/Eyebrow";
import { Arrow, ArrowTile } from "@/components/Icons";
import { Reveal, SectionHead, Stagger, StaggerItem } from "@/components/Primitives";
import SystemVisual from "@/components/funnel/SystemVisual";
import Method from "@/components/funnel/Method";
import Packages from "@/components/funnel/Packages";
import BundleSection from "@/components/funnel/BundleSection";
import ExitIntent from "@/components/funnel/ExitIntent";
import WelcomeBar from "@/components/funnel/WelcomeBar";
import StickyBar from "@/components/funnel/StickyBar";
import Faq, { type FaqItem } from "@/components/funnel/Faq";

/** Re-checked at most every five minutes, and immediately when the dashboard saves a change. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "The SYNERGOX Growth System — websites, ads and conversion optimization" },
  description:
    "Connect your website, customer acquisition and conversion optimization into one growth system. Fixed-scope packages, one-time prices, or the full Growth Suite.",
  alternates: { canonical: "/growth-system" },
};

const problems = [
  {
    t: "You're paying for traffic that doesn't convert.",
    d: "The ad platform reports clicks every week. Your bank account can't find them. Each visitor who looks and leaves is money that was spent twice: once to bring them, and again to bring their replacement.",
  },
  {
    t: "Your website doesn't generate enquiries.",
    d: "It looks professional. People say nice things about it. It describes the company well, and it has never once asked a visitor to do anything in particular.",
  },
  {
    t: "The people who do get in touch are the wrong ones.",
    d: "Price-shoppers, tyre-kickers, businesses you can't help. The customers you actually want aren't seeing you, or aren't seeing a reason to choose you.",
  },
  {
    t: "Leads go cold because nobody follows up.",
    d: "Someone asked a question on Tuesday and got one reply. They were interested. They've now bought from whoever messaged them twice.",
  },
  {
    t: "Every part of your marketing is run by someone different.",
    d: "A designer built the site. A freelancer runs the ads. Somebody's cousin posts on social. None of them has ever been in the same conversation, and it shows.",
  },
  {
    t: "You're advertising without anything to catch the demand.",
    d: "Budget is going out to send people to a page that was never built to convert them, with no tracking to tell you what happened next.",
  },
];

const afterSteps = [
  { t: "Pay securely", d: "Checkout runs on Paystack. You'll have a receipt in your inbox the moment the payment is confirmed." },
  { t: "Send your brief", d: "A short form about your business, goals and what you already have. About five minutes." },
  { t: "Kickoff confirmed", d: "We review your brief and confirm your start by email within two working days." },
  { t: "Delivery, on dated reviews", d: "One point of contact, agreed review dates, and everything built in accounts you own." },
];

export default async function SalesPage() {
  const [{ copy, contact, projects, testimonials }, funnel] = await Promise.all([getContent(), getFunnel()]);
  const { currency, packages } = funnel;
  const bundle = sellableBundle(funnel);
  const buyable = packages.filter((p) => p.checkout_enabled);
  const from = buyable.length ? Math.min(...buyable.map((p) => p.price_minor)) : null;
  const project = projects[0] ?? null;
  const quote = testimonials[0] ?? null;

  const priceList = buyable.map((p) => `${p.name} is ${formatMoney(p.price_minor, currency)}`).join("; ");
  const times = packages.filter((p) => p.delivery_time).map((p) => `${p.name} takes ${p.delivery_time}`).join("; ");

  const faqs: FaqItem[] = [
    {
      q: "Which package should I start with?",
      a: `Start where customers are being lost. No website, or one you wouldn't send a prospect to: the foundation. A decent site that too few of the right people see: acquisition. Traffic and enquiries, but too few of them buy: conversion optimization.${
        bundle ? ` If you recognise more than one of those, the ${bundle.name.replace(/^The /, "")} covers all of it in a single payment for less than buying the packages one by one.` : ""
      } Still unsure? Book a free ${CALL_MINUTES}-minute call and we'll tell you which we'd fix first.`,
    },
    ...(buyable.length
      ? [
          {
            q: "What does it cost, and is it really a one-time payment?",
            a: `Yes. ${priceList}.${
              bundle
                ? ` Bought separately those come to ${formatMoney(bundle.total_minor, currency)}; the complete Suite is ${formatMoney(bundle.price_minor, currency)}, which saves you ${formatMoney(bundle.savings_minor, currency)}.`
                : ""
            } Each price covers the scope listed on the package. There is no retainer and no subscription attached to any of them.`,
          },
        ]
      : []),
    {
      q: "Is advertising spend included?",
      a: "No. If your package includes campaigns, the media budget goes from you directly to Meta and Google. It is never part of our fee and we never hold it. The ad accounts are opened in your name, so you can see every naira spent and you keep the accounts whatever happens.",
    },
    ...(times
      ? [
          {
            q: "How long does it take?",
            a: `${times}.${
              bundle ? " The complete Suite is delivered in sequence, so each part is ready for the next." : ""
            } Timelines start when we have your project brief and content, and assume feedback comes back within a few days: the most common cause of a late project is a review that sits.`,
          },
        ]
      : []),
    {
      q: "How much of my time will this need?",
      a: "A five-minute brief after you pay, a kickoff conversation, and reviews at agreed points. We write, design, build and set up. You approve, and answer the questions only you can answer.",
    },
    {
      q: "Can you guarantee results?",
      a: "Not a revenue figure, and be wary of anyone who does: they don't control your pricing, your delivery or your market. What we guarantee is scope. Every deliverable listed on your package is delivered. If we fail to deliver an item, you are refunded for it.",
    },
    {
      q: "Who owns the work when it's finished?",
      a: "You do. The website, the pages, the ad accounts, the tracking and the creative are in your name from the first day. If we never work together again, nothing has to be rebuilt and no access has to be asked for.",
    },
    {
      q: "Is the payment secure?",
      a: "Payment is taken on Paystack's own checkout page, not on our site, so we never see or store your card details. We confirm every payment directly with Paystack before an order is marked paid, and you receive a receipt by email.",
    },
    {
      q: "Can I talk to someone before I buy?",
      a: `Yes. Book a free ${CALL_MINUTES}-minute call. We'll look at your numbers with you and tell you which part of your system is costing you the most. You keep the findings whether or not you buy anything. You can also write to ${contact.email}.`,
    },
  ];

  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "SYNERGOX growth packages",
    url: `${SITE_URL}/growth-system`,
    itemListElement: [
      ...buyable.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.description ?? undefined,
        price: (p.price_minor / 100).toFixed(2),
        priceCurrency: currency,
        url: `${SITE_URL}/checkout/${p.slug}`,
      })),
      ...(bundle
        ? [
            {
              "@type": "Offer",
              name: bundle.name,
              description: bundle.description ?? undefined,
              price: (bundle.price_minor / 100).toFixed(2),
              priceCurrency: currency,
              url: `${SITE_URL}/checkout/${bundle.slug}`,
            },
          ]
        : []),
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      {buyable.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema).replace(/</g, "\\u003c") }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <WelcomeBar />

      {/* ── 1. Hero ── */}
      <section className="sales-hero relative overflow-hidden pb-16 pt-[104px] md:pb-24 md:pt-[132px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[75%] bg-gradient-to-b from-mist to-paper" />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10">
          <div>
            <div className="animate-rise">
              <Eyebrow>{copy["sales.eyebrow"]}</Eyebrow>
            </div>
            <h1 className="h-display mt-6 text-[2.6rem] sm:text-[3.6rem] lg:text-[3.5rem] xl:text-[4.15rem]">
              <span className="line-mask">
                <span>{copy["sales.headline"]}</span>
              </span>
              <span className="line-mask">
                <span className="accent accent-green [animation-delay:0.12s]">{copy["sales.accent"]}</span>
              </span>
              <span className="line-mask">
                <span className="[animation-delay:0.22s]">{copy["sales.headline2"]}</span>
              </span>
            </h1>
            <p className="lede mt-7 max-w-xl animate-rise [animation-delay:0.35s]">{copy["sales.sub"]}</p>

            <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:0.45s] sm:flex-row sm:items-center">
              <a href="#packages" className="btn-primary btn-lg justify-between sm:whitespace-nowrap">
                {copy["sales.cta"]}
                <ArrowTile />
              </a>
              <a href={bundle ? "#suite" : "#packages"} className="btn-outline btn-lg sm:whitespace-nowrap">
                {copy["sales.cta2"]}
              </a>
            </div>

            {from !== null && (
              <p className="mt-6 animate-rise font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mute [animation-delay:0.55s]">
                Packages from <span className="text-ink">{formatMoney(from, currency)}</span> · One-time payment · No retainer
              </p>
            )}
          </div>

          <div className="lg:-ml-[16%]">
            <SystemVisual />
          </div>
        </div>
      </section>

      {/* ── 2. The problem ── */}
      <section className="section" aria-labelledby="problem-h">
        <div className="shell grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>Sound familiar?</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="problem-h" className="h-section mt-5">
                {copy["problem.title"]} <span className="accent accent-green">{copy["problem.accent"]}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6">{copy["problem.lede"]}</p>
            </Reveal>
          </div>

          <div>
            <Stagger as="ul" className="border-t-2 border-ink">
              {problems.map((p) => (
                <StaggerItem as="li" key={p.t} className="group grid grid-cols-[auto_1fr] gap-x-5 border-b border-ink/15 py-7">
                  <span aria-hidden className="mt-2 flex h-6 w-6 items-center justify-center border border-ink/25 text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-green">
                    <svg width="10" height="10" viewBox="0 0 15 15" fill="none">
                      <path d="M4 4l7 7M11 4l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-[1.4rem] font-extrabold leading-[1.08] text-ink sm:text-[1.65rem]" style={{ fontStretch: "86%", letterSpacing: "-0.015em" }}>
                      {p.t}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-[1rem] leading-relaxed text-body">{p.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <p className="mt-9 border-l-[3px] border-green pl-5 font-serif text-[1.55rem] italic leading-[1.2] text-ink sm:text-[1.85rem]">
                These look like six problems. They are one: the parts of your marketing were never built to work
                together.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. The solution and the method ── */}
      <Method title={copy["method.title"]} accent={copy["method.accent"]} lede={copy["method.lede"]} />

      {/* ── 4. The packages ── */}
      <section id="packages" className="scroll-mt-20 pb-20 md:pb-28" aria-labelledby="packages-h">
        <div className="shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow>Choose your starting point</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 id="packages-h" className="h-section mt-5">
                  {copy["packages.title"]} <span className="accent accent-green">{copy["packages.accent"]}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="lede mt-6 max-w-2xl">{copy["packages.lede"]}</p>
              </Reveal>
            </div>
            {bundle && (
              <Reveal delay={0.15}>
                <a href="#suite" className="group inline-flex items-center gap-2 whitespace-nowrap border-b-2 border-green pb-1 text-[0.95rem] font-semibold text-ink">
                  Need all {bundle.packages.length}? Save {formatMoney(bundle.savings_minor, currency)}
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Reveal>
            )}
          </div>

          {funnel.live && packages.length > 0 ? (
            <Packages packages={packages} currency={currency} />
          ) : (
            <div className="mt-12 border border-ink/15 bg-mist p-8 sm:p-10">
              <p className="font-display text-[1.5rem] font-extrabold uppercase leading-none text-ink" style={{ fontStretch: "84%" }}>
                Package details are being updated.
              </p>
              <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-body">
                Current scope and prices will be back here shortly. In the meantime, book a free call or write to{" "}
                <a href={`mailto:${contact.email}`} className="link">
                  {contact.email}
                </a>{" "}
                and we&apos;ll send them to you.
              </p>
              <Link href={BOOKING_PAGE} className="btn-dark mt-6">
                Book a free call <Arrow />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. The complete Growth Suite ── */}
      {bundle && <BundleSection bundle={bundle} currency={currency} />}

      {/* ── 6. Proof: only real, published work ── */}
      {project && (
        <section className="pb-20 md:pb-28" aria-labelledby="proof-title">
          <div className="shell">
            <SectionHead id="proof-title" eyebrow="Case study" title={copy["results.title"]} accent={copy["results.accent"]} />
            <Reveal delay={0.1}>
              <article className="mt-12 grid border border-ink/15 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col justify-between gap-8 bg-mist p-7 sm:p-10">
                  <div>
                    <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mute">{project.sector}</p>
                    <h3 id="proof-h" className="mt-3 font-display text-[2.2rem] font-extrabold uppercase leading-[0.95] text-ink" style={{ fontStretch: "78%" }}>
                      {project.client}
                    </h3>
                    {project.headline && <p className="mt-5 font-serif text-[1.5rem] italic leading-[1.2] text-ink">{project.headline}</p>}
                  </div>
                  {project.facts.length > 0 && (
                    <ul className="space-y-2 border-t border-ink/15 pt-5">
                      {project.facts.map((f) => (
                        <li key={f} className="flex gap-2.5 text-[0.92rem] text-body">
                          <span aria-hidden className="mt-[0.62em] h-[2px] w-2.5 shrink-0 bg-green" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="divide-y divide-ink/15 p-7 sm:p-10">
                  {[
                    ["The problem", project.problem],
                    ["What we built", project.solution],
                    ["How it turned out", project.outcome],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="py-6 first:pt-0 last:pb-0">
                        <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-greenDeep">{k}</p>
                        <p className="mt-2.5 text-[1rem] leading-relaxed text-body">{v}</p>
                      </div>
                    ))}
                  {quote && (
                    <figure className="py-6 last:pb-0">
                      <blockquote className="font-serif text-[1.4rem] italic leading-[1.25] text-ink">“{quote.quote}”</blockquote>
                      <figcaption className="mt-3 text-[0.88rem] text-mute">
                        {quote.name}
                        {quote.role ? ` · ${quote.role}` : ""}
                      </figcaption>
                    </figure>
                  )}
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── 7. What happens after you buy ── */}
      <section className="bg-mist py-20 md:py-28" aria-labelledby="after-h">
        <div className="shell">
          <SectionHead
            id="after-h"
            eyebrow="After you pay"
            title="You'll know what happens next"
            accent="before you spend anything."
            lede="Buying a service online shouldn't feel like sending money into the dark. This is the whole sequence, from payment to delivery."
          />
          <Stagger as="ol" className="mt-12 grid border-l border-t border-ink/15 bg-paper sm:grid-cols-2 lg:grid-cols-4">
            {afterSteps.map((s, i) => (
              <StaggerItem as="li" key={s.t} className="border-b border-r border-ink/15 p-6 sm:p-8">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-greenDeep">Step {i + 1}</p>
                <h3 className="mt-3 font-display text-[1.35rem] font-extrabold uppercase leading-none text-ink" style={{ fontStretch: "82%" }}>
                  {s.t}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-body">{s.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 8. Questions ── */}
      <section id="faq" className="section scroll-mt-20" aria-labelledby="faq-h">
        <div className="shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>Straight answers</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="faq-h" className="h-section mt-5">
                {copy["faq.title"]} <span className="accent accent-green">{copy["faq.accent"]}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6">
                Something we haven&apos;t covered? Write to{" "}
                <a href={`mailto:${contact.email}`} className="link">
                  {contact.email}
                </a>
                . A person answers.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ── 9. Final call to action ── */}
      <section className="pb-20 md:pb-28" aria-labelledby="final-h">
        <div className="shell">
          <div className="border-y-2 border-ink py-14 text-center md:py-20">
            <Reveal>
              <h2 id="final-h" className="h-display mx-auto max-w-5xl text-[2.4rem] sm:text-[3.5rem] lg:text-[4.4rem]">
                {copy["final.title"]} <span className="accent accent-green">{copy["final.accent"]}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="lede mx-auto mt-6 max-w-2xl">{copy["final.sub"]}</p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <a href="#packages" className="btn-primary btn-lg justify-between">
                  {copy["sales.cta"]}
                  <ArrowTile />
                </a>
                <Link href={BOOKING_PAGE} className="btn-outline btn-lg">
                  Book a free {CALL_MINUTES}-minute call
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {from !== null && <StickyBar label={`From ${formatMoney(from, currency)} · one-time`} />}
      {bundle && funnel.exit && <ExitIntent offer={funnel.exit} bundle={bundle} currency={currency} />}
    </>
  );
}
