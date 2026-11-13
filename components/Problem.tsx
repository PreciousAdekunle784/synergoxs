"use client";

import { Reveal, SectionHead, Stagger, StaggerItem, type HeadCopy } from "./Primitives";

const symptoms = [
  {
    t: "Two good weeks, then the phone stops.",
    d: "You can't hire, plan or sleep on that rhythm. Feast and famine isn't a season. It's what a funnel with a hole in it feels like from the inside.",
  },
  {
    t: "Your best month is a mystery.",
    d: "Revenue jumped and nobody can say why. Ask five people, get five answers. What you can't explain, you can't repeat.",
  },
  {
    t: "Every customer costs more than the last.",
    d: "Same offer, same ads, a bigger bill each quarter. When nothing after the click gets better, the ad platforms keep the difference.",
  },
  {
    t: "Leads go cold before anyone follows up.",
    d: "Most buyers need to hear from you several times before they're ready. They heard once. So they bought from whoever was still in front of them.",
  },
];

export default function Problem({ copy }: { copy: HeadCopy }) {
  return (
    <section id="problem" className="section bg-mist">
      <div className="shell">
        <SectionHead eyebrow="Sound familiar?" title={copy.title} accent={copy.accent} lede={copy.lede} />

        <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2">
          {symptoms.map((s, i) => (
            <StaggerItem as="li" key={s.t}>
              <div className="card card-hover card-accent h-full p-7 md:p-8">
                <span className="num text-[0.8rem] font-semibold text-greenDeep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.3rem] font-extrabold leading-snug tracking-tighter2 text-ink">
                  {s.t}
                </h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-body">{s.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl border-l-[3px] border-green pl-5 font-display text-[1.3rem] font-semibold leading-snug tracking-tighter2 text-ink">
            None of this is bad luck. Each one is a leak you can find, put a
            price on, and fix. Usually in weeks, not quarters.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
