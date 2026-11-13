import BookCall, { CallFacts } from "./CTA";
import PlaybookLink from "./PlaybookLink";
import { Check } from "./Icons";
import { PLAYBOOK_PAGES } from "@/lib/site";
import type { Copy } from "@/lib/content/defaults";

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
          Example
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
                style={{ width: `${s.w}%`, animationDelay: `${0.7 + i * 0.12}s` }}
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

/** Each word rises from behind a mask, one after another. Pure CSS. */
function Words({ text, from, mark = false }: { text: string; from: number; mark?: boolean }) {
  const words = text.split(/\s+/).filter(Boolean);
  const out = words.map((w, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom [margin-bottom:-0.12em]">
      <span className="inline-block animate-word" style={{ animationDelay: `${80 + (from + i) * 55}ms` }}>
        {w}
        {i < words.length - 1 ? " " : ""}
      </span>
    </span>
  ));
  return mark ? (
    <span className="hl animate-mark" style={{ animationDelay: `${420 + (from + words.length) * 55}ms` }}>
      {out}
    </span>
  ) : (
    <>{out}</>
  );
}

export default function Hero({ copy }: { copy: Copy }) {
  const [eyebrowLead, ...eyebrowRest] = copy["hero.eyebrow"].split(" · ");
  const headWords = copy["hero.headline"].split(/\s+/).filter(Boolean).length;
  const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <section className="relative overflow-hidden pb-16 pt-[112px] md:pb-24 md:pt-[148px]">
      {/* Background: two soft green fields drifting very slowly behind a faint grid.
          Decorative, low contrast, and still for anyone who prefers reduced motion. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 animate-fade">
        <div
          className="absolute -right-[10%] -top-[18%] h-[560px] w-[560px] animate-drift rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(0,197,81,0.16), transparent)" }}
        />
        <div
          className="absolute -left-[12%] top-[38%] h-[420px] w-[420px] animate-drift rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(0,197,81,0.09), transparent)", animationDelay: "-9s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: "radial-gradient(rgba(10,12,10,0.09) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(70% 60% at 60% 30%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 60% 30%, black, transparent)",
          }}
        />
      </div>

      <div className="shell grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div>
          <p className="eyebrow flex animate-rise items-center gap-3">
            <span aria-hidden className="h-[3px] w-6 shrink-0 origin-left animate-grow rounded-full bg-green" />
            <span>
              {eyebrowLead}
              {eyebrowRest.length > 0 && (
                <span className="hidden sm:inline"> · {eyebrowRest.join(" · ")}</span>
              )}
            </span>
          </p>

          <h1
            className="h-display mt-6 text-[2.55rem] sm:text-[3.5rem] lg:text-[4.1rem]"
            aria-label={`${copy["hero.headline"]} ${copy["hero.highlight"]}`}
          >
            <span aria-hidden>
              <Words text={copy["hero.headline"]} from={0} />{" "}
              <Words text={copy["hero.highlight"]} from={headWords} mark />
            </span>
          </h1>

          <p className="lede mt-6 max-w-xl animate-rise" style={delay(520)}>
            {copy["hero.sub"]}
          </p>

          <div className="mt-8 animate-rise" style={delay(640)}>
            <BookCall size="lg" className="w-full sm:w-auto" />
            <CallFacts className="mt-3" />
          </div>

          <ul className="mt-8 flex flex-col gap-2.5 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {promises.map((p, i) => (
              <li
                key={p}
                className="flex animate-rise items-center gap-2 text-[0.9rem] font-medium text-ink"
                style={delay(760 + i * 80)}
              >
                <Check className="text-greenDeep" />
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-6 animate-rise text-[0.92rem] text-body" style={delay(1040)}>
            Not ready to talk?{" "}
            <PlaybookLink>Get the free {PLAYBOOK_PAGES}-page playbook</PlaybookLink>
          </p>
        </div>

        <div className="animate-rise" style={delay(420)}>
          <div className="lg:animate-float">
            <TeardownPreview />
          </div>
        </div>
      </div>

      {/* Platforms — a plain statement of what we work in, not a logo wall */}
      <div className="shell mt-16 md:mt-24">
        <div className="flex flex-col gap-4 border-y border-line py-6 md:flex-row md:items-center md:gap-10">
          <span className="eyebrow shrink-0">Platforms we build on</span>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2.5">
            {["Meta Ads", "Google Ads", "Shopify", "Klaviyo", "GA4", "HubSpot", "Next.js"].map((p) => (
              <li
                key={p}
                className="font-display text-[1rem] font-semibold tracking-tighter2 text-ink/70 transition-colors duration-300 hover:text-ink"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
