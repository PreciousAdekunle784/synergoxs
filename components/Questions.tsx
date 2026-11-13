"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionHead } from "./Primitives";
import { CALL_MINUTES, EMAIL } from "@/lib/site";

/* Ordered the way the doubts actually arrive: the call, the risk, the money,
   the time, the alternatives. */
const items = [
  {
    q: "What happens on the teardown call? Is it a sales pitch?",
    a: `No. It's ${CALL_MINUTES} minutes on your numbers. We model your funnel stage by stage, show you where the most customers are dropping out, and put a figure on what fixing it would be worth. If the numbers say we'd be the wrong spend for you right now, we'll tell you on the call instead of quoting. Either way, the findings are yours to keep.`,
  },
  {
    q: "Can you guarantee results?",
    a: "Not a revenue figure, and be careful with anyone who does. They don't control your market, your delivery or your close rate. What we guarantee is scope: if a stage doesn't ship, it isn't billed, and that's written into the agreement. Where the numbers support it, we'll also tie part of our fee to performance, so we carry risk alongside you.",
  },
  {
    q: "What does it cost?",
    a: "A build is priced on what's being fixed, not on hours, and it's quoted after the teardown, so you're paying for a defined outcome. Ongoing work is monthly with a 30-day exit. If the teardown shows the return doesn't justify the fee, we'll say so and not quote.",
  },
  {
    q: "How long until we see something?",
    a: "The written plan is done by the end of week two. The first assets ship in weeks three to six. Meaningful performance data arrives once campaigns have run long enough to learn from, usually 30 to 45 days after launch depending on your spend and sales cycle.",
  },
  {
    q: "How much of my time does this take?",
    a: "About four hours in the first two weeks: a discovery session, an offer session and one review. After that, a 45-minute call a week. We write, design and build. You approve, and answer the questions only you can answer.",
  },
  {
    q: "Why not hire someone, or use freelancers?",
    a: "Eventually you should hire. But one hire is one skill, and a working acquisition system needs offer, copy, design, media buying, engineering and analytics pulling together. Freelancers are excellent at their own piece, but nobody owns the gaps between them, so when results dip there's no one whose job it is to find out why. We build the whole path, prove the numbers, then hand it over to your team.",
  },
  {
    q: "Will this work in my industry?",
    a: "The mechanics hold whether you sell roofing, software or groceries: visitors, leads, calls and close rate. What changes is the offer, the order of the objections and the channel. If we don't think we can move your numbers, we'll say so on the first call rather than take the project.",
  },
  {
    q: "Who owns everything at the end?",
    a: "You do. Ad accounts, pixels, code, email list, CRM and creative files are in your name from day one. If we part ways, nothing has to be rebuilt and no access has to be negotiated.",
  },
  {
    q: "Do you work with businesses outside Nigeria?",
    a: "Yes. We work remotely with clients across time zones and run campaigns in whichever market and currency you sell in. Calls are scheduled in your working hours.",
  },
];

function Item({
  id,
  q,
  a,
  open,
  onToggle,
}: {
  id: string;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-[1.12rem] font-semibold leading-snug tracking-tighter2 text-ink sm:text-[1.25rem]">
            {q}
          </span>
          <span
            aria-hidden
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              open
                ? "rotate-45 bg-green text-ink"
                : "bg-mist text-ink group-hover:bg-ink group-hover:text-white"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-[1rem] leading-relaxed text-body">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Questions() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-mist">
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            eyebrow="Questions"
            title={
              <>
                What people ask{" "}
                <span className="text-mute">right before they book.</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-[0.98rem] leading-relaxed text-body">
              Something we haven&apos;t covered? Email{" "}
              <a href={`mailto:${EMAIL}`} className="link">
                {EMAIL}
              </a>{" "}
              and a person will answer.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="rounded-slab border border-line bg-paper px-6 sm:px-9">
            {items.map((it, i) => (
              <div key={it.q} className={i === items.length - 1 ? "[&>div]:border-b-0" : ""}>
                <Item
                  id={`faq-${i}`}
                  q={it.q}
                  a={it.a}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
