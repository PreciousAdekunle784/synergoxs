import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Eight capabilities that plug into one acquisition system: funnels, CRO, paid media, lifecycle email, creative strategy, landing pages, automation and attribution.",
};

const stageOrder = ["Acquire", "Convert", "Automate", "Optimize"] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-hair pb-20 pt-[132px] md:pb-24 md:pt-[160px]">
        <div className="shell">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-signal" />
            <span className="eyebrow">Services</span>
          </div>
          <h1 className="h-display mt-7 max-w-4xl text-[2.8rem] text-ink sm:text-[3.8rem] lg:text-[4.4rem]">
            Capabilities, grouped by the{" "}
            <span className="text-signal">stage they serve.</span>
          </h1>
          <p className="body-lg mt-8 max-w-2xl">
            Nothing here is sold as a standalone retainer by default. The
            teardown decides the order, and we start with the stage that&apos;s
            costing you the most.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/apply" className="btn-signal shadow-press">
              Book a strategy call
            </Link>
            <Link href="/#teardown" className="btn-ghost">
              Run the teardown
            </Link>
          </div>
        </div>
      </section>

      {stageOrder.map((stage) => {
        const inStage = services.filter((s) => s.stage === stage);
        if (!inStage.length) return null;
        return (
          <section key={stage} className="border-b border-hair py-20 md:py-24">
            <div className="shell grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="eyebrow">Stage</span>
                <h2 className="mt-4 font-display text-[2.4rem] font-extrabold leading-none tracking-tightest text-signal">
                  {stage}
                </h2>
              </div>
              <div className="grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift sm:grid-cols-2">
                {inStage.map((s) => (
                  <div key={s.name} className="bg-panel p-8">
                    <h3 className="font-display text-[1.35rem] font-extrabold tracking-tightest text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-inkMute">
                      {s.line}
                    </p>
                    <p className="mt-4 text-[0.92rem] leading-relaxed text-ink/70">
                      {s.detail}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {s.deliverables.map((d) => (
                        <li
                          key={d}
                          className="rounded-full border border-hair px-3.5 py-1.5 text-[0.78rem] text-inkMute"
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

      <section className="py-24 md:py-28">
        <div className="shell text-center">
          <h2 className="h-section mx-auto max-w-2xl text-ink">
            Not sure which one you need?{" "}
            <span className="text-inkFaint">That&apos;s the call.</span>
          </h2>
          <Link href="/apply" className="btn-signal mt-9 shadow-press">
            Book a strategy call
          </Link>
        </div>
      </section>
    </>
  );
}
