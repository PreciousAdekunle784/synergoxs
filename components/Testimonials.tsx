"use client";

import { Reveal, SectionHead } from "./Primitives";
import { CASE_STUDY_URL } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * TESTIMONIALS — EDIT ME
 *
 * `verified` = a real client, published with permission.
 * `sample`   = an ILLUSTRATIVE example with a fictional profile. Every sample
 *              card carries a visible "Illustrative example" label and the
 *              section says so in plain words. Do not remove those labels
 *              while a sample is on the page — presenting an invented quote
 *              as real is an advertising-standards problem, not a taste one.
 *
 * To go live with a real quote: replace a sample's fields and flip its
 * `kind` to "verified". The label and the footnote update themselves.
 * ------------------------------------------------------------------ */
type Testimonial = {
  kind: "verified" | "sample";
  quote: string;
  name: string;
  role: string;
  link?: { href: string; label: string };
};

const testimonials: Testimonial[] = [
  {
    kind: "verified",
    quote: "It blew her mind — the brand finally looked like what she'd built.",
    name: "Owner, Kings Food Mart",
    role: "Grocery retail · Abuja",
    link: { href: CASE_STUDY_URL, label: "See the live build" },
  },
  {
    kind: "sample",
    quote:
      "I'd been through two agencies before this, so I came in suspicious, honestly. What changed my mind was the first call. They pulled up my own checkout numbers and showed me where people were dropping off before anybody mentioned a proposal. Nobody had ever started there with me. After that it was steady: a short update every week, questions answered the same day, and when something slipped they told me before I had to ask.",
    name: "Ifeoma A.",
    role: "Founder, skincare brand · Lagos",
  },
  {
    kind: "sample",
    quote:
      "I'm not a marketing person and I don't want to be one. They explained what they were doing in plain English, got on with it, and didn't need me in a meeting every other day. That's what I was paying for.",
    name: "Marcus T.",
    role: "Owner, heating & plumbing firm · Leeds",
  },
  {
    kind: "sample",
    quote:
      "Our front desk was drowning in WhatsApp enquiries and a lot of them never got a reply. They set up the booking flow and the reminders, then sat with my staff and trained them on it instead of leaving us with something we were scared to touch. The handover notes alone were worth having.",
    name: "Zainab M.",
    role: "Practice director, dental clinic · Abuja",
  },
  {
    kind: "sample",
    quote:
      "What I valued most was that they'd admit what they didn't know yet. “We need two more weeks of data before we call this” is not a sentence I'd heard from an agency before. And the ad account, the tracking, all of it sat in our name from the start, which made my finance lead a lot more comfortable.",
    name: "Daniel K.",
    role: "Co-founder, B2B software company · Nairobi",
  },
  {
    kind: "sample",
    quote:
      "They talked me out of the bigger engagement. Said my numbers didn't justify it yet and showed me why. I've sent three people their way off the back of that one conversation.",
    name: "Priya R.",
    role: "Founder, online course business · London",
  },
  {
    kind: "sample",
    quote: "Weekly call, on time, with an agenda. Sounds small. It isn't.",
    name: "Chidi O.",
    role: "Managing director, logistics company · Port Harcourt",
  },
];

function Quote({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="22" viewBox="0 0 26 20" fill="none" aria-hidden className={className}>
      <path
        d="M0 20V11.6C0 5.2 3.4 1.3 10.1 0l1 2.7C7 4 5 6 5 8.6h4.6V20H0Zm15 0v-8.4C15 5.2 18.4 1.3 25.1 0l1 2.7C22 4 20 6 20 8.6h4.6V20H15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const verified = testimonials.filter((t) => t.kind === "verified");
  const samples = testimonials.filter((t) => t.kind === "sample");

  return (
    <section id="testimonials" className="section bg-mist">
      <div className="shell">
        <SectionHead
          eyebrow="What it's like to work with us"
          title={
            <>
              Clear numbers, straight answers,{" "}
              <span className="text-mute">and no chasing.</span>
            </>
          }
        />

        {/* Verified client feedback — set apart, and marked as such */}
        {verified.map((t) => (
          <Reveal key={t.name} delay={0.08}>
            <figure className="on-dark mt-12 grid gap-8 rounded-slab bg-ink p-8 text-white md:grid-cols-[1fr_auto] md:items-end md:p-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-green px-3.5 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink" />
                  Verified client
                </span>
                <blockquote className="mt-6 max-w-3xl font-display text-[1.7rem] font-extrabold leading-[1.12] tracking-tightest sm:text-[2.3rem]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="md:text-right">
                <span className="block font-semibold text-white">{t.name}</span>
                <span className="mt-1 block text-[0.9rem] text-ash">{t.role}</span>
                {t.link && (
                  <a
                    href={t.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link mt-3 inline-block text-[0.9rem]"
                  >
                    {t.link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}

        {samples.length > 0 && (
          <>
            <Reveal delay={0.05}>
              <div className="mt-12 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="font-display text-[1.4rem] font-extrabold tracking-tighter2 text-ink">
                  The experience we hold ourselves to
                </h3>
                <p className="max-w-xl rounded-2xl border border-line bg-paper px-4 py-3 text-[0.86rem] leading-relaxed text-body">
                  <strong className="font-semibold text-ink">
                    The examples below are illustrative.
                  </strong>{" "}
                  The names and businesses are fictional. They show the
                  standard of service we work to, and they are not quotes from
                  real clients.
                </p>
              </div>
            </Reveal>

            {/* Phone: a swipeable row, so six cards don't become six screens.
                Tablet and up: masonry, where varied lengths read as real feedback. */}
            <div
              className="-mx-5 mt-8 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:block md:columns-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:columns-3 [&::-webkit-scrollbar]:hidden"
              role="list"
              aria-label="Illustrative testimonials"
              tabIndex={0}
            >
              {samples.map((t) => (
                <figure
                  key={t.name}
                  role="listitem"
                  className="card card-hover w-[86%] shrink-0 snap-center p-7 md:mb-4 md:w-auto md:break-inside-avoid"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Quote className="text-green" />
                    <span className="rounded-full border border-line px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-mute">
                      Illustrative example
                    </span>
                  </div>
                  <blockquote className="mt-5 text-[1rem] leading-relaxed text-ink">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span
                      aria-hidden
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[0.8rem] font-bold text-white"
                    >
                      {initials(t.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-semibold text-ink">
                        {t.name}
                      </span>
                      <span className="block text-[0.84rem] leading-snug text-mute">
                        {t.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-1 text-[0.82rem] text-mute md:hidden" aria-hidden>
              Swipe for more →
            </p>
          </>
        )}
      </div>
    </section>
  );
}
