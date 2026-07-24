import type { Metadata } from "next";
import Link from "next/link";
import Apply from "@/components/Apply";

export const metadata: Metadata = {
  title: "Apply for a strategy call",
  description:
    "Ten questions so we can model your funnel before we speak. Takes about ninety seconds.",
  robots: { index: false, follow: true },
};

export default function ApplyPage() {
  return (
    <section className="relative overflow-hidden pb-28 pt-[124px] md:pb-36 md:pt-[150px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(760px 420px at 50% 0%, rgba(0,197,81,0.09), transparent 68%)",
        }}
      />
      <div className="shell">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-signal" />
            <span className="eyebrow">Done for you</span>
            <span className="h-px w-8 bg-signal" />
          </div>
          <h1 className="h-display mt-7 text-[2.3rem] text-ink sm:text-[3rem]">
            Before we take{" "}
            <span className="text-signal">thirty minutes of your day.</span>
          </h1>
          <p className="body-lg mx-auto mt-6 max-w-xl">
            We run the teardown on your numbers before the call, not during it.
            That only works if we have the numbers. Ten questions — most people
            finish in ninety seconds.
          </p>
        </div>

        <Apply />

        <p className="mt-14 text-center text-[0.88rem] text-inkFaint">
          Wanted the other door?{" "}
          <Link href="/learn" className="text-signal hover:underline">
            Learn to build it yourself
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
