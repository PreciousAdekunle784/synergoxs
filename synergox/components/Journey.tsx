"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionHead } from "./Primitives";

const steps = [
  {
    n: "Cold traffic",
    w: "A stranger meets an angle that names a problem they already have — before they've heard of you.",
    keep: "100%",
  },
  {
    n: "Landing page",
    w: "One page, one action, and the three objections that stop the click answered before they have to scroll.",
    keep: "≈38%",
  },
  {
    n: "Lead magnet",
    w: "Something useful enough to be worth an email address even if they never buy anything.",
    keep: "≈24%",
  },
  {
    n: "Email sequence",
    w: "Six to nine touches that do the convincing you'd otherwise have to do on the phone, one prospect at a time.",
    keep: "≈19%",
  },
  {
    n: "Sales call",
    w: "Reminders, a pre-call brief and a qualification filter, so the calendar fills with buyers instead of browsers.",
    keep: "≈29%",
  },
  {
    n: "Customer",
    w: "Onboarding that sets the expectation the next three steps quietly depend on.",
    keep: "Won",
  },
  {
    n: "Upsell",
    w: "The natural second purchase, offered at the exact moment the first one has proved itself.",
    keep: "+ margin",
  },
  {
    n: "Retention",
    w: "Lifecycle email that keeps you in the room between purchases, so the third sale costs nothing to win.",
    keep: "+ margin",
  },
  {
    n: "Referral",
    w: "Asked at the peak of satisfaction, not six months later when the feeling has gone cold.",
    keep: "Free traffic",
  },
];

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHead
          eyebrow="Objection: how does a stranger become a buyer?"
          title={
            <>
              Nine steps from stranger{" "}
              <span className="text-inkFaint">to referral.</span>
            </>
          }
          lede="Steps one to three get you a lead, and that\u2019s where most agencies stop and hand you an invoice. Steps four to nine are where the revenue actually lives \u2014 and where almost nobody builds."
        />

        <div ref={ref} className="relative mt-16 md:mt-20">
          {/* Spine */}
          <div
            aria-hidden
            className="absolute left-[15px] top-2 h-[calc(100%-2rem)] w-px bg-hair md:left-1/2"
          >
            <motion.div
              style={{ height }}
              className="w-px bg-gradient-to-b from-signal via-signal to-signal/40"
            />
          </div>

          <ol className="space-y-10 md:space-y-0">
            {steps.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li key={s.n} className="relative md:grid md:grid-cols-2 md:gap-16">
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-signal/40 bg-void md:left-1/2 md:-translate-x-1/2"
                  >
                    <span className="h-2 w-2 rounded-full bg-signal" />
                  </motion.span>

                  <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`pl-14 md:py-8 md:pl-0 ${
                      right
                        ? "md:col-start-2 md:pl-16"
                        : "md:col-start-1 md:pr-16 md:text-right"
                    }`}
                  >
                    <div
                      className={`flex items-baseline gap-3 ${
                        right ? "" : "md:justify-end"
                      }`}
                    >
                      <span className="num text-[0.7rem] text-inkFaint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-[1.4rem] font-extrabold tracking-tightest text-ink sm:text-[1.7rem]">
                        {s.n}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-inkMute md:inline-block">
                      {s.w}
                    </p>
                    <p
                      className={`mt-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal ${
                        right ? "" : "md:text-right"
                      }`}
                    >
                      {s.keep}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
