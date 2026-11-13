"use client";

import Link from "next/link";
import { Reveal, SectionHead, Stagger, StaggerItem, type HeadCopy } from "./Primitives";
import { Arrow } from "./Icons";

/* Outcome first, deliverables second. Each card is a stage of one system. */
const parts = [
  {
    stage: "Acquire",
    t: "Ads that are judged on customers, not clicks",
    d: "Meta and Google campaigns measured on what a customer costs you. Budget moves toward what returns and away from what doesn't.",
    items: ["Campaign structure", "Creative angles", "Budget rules"],
  },
  {
    stage: "Convert",
    t: "Pages that turn visitors into enquiries",
    d: "We sharpen the offer first, then build the page around one action, with the objections that stop the click answered before anyone has to scroll.",
    items: ["Offer rewrite", "Landing pages", "Booking flow"],
  },
  {
    stage: "Follow up",
    t: "Follow-up that closes the “not yet”",
    d: "Email and reminder sequences keep working on the leads who weren't ready today, so your team isn't chasing them by hand.",
    items: ["Email sequences", "Lead routing", "Call reminders"],
  },
  {
    stage: "Measure",
    t: "Numbers you'll actually look at",
    d: "One dashboard showing cost per customer by channel. You know which half of the budget is working before you spend the next one.",
    items: ["GA4 & pixels", "Event tracking", "Live dashboard"],
  },
];

export default function System({ copy }: { copy: HeadCopy }) {
  return (
    <section id="system" className="section bg-mist">
      <div className="shell">
        <SectionHead eyebrow="What we build for you" title={copy.title} accent={copy.accent} lede={copy.lede} />

        <Stagger as="ol" className="mt-12 grid gap-4 md:grid-cols-2">
          {parts.map((p, i) => (
            <StaggerItem as="li" key={p.stage}>
              <div className="group card card-hover card-accent flex h-full flex-col p-7 md:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-[0.9rem] font-extrabold text-white transition-colors duration-300 group-hover:bg-green group-hover:text-ink">
                    {i + 1}
                  </span>
                  <span className="eyebrow">{p.stage}</span>
                </div>
                <h3 className="mt-5 font-display text-[1.45rem] font-extrabold leading-tight tracking-tighter2 text-ink">
                  {p.t}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body">{p.d}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {p.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-full bg-greenTint px-3.5 py-1.5 text-[0.82rem] font-medium text-greenDeep"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-[0.98rem] leading-relaxed text-body">
            You rarely need all of it at once. The teardown tells us which two
            or three pieces would move a number this quarter. The rest waits
            until it would earn its invoice.{" "}
            <Link href="/services" className="link inline-flex items-center gap-1.5">
              See every service
              <Arrow className="!h-3.5 !w-3.5" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
