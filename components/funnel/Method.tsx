import { InView, Reveal, Stagger, StaggerItem } from "@/components/Primitives";
import Eyebrow from "@/components/Eyebrow";

const steps = [
  {
    name: "Discover",
    text: "We study your numbers, your current pages and how customers find you today, and locate the stage losing the most people.",
    out: "A clear diagnosis",
  },
  {
    name: "Strategize",
    text: "One written plan: who you're talking to, what you're offering them, and which page and channel will carry it.",
    out: "Your growth plan",
  },
  {
    name: "Build",
    text: "Your website or landing page, written and designed around a single action, and fast on a phone.",
    out: "Pages that convert",
  },
  {
    name: "Acquire",
    text: "Meta and Google campaigns that send the right people to the page built for them, tracked from the first click.",
    out: "Qualified prospects",
  },
  {
    name: "Optimize",
    text: "We read what the data says, fix the weakest stage and test the next improvement. Then again.",
    out: "Better numbers, each round",
  },
];

/**
 * DISCOVER → STRATEGIZE → BUILD → ACQUIRE → OPTIMIZE.
 * One green line runs through all five: across on desktop, down on mobile.
 * It draws itself when the section scrolls into view.
 */
export default function Method({ title, accent, lede }: { title: string; accent: string; lede: string }) {
  return (
    <section id="method" className="scroll-mt-20 pb-20 md:pb-28" aria-labelledby="method-h">
      <div className="slab-dark on-dark bg-grid px-6 py-16 sm:px-10 md:py-24">
        <div className="mx-auto max-w-shell">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>The SYNERGOX method</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="method-h" className="h-section mt-5">
                {title} <span className="accent accent-green">{accent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6 max-w-2xl">{lede}</p>
            </Reveal>
          </div>

          <InView className="group/track relative mt-14 md:mt-20">
            {/* the line: horizontal from lg, vertical below */}
            <span aria-hidden className="absolute left-[9px] top-2 h-[calc(100%-1rem)] w-[2px] bg-white/15 lg:left-0 lg:top-[9px] lg:h-[2px] lg:w-full" />
            <span
              aria-hidden
              className="absolute left-[9px] top-2 h-[calc(100%-1rem)] w-[2px] origin-top scale-y-0 bg-green transition-transform duration-[1800ms] ease-out group-[.is-in]/track:scale-y-100 lg:left-0 lg:top-[9px] lg:h-[2px] lg:w-full lg:origin-left lg:scale-x-0 lg:scale-y-100 lg:group-[.is-in]/track:scale-x-100"
            />

            <Stagger as="ol" className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
              {steps.map((s, i) => (
                <StaggerItem as="li" key={s.name} className="relative pl-10 lg:pl-0 lg:pt-10">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      i === steps.length - 1 ? "border-green bg-green" : "border-green bg-ink"
                    }`}
                  >
                    {i === steps.length - 1 && <span className="absolute h-5 w-5 animate-ping rounded-full bg-green" />}
                  </span>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">Step {i + 1}</p>
                  <h3 className="mt-2 font-display text-[1.7rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "80%" }}>
                    {s.name}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ash">{s.text}</p>
                  <p className="mt-4 border-t border-white/15 pt-3 text-[0.86rem] text-white">
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-green">You get </span>
                    <span className="mt-0.5 block font-semibold">{s.out}</span>
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </InView>
        </div>
      </div>
    </section>
  );
}
