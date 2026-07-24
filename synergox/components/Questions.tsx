"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionHead } from "./Primitives";

const groups = [
  {
    title: "Before you decide",
    items: [
      {
        q: "Why not just hire someone internally?",
        a: "Eventually you should. But one hire is one skill, and an acquisition system needs offer strategy, copy, design, media buying, engineering and analytics working at once. A first marketing hire typically takes three months to find and six to become effective. We build the system, prove the numbers, then hand it to the person you hire so they inherit something that already works instead of a blank page.",
      },
      {
        q: "Why not use freelancers?",
        a: "Freelancers are excellent at the piece they were hired for. The problem is that no one owns the seams — the copywriter's promise, the designer's page and the media buyer's targeting drift apart, and when results dip nobody's scope covers the diagnosis. We hold the whole path, so there's one person to ask when a number moves.",
      },
      {
        q: "Why now, rather than next quarter?",
        a: "Because acquisition costs are compounding against you, not for you. Every month the auction gets more expensive and your competitors' pixels get better trained. Waiting a quarter means paying a quarter more for the same customer — and the build takes six weeks either way, so next quarter's revenue is decided by this quarter's work.",
      },
      {
        q: "Can you guarantee results?",
        a: "No, and be careful with anyone who does — they don't control your market, your delivery or your close rate. What we do guarantee is scope: if a stage doesn't ship, it isn't billed, and that's written into the agreement. Where the numbers support it, we'll also take part of our fee against performance, so we carry risk alongside you rather than invoicing regardless.",
      },
      {
        q: "Will this work in my industry?",
        a: "The mechanics are industry-agnostic — the maths of visitors, leads, calls and close rate holds whether you sell roofing, software or groceries. What changes is the offer, the objection order and the channel. If we don't think we can move your numbers, we'll say so on the first call rather than take the project.",
      },
    ],
  },
  {
    title: "Practical",
    items: [
      {
        q: "How long until we see something?",
        a: "Strategy is written by the end of week two. First assets ship in weeks three to six. Meaningful performance data arrives once campaigns have run long enough to learn from — usually 30 to 45 days after launch, depending on spend and sales-cycle length.",
      },
      {
        q: "How much of my time does this take?",
        a: "About four hours in the first two weeks — a discovery session, an offer session and one review. After that, a 45-minute call a week. We write, design and build; you approve and answer questions only you can answer.",
      },
      {
        q: "What does it cost?",
        a: "A scoped build is priced on what's being fixed, not on hours, and is quoted after the teardown so you're paying for a defined outcome. Ongoing work is monthly with a 30-day exit. If the teardown shows the return doesn't justify the fee, we'll tell you and not quote.",
      },
      {
        q: "Who owns everything at the end?",
        a: "You do — ad accounts, pixels, code repositories, email list, CRM, creative files, all of it in your name from day one. If we part ways, nothing has to be rebuilt and no access has to be negotiated.",
      },
      {
        q: "What do you need from us to start?",
        a: "Access to whatever exists — analytics, ad accounts, email platform — plus honest numbers on your close rate and average customer value. If some of that doesn't exist yet, that's a finding, not a blocker.",
      },
      {
        q: "Do you work with businesses outside Nigeria?",
        a: "Yes. We work remotely with clients across time zones and run campaigns in whichever market and currency you sell in. Calls are scheduled to your working hours.",
      },
    ],
  },
];

function Item({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-hair">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <span
          className={`font-display text-[1.1rem] font-semibold leading-snug tracking-tighter2 transition-colors sm:text-[1.25rem] ${
            open ? "text-signal" : "text-ink group-hover:text-signal"
          }`}
        >
          {q}
        </span>
        <span
          aria-hidden
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open
              ? "rotate-45 border-signal text-signal"
              : "border-hair text-inkMute"
          }`}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M5.5 1v9M1 5.5h9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-[0.98rem] leading-relaxed text-inkMute">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Questions() {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <section
      id="questions"
      className="relative border-y border-hair bg-pitch py-28 md:py-36"
    >
      <div className="shell">
        <SectionHead
          eyebrow="Objection: everything you haven't asked yet"
          title={
            <>
              The questions people ask{" "}
              <span className="text-inkFaint">right before they book.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-16">
          {groups.map((g, gi) => (
            <div key={g.title}>
              <Reveal>
                <p className="eyebrow border-b border-hair pb-4">{g.title}</p>
              </Reveal>
              <div>
                {g.items.map((it, ii) => {
                  const id = `${gi}-${ii}`;
                  return (
                    <Reveal key={it.q} delay={Math.min(ii * 0.04, 0.2)}>
                      <Item
                        q={it.q}
                        a={it.a}
                        open={open === id}
                        onToggle={() => setOpen(open === id ? null : id)}
                      />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
