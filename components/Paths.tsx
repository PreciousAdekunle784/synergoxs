"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Primitives";

const paths = [
  {
    id: "dfy",
    tag: "Done for you",
    title: "Let us build your growth engine",
    lede: "You hand us the business. We hand you back a machine that produces customers at a cost you can name.",
    body: "Strategy, funnels, copywriting, paid ads, automation, conversion optimisation, email — all of it built, launched and run by the people who were on your first call. You approve the direction and answer the questions only a founder can answer. That's the whole ask on your time.",
    includes: [
      "Growth strategy & offer architecture",
      "Funnel design and engineering",
      "Direct-response copywriting",
      "Paid acquisition, managed end to end",
      "Lifecycle email & automation",
      "Conversion optimisation, monthly",
      "Attribution you can actually read",
      "Scaling once the numbers hold",
    ],
    forYou: "You have demand, budget and no time. You'd rather own the outcome than the calendar.",
    notForYou: "You want to be in every decision, or you're pre-revenue and testing whether the thing sells at all.",
    cta: "Let's scale your business",
    href: "/apply",
    external: false,
    meta: "Six weeks to first ship · Three builds a month",
  },
  {
    id: "diy",
    tag: "Learn to do it yourself",
    title: "Master the same systems we use",
    lede: "The frameworks, templates and teardown process we charge for — handed over, so the skill stays with you.",
    body: "Courses, live workshops, and a private community where the same playbooks get taught in the open: how to find your leak, write an offer people can't compare on price, build the funnel around it, and read the numbers that tell you what to do next. Same material, your hands on the controls.",
    includes: [
      "The full teardown methodology",
      "Offer and positioning frameworks",
      "Funnel templates you can clone",
      "Copy swipe files with the reasoning",
      "Live workshops and teardowns",
      "Private community of operators",
      "Campaign structures that scale",
      "Direct feedback on your builds",
    ],
    forYou: "You're an operator or marketer who wants the capability permanently, not rented by the month.",
    notForYou: "You need revenue moving in the next thirty days and don't have time to learn on the way.",
    cta: "Start learning",
    href: "/learn",
    external: false,
    meta: "Self-paced · Community included · Cancel anytime",
  },
];

function DFYIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-11 w-11" aria-hidden>
      <rect x="3" y="9" width="16" height="12" rx="3" stroke="#00C551" strokeWidth="1.5" />
      <rect x="25" y="9" width="16" height="12" rx="3" stroke="#3E463C" strokeWidth="1.5" />
      <rect x="14" y="27" width="16" height="12" rx="3" stroke="#00C551" strokeWidth="1.5" />
      <path d="M11 21v3h11M33 21v3H22M22 24v3" stroke="#3E463C" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="33" r="2.5" fill="#00C551" />
    </svg>
  );
}

function DIYIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-11 w-11" aria-hidden>
      <path d="M4 13.5 22 6l18 7.5L22 21 4 13.5Z" stroke="#00C551" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 17v10c0 3 5 5.5 11 5.5S33 30 33 27V17" stroke="#3E463C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 13.5V26" stroke="#00C551" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="30" r="2.5" fill="#00C551" />
    </svg>
  );
}

export default function Paths() {
  const reduce = useReducedMotion();

  return (
    <section id="paths" className="relative overflow-hidden py-32 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 520px at 50% 0%, rgba(0,197,81,0.09), transparent 66%)",
        }}
      />

      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-signal" />
              <span className="eyebrow">The fork in the road</span>
              <span className="h-px w-8 bg-signal" />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="h-display mt-8 text-[2.6rem] text-ink sm:text-[3.5rem] lg:text-[4rem]">
              How do you want{" "}
              <span className="text-signal">to grow?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="body-lg mx-auto mt-7 max-w-xl">
              There are two honest answers, and only one of them is right for
              where you are this quarter. Pick wrong and you either burn a year
              learning something you should have bought, or you rent a
              capability you were ready to own.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2 lg:gap-7">
          {paths.map((p, i) => (
            <motion.article
              key={p.id}
              initial={reduce ? false : { opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.85,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduce ? undefined : { y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-slab border border-hair bg-panel p-9 shadow-lift transition-colors duration-500 hover:border-signal/35 md:p-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/0 to-transparent transition-all duration-700 group-hover:via-signal/60"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "rgba(0,197,81,0.13)" }}
              />

              <div className="flex items-start justify-between gap-6">
                {p.id === "dfy" ? <DFYIcon /> : <DIYIcon />}
                <span className="rounded-full border border-hair px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-inkMute">
                  {p.tag}
                </span>
              </div>

              <h3 className="mt-9 font-display text-[1.85rem] font-extrabold leading-[1.05] tracking-tightest text-ink sm:text-[2.15rem]">
                {p.title}
              </h3>
              <p className="mt-5 text-[1.08rem] leading-relaxed text-ink/85">
                {p.lede}
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-inkMute">
                {p.body}
              </p>

              <div className="mt-9 border-t border-hair pt-8">
                <p className="eyebrow">What&apos;s inside</p>
                <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {p.includes.map((inc) => (
                    <li
                      key={inc}
                      className="flex items-start gap-3 text-[0.9rem] leading-snug text-inkMute"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 15 15"
                        fill="none"
                        className="mt-[3px] shrink-0 text-signal"
                        aria-hidden
                      >
                        <path
                          d="M3.5 8l3 3 5-7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 grid gap-4 rounded-card border border-hair bg-pitch p-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-signal">
                    Choose this if
                  </p>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-inkMute">
                    {p.forYou}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-boneDim">
                    Don&apos;t if
                  </p>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-inkFaint">
                    {p.notForYou}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-9">
                {p.external ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-signal w-full shadow-press"
                  >
                    {p.cta}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                      <path
                        d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <Link href={p.href} className="btn-ghost w-full">
                    {p.cta}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                      <path
                        d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                )}
                <p className="mt-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-inkFaint">
                  {p.meta}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-xl text-center text-[0.92rem] leading-relaxed text-inkFaint">
            Still not sure? Book the call anyway. If the teardown says you&apos;d
            be better off learning it than buying it, we&apos;ll tell you and
            send you to the second door.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
