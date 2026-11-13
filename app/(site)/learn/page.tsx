import type { Metadata } from "next";
import Link from "next/link";
import BookCall, { CallFacts } from "@/components/CTA";
import Eyebrow from "@/components/Eyebrow";
import { Tick } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Learn the system",
  description:
    "Courses, workshops and a private community teaching the same teardown method, offer frameworks and funnel templates Synergox uses on paid engagements.",
};

const tracks = [
  {
    tag: "Course",
    name: "The Teardown Method",
    lede: "Find the stage costing you the most, and price what closing it is worth.",
    body: "The full diagnostic we run on paid engagements, taught step by step. You finish with your own numbers modelled and a ranked list of what to fix first.",
    inside: [
      "The nine-check leak audit",
      "Building your own funnel model",
      "Benchmarks by business type",
      "Deciding what to fix first",
    ],
  },
  {
    tag: "Course",
    name: "Offers People Can't Price-Shop",
    lede: "Positioning and offer design, before a single page gets built.",
    body: "Why most offers get compared on price, and how to build one that can't be. Includes the research process for finding the language your buyers already use.",
    inside: [
      "Customer language research",
      "Offer architecture frameworks",
      "Risk reversal that isn't a gimmick",
      "Pricing against value, not hours",
    ],
  },
  {
    tag: "Course",
    name: "Funnels That Hold",
    lede: "Build the full path, then stop it leaking halfway down.",
    body: "Landing pages, lead magnets, sequences and booking flows, with the templates we use internally and the reasoning behind every section.",
    inside: [
      "Cloneable funnel templates",
      "Copy swipe files with annotations",
      "Sequence structures that convert",
      "Tracking set up properly",
    ],
  },
  {
    tag: "Live",
    name: "Workshops & Teardowns",
    lede: "Monthly sessions where real funnels get pulled apart in the open.",
    body: "Bring your build and we diagnose it live. Watching someone else's funnel get taken apart teaches faster than any module.",
    inside: [
      "Monthly live teardown",
      "Submit your own build",
      "Recordings kept in the library",
      "Q&A with no time limit",
    ],
  },
];

const community = [
  "A private room of operators, not spectators",
  "Direct feedback on your pages, offers and campaigns",
  "Every template and swipe file, updated as we update ours",
  "Members-only teardowns and campaign breakdowns",
];

export default function LearnPage() {
  return (
    <>
      <section className="pb-16 pt-[120px] md:pb-20 md:pt-[156px]">
        <div className="shell">
          <Eyebrow>Learn to do it yourself</Eyebrow>
          <h1 className="h-display mt-5 max-w-4xl text-[2.6rem] sm:text-[3.6rem] lg:text-[4.1rem]">
            The same system.{" "}
            <span className="hl">Your hands on the controls.</span>
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Everything we use on a build, from the teardown method to the offer
            frameworks and funnel templates, taught in the open. But learning
            the system and knowing which part of it will move <em>your</em>{" "}
            numbers first are different things. Start with a free teardown and
            we&apos;ll tell you where to point your effort.
          </p>
          <div className="mt-8">
            <BookCall className="w-full sm:w-auto" />
            <CallFacts className="mt-3" />
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="shell">
          <Eyebrow>What&apos;s taught</Eyebrow>
          <h2 className="h-section mt-5 max-w-3xl">
            Four tracks. <span className="text-mute">Best taken in order.</span>
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {tracks.map((t) => (
              <article key={t.name} className="card flex flex-col p-7 md:p-9">
                <span className="self-start rounded-full bg-ink px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                  {t.tag}
                </span>
                <h3 className="mt-5 font-display text-[1.6rem] font-extrabold leading-tight tracking-tighter2 text-ink">
                  {t.name}
                </h3>
                <p className="mt-3 text-[1.02rem] font-medium leading-relaxed text-ink">{t.lede}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-body">{t.body}</p>
                <ul className="mt-auto space-y-2.5 pt-7">
                  {t.inside.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-[0.93rem] text-body">
                      <Tick className="mt-0.5" />
                      {i}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Eyebrow>The community</Eyebrow>
            <h2 className="h-section mt-5">
              The part that keeps working{" "}
              <span className="text-mute">after the course ends.</span>
            </h2>
            <p className="lede mt-5 max-w-xl">
              Courses teach you the shape of the thing. The room is where you
              find out why your version of it didn&apos;t work, from people
              running the same plays this week.
            </p>
          </div>
          <ul className="space-y-3">
            {community.map((c) => (
              <li key={c} className="card flex items-start gap-4 p-6 text-[1rem] leading-relaxed text-ink">
                <Tick className="mt-1" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="slab-dark on-dark px-6 py-16 text-center md:py-20">
          <h2 className="h-section mx-auto max-w-2xl">
            Not sure which track you need?{" "}
            <span className="text-green">Take the call first.</span>
          </h2>
          <p className="lede mx-auto mt-5 max-w-xl">
            We&apos;ll run the teardown on your business for free. If what it
            finds is something you can fix yourself, we&apos;ll say so and
            point you at the track that covers it. Nobody gets sold a build
            they didn&apos;t need.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookCall size="lg" className="w-full sm:w-auto" />
            <Link href="/#teardown" className="btn-outline w-full sm:w-auto">
              Try the calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
