import BookCall, { CallFacts } from "./CTA";
import PlaybookLink from "./PlaybookLink";
import { Check } from "./Icons";
import { PLAYBOOK_PAGES } from "@/lib/site";

/* Same numbers the calculator opens with, so the page tells one story. */
const stages = [
  { label: "Visitors", value: "3,333", rate: null, w: 100, leak: false },
  { label: "Leads", value: "200", rate: "6%", w: 46, leak: true },
  { label: "Booked calls", value: "36", rate: "18%", w: 26, leak: false },
  { label: "Customers", value: "7", rate: "20%", w: 13, leak: false },
];

const promises = [
  "If we don't ship it, you don't pay for it",
  "You own every account and asset",
  "30 days' notice, no lock-in",
];

function TeardownPreview() {
  return (
    <div className="on-dark relative rounded-slab bg-ink p-6 text-white shadow-lift sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Sample teardown</p>
          <p className="mt-2 font-display text-[1.3rem] font-extrabold tracking-tighter2">
            Where the customers go
          </p>
        </div>
        <span className="rounded-full border border-lineDark px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ash">
          Illustrative
        </span>
      </div>

      <div className="mt-7 space-y-4">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="flex items-baseline justify-between gap-3 text-[0.88rem]">
              <span className="flex items-center gap-2 text-ash">
                {s.label}
                {s.leak && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-ink">
                    Biggest leak
                  </span>
                )}
              </span>
              <span className="num flex items-baseline gap-3">
                {s.rate && <span className="text-[0.76rem] text-ash">{s.rate} convert</span>}
                <span className="font-semibold text-white">{s.value}</span>
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-lineDark">
              <div
                className={`h-full origin-left animate-grow rounded-full ${
                  s.leak ? "bg-white" : "bg-green"
                }`}
                style={{ width: `${s.w}%`, animationDelay: `${0.5 + i * 0.12}s` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 border-t border-lineDark pt-6">
        <div>
          <p className="eyebrow">Cost per customer</p>
          <p className="num mt-2 font-display text-[1.7rem] font-extrabold tracking-tightest text-white">
            $556
          </p>
          <p className="mt-1 text-[0.78rem] text-ash">today</p>
        </div>
        <div>
          <p className="eyebrow">With that one leak fixed</p>
          <p className="num mt-2 font-display text-[1.7rem] font-extrabold tracking-tightest text-green">
            $222
          </p>
          <p className="mt-1 text-[0.78rem] text-ash">same traffic, same budget</p>
        </div>
      </div>

      <p className="mt-5 text-[0.76rem] leading-relaxed text-ash">
        Example figures, not a client result. On the call we build this from
        your own numbers.
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-[112px] md:pb-24 md:pt-[148px]">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div>
          <p className="eyebrow animate-rise flex items-center gap-3">
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-green" />
            <span>
              Growth marketing agency
              <span className="hidden sm:inline"> · Funnels, ads &amp; follow-up</span>
            </span>
          </p>

          <h1
            className="h-display mt-6 animate-rise text-[2.55rem] sm:text-[3.5rem] lg:text-[4.1rem]"
            style={{ animationDelay: "80ms" }}
          >
            Get more customers from the traffic you&apos;re{" "}
            <span className="hl animate-mark">already paying for.</span>
          </h1>

          <p className="lede mt-6 max-w-xl animate-rise" style={{ animationDelay: "160ms" }}>
            You probably don&apos;t have a traffic problem. You have a leak: one
            stage of your funnel where buyers quietly drop out. We find it,
            rebuild it, and hand you a system with a cost per customer you can
            plan around.
          </p>

          <div className="mt-8 animate-rise" style={{ animationDelay: "240ms" }}>
            <BookCall size="lg" className="w-full sm:w-auto" />
            <CallFacts className="mt-3" />
          </div>

          <ul
            className="mt-8 flex animate-rise flex-col gap-2.5 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:gap-x-6"
            style={{ animationDelay: "320ms" }}
          >
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[0.9rem] font-medium text-ink">
                <Check className="text-greenDeep" />
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-6 animate-rise text-[0.92rem] text-body" style={{ animationDelay: "400ms" }}>
            Not ready to talk?{" "}
            <PlaybookLink>Get the free {PLAYBOOK_PAGES}-page playbook</PlaybookLink>
          </p>
        </div>

        <div className="animate-rise" style={{ animationDelay: "300ms" }}>
          <TeardownPreview />
        </div>
      </div>

      {/* Platforms — a plain statement of what we work in, not a logo wall */}
      <div className="shell mt-16 md:mt-24">
        <div className="flex flex-col gap-4 border-y border-line py-6 md:flex-row md:items-center md:gap-10">
          <span className="eyebrow shrink-0">Platforms we build on</span>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2.5">
            {["Meta Ads", "Google Ads", "Shopify", "Klaviyo", "GA4", "HubSpot", "Next.js"].map((p) => (
              <li key={p} className="font-display text-[1rem] font-semibold tracking-tighter2 text-ink/70">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
