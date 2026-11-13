"use client";

import BookCall from "./CTA";
import PlaybookLink from "./PlaybookLink";
import { Reveal } from "./Primitives";
import Eyebrow from "./Eyebrow";
import { Tick } from "./Icons";
import { CALL_MINUTES, PLAYBOOK_PAGES } from "@/lib/site";

const youGet = [
  {
    t: "Your funnel, modelled on your own numbers",
    d: "Stage by stage, from first click to paying customer.",
  },
  {
    t: "Your biggest leak, named and priced",
    d: "The one stage losing you the most, and what fixing it is worth.",
  },
  {
    t: "A fix-first plan you can use without us",
    d: "What to do first, second and not at all.",
  },
  {
    t: "A straight answer on fit",
    d: "If we'd be the wrong spend for you right now, we'll say so.",
  },
];

export default function FinalCTA() {
  return (
    <section id="book" className="pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="slab-dark on-dark px-5 py-14 sm:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1080px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>The next step</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-display mt-6 text-[2.5rem] sm:text-[3.4rem] lg:text-[3.9rem]">
                Find your leak.{" "}
                <span className="text-green">Then decide.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6 max-w-lg">
                Book a free {CALL_MINUTES}-minute growth teardown. You&apos;ll
                leave knowing where your funnel is losing customers and what
                fixing it is worth, whether or not you ever hire us.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9">
                <BookCall size="lg" className="w-full sm:w-auto" />
                <p className="mt-4 text-[0.88rem] leading-relaxed text-ash">
                  Free · {CALL_MINUTES} minutes · About a minute to apply
                </p>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ash">
                  We take on a limited number of builds each month, so every
                  one gets our full attention.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-card bg-coal p-7 sm:p-9">
              <p className="eyebrow">What you leave the call with</p>
              <ul className="mt-6 space-y-5">
                {youGet.map((g) => (
                  <li key={g.t} className="flex items-start gap-3.5">
                    <Tick className="mt-1" />
                    <span>
                      <span className="block font-semibold text-white">{g.t}</span>
                      <span className="mt-0.5 block text-[0.92rem] leading-relaxed text-ash">
                        {g.d}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* The fallback for visitors who aren't ready to talk. Deliberately quiet. */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-14 flex max-w-[1080px] flex-col gap-4 border-t border-lineDark pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.98rem] leading-relaxed text-ash">
              <span className="font-semibold text-white">Not ready to talk yet?</span>{" "}
              Read the {PLAYBOOK_PAGES}-page playbook first. It&apos;s the system
              we install, written down. Free.
            </p>
            <PlaybookLink className="btn-outline shrink-0">
              Email me the playbook
            </PlaybookLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
