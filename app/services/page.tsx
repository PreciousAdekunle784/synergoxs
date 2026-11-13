import type { Metadata } from "next";
import { services } from "@/lib/services";
import BookCall, { CallFacts } from "@/components/CTA";
import Eyebrow from "@/components/Eyebrow";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Eight capabilities that plug into one customer acquisition system: funnels, conversion optimisation, paid ads, lifecycle email, creative strategy, landing pages, automation and analytics.",
};

const stageOrder = ["Acquire", "Convert", "Automate", "Optimize"] as const;

const stageLine: Record<(typeof stageOrder)[number], string> = {
  Acquire: "Getting the right strangers to show up.",
  Convert: "Turning a visit into an enquiry.",
  Automate: "Following up without anyone chasing by hand.",
  Optimize: "Knowing what worked, and doing more of it.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="pb-16 pt-[120px] md:pb-20 md:pt-[156px]">
        <div className="shell">
          <Eyebrow>Services</Eyebrow>
          <h1 className="h-display mt-5 max-w-4xl text-[2.6rem] sm:text-[3.6rem] lg:text-[4.1rem]">
            Eight capabilities.{" "}
            <span className="hl">You almost certainly need three.</span>
          </h1>
          <p className="lede mt-6 max-w-2xl">
            We don&apos;t sell these à la carte, and we don&apos;t sell all
            eight at once. The teardown decides which two or three would move a
            number this quarter. The others wait until they&apos;d earn their
            invoice.
          </p>
          <div className="mt-8">
            <BookCall className="w-full sm:w-auto" />
            <CallFacts className="mt-3" />
          </div>
        </div>
      </section>

      {stageOrder.map((stage, si) => {
        const inStage = services.filter((s) => s.stage === stage);
        if (!inStage.length) return null;
        return (
          <section key={stage} className={`py-16 md:py-20 ${si % 2 === 0 ? "bg-mist" : ""}`}>
            <div className="shell grid gap-8 lg:grid-cols-[0.36fr_1fr] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="eyebrow">Stage {si + 1}</span>
                <h2 className="mt-3 font-display text-[2.2rem] font-extrabold leading-none tracking-tightest text-ink">
                  {stage}
                </h2>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body">{stageLine[stage]}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {inStage.map((s) => (
                  <div key={s.name} className="card flex flex-col p-7">
                    <h3 className="font-display text-[1.35rem] font-extrabold tracking-tighter2 text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-3 text-[0.98rem] font-medium leading-relaxed text-ink">
                      {s.line}
                    </p>
                    <p className="mt-3 text-[0.93rem] leading-relaxed text-body">{s.detail}</p>
                    <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                      {s.deliverables.map((d) => (
                        <li
                          key={d}
                          className="rounded-full bg-greenTint px-3.5 py-1.5 text-[0.8rem] font-medium text-greenDeep"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="slab-dark on-dark px-6 py-16 text-center md:py-20">
          <h2 className="h-section mx-auto max-w-2xl">
            Not sure which ones you need?{" "}
            <span className="text-green">That&apos;s what the call is for.</span>
          </h2>
          <p className="lede mx-auto mt-5 max-w-xl">
            We&apos;ll model your funnel on your real numbers and tell you
            which stage to fix first.
          </p>
          <div className="mt-8">
            <BookCall size="lg" className="w-full sm:w-auto" />
          </div>
        </div>
      </section>
    </>
  );
}
