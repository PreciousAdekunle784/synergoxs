import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn the system",
  description:
    "Courses, workshops and a private community teaching the same teardown methodology, offer frameworks and funnel templates Synergox uses on paid engagements.",
};

const tracks = [
  {
    tag: "Course",
    name: "The Teardown Method",
    lede: "Find the stage costing you the most, and price what closing it is worth.",
    body: "The full diagnostic we run on paid engagements, taught step by step. You finish it with your own numbers modelled and a ranked list of what to fix first.",
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
    lede: "Build the nine-step path, then stop it leaking at step four.",
    body: "Landing pages, lead magnets, sequences and booking flows — with the templates we use internally, cloneable, and the reasoning behind every section.",
    inside: [
      "Clonable funnel templates",
      "Copy swipe files with annotations",
      "Sequence structures that convert",
      "Tracking set up properly",
    ],
  },
  {
    tag: "Live",
    name: "Workshops & Teardowns",
    lede: "Monthly sessions where real funnels get pulled apart in the open.",
    body: "Bring your build. We diagnose it live in front of the room. Watching someone else's funnel get taken apart teaches faster than any module.",
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
      <section className="relative overflow-hidden border-b border-hair pb-24 pt-[132px] md:pb-28 md:pt-[164px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(760px 420px at 70% 6%, rgba(0,197,81,0.1), transparent 68%)",
          }}
        />
        <div className="shell">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-signal" />
            <span className="eyebrow">Learn to do it yourself</span>
          </div>
          <h1 className="h-display mt-7 max-w-4xl text-[2.7rem] text-ink sm:text-[3.7rem] lg:text-[4.3rem]">
            The same systems.{" "}
            <span className="text-signal">Your hands on the controls.</span>
          </h1>
          <p className="body-lg mt-8 max-w-2xl">
            Everything we charge for on a build — the teardown methodology, the
            offer frameworks, the funnel templates, the campaign structures —
            taught in the open. But learning the system and knowing which part of
            it will move <em>your</em> numbers first are two different things.
            Start with a free teardown of your business, and we&apos;ll tell you
            exactly where to point your effort.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/apply" className="btn-signal shadow-press">
              Book your free teardown call
            </Link>
            <Link href="/#paths" className="btn-ghost">
              Compare both paths
            </Link>
          </div>
          <p className="mt-6 max-w-lg text-[0.85rem] leading-relaxed text-inkFaint">
            No pitch on the call — you leave with your biggest leak identified and
            the exact track (or build) that closes it. Cohorts stay small so live
            sessions can review your work.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="shell">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-signal" />
            <span className="eyebrow">What&apos;s taught</span>
          </div>
          <h2 className="h-section mt-6 max-w-3xl text-ink">
            Four tracks.{" "}
            <span className="text-inkFaint">Taken in order, or not at all.</span>
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift md:grid-cols-2">
            {tracks.map((t) => (
              <article key={t.name} className="bg-panel p-9 md:p-11">
                <span className="rounded-full border border-hair px-3.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-inkMute">
                  {t.tag}
                </span>
                <h3 className="mt-6 font-display text-[1.7rem] font-extrabold leading-tight tracking-tightest text-ink">
                  {t.name}
                </h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/85">
                  {t.lede}
                </p>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-inkMute">
                  {t.body}
                </p>
                <ul className="mt-7 space-y-2.5 border-t border-hair pt-6">
                  {t.inside.map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[0.9rem] text-inkMute"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {i}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-5 rounded-slab border border-signal/25 bg-signal/[0.05] p-9 text-center md:flex-row md:justify-between md:p-11 md:text-left">
            <div className="max-w-xl">
              <h3 className="font-display text-[1.4rem] font-extrabold leading-tight tracking-tighter2 text-ink md:text-[1.7rem]">
                Not sure which track you actually need?
              </h3>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-inkMute">
                That&apos;s the whole point of the free teardown. We look at your
                business, find the one leak costing you the most, and tell you
                which track closes it — before you spend a naira or an hour.
              </p>
            </div>
            <Link href="/apply" className="btn-signal shrink-0 shadow-press">
              Book your teardown
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-hair bg-pitch py-24 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-signal" />
              <span className="eyebrow">The community</span>
            </div>
            <h2 className="h-section mt-6 text-ink">
              The part that keeps working{" "}
              <span className="text-inkFaint">after the course ends.</span>
            </h2>
            <p className="body-lg mt-6 max-w-xl">
              Courses teach you the shape of the thing. The room is where you
              find out why your version of it didn&apos;t work, from people
              running the same plays this week.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift">
            {community.map((c) => (
              <li
                key={c}
                className="flex items-start gap-4 bg-panel p-7 text-[0.98rem] leading-relaxed text-ink/85"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 15 15"
                  fill="none"
                  className="mt-1 shrink-0 text-signal"
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
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="shell">
          <div className="mx-auto max-w-3xl rounded-slab border border-hair bg-panel p-10 text-center shadow-lift md:p-16">
            <p className="eyebrow">Not sure which door</p>
            <h2 className="h-section mt-6 text-ink">
              Take the call either way.
            </h2>
            <p className="body-lg mx-auto mt-6 max-w-xl">
              We&apos;ll run the teardown on your business for free. If what it
              finds is something you can fix yourself, we&apos;ll say so and
              point you at the track that covers it. Nobody gets sold a build
              they didn&apos;t need.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/apply" className="btn-signal shadow-press">
                Book a strategy call
              </Link>
              <Link href="/#teardown" className="btn-ghost">
                Run the teardown now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
