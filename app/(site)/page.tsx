import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content/get";
import { BLUEPRINT_PAGES, BLUEPRINT_SUBTITLE, BLUEPRINT_TITLE } from "@/lib/site";
import Eyebrow from "@/components/Eyebrow";
import { Lock } from "@/components/Icons";
import { Reveal, SectionHead, Stagger, StaggerItem } from "@/components/Primitives";
import OptInForm from "@/components/funnel/OptInForm";
import GuideMockup from "@/components/funnel/GuideMockup";

/** Re-checked at most every five minutes, and immediately when the dashboard saves a change. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "The Business Growth Blueprint — free guide from SYNERGOX" },
  description:
    "Your business could be losing customers you already paid to attract. Get the free 24-page Business Growth Blueprint: find the marketing and conversion problems costing you revenue, and learn how to build a system that fixes them.",
  alternates: { canonical: "/" },
};

/* The six chapters of the guide, with the page each one starts on. */
const chapters = [
  {
    page: "04",
    title: "Why your marketing isn't producing results",
    text: "Marketing is a chain, not a list of activities. See how one weak stage hides behind the others, and how to find yours in ten minutes with three numbers.",
  },
  {
    page: "07",
    title: "Why website visitors don't become customers",
    text: "The five-second test every page has to pass, and the five reasons a page collects visits without ever collecting enquiries.",
  },
  {
    page: "10",
    title: "How a weak offer caps your conversions",
    text: "Why no advert can rescue an offer people aren't sure about, the four parts of one they act on, and a fill-in rewrite of your own.",
  },
  {
    page: "13",
    title: "Where your customer acquisition process is broken",
    text: "The three handovers where paid-for prospects get dropped, what to send after someone enquires, and the one number that settles budget arguments.",
  },
  {
    page: "16",
    title: "How websites, ads, landing pages and optimization work together",
    text: "What each part is actually for, why the gaps between them cost more than the parts, and the order to build them in.",
  },
  {
    page: "19",
    title: "What to do about it in the next thirty days",
    text: "A week-by-week plan you can run without a bigger budget, a 12-point scorecard, and a worksheet for your own numbers.",
  },
];

const audiences = [
  { who: "Business owners", line: "You sign off the marketing budget every month and still can't say what it produced." },
  { who: "Founders", line: "You built something good. Now you need a repeatable way to put it in front of buyers." },
  { who: "E-commerce businesses", line: "The visitors are arriving. Too many of them leave with nothing in the basket." },
  { who: "Service-based businesses", line: "Enquiries come from referrals and luck, and you'd like a third source." },
  { who: "Growing companies", line: "What worked at ten customers a month has stopped working at fifty." },
  { who: "Entrepreneurs stuck on acquisition", line: "You've tried freelancers, agencies and doing it yourself. The numbers haven't moved." },
];

const previews = [
  { src: "/blueprint/page-05.jpg", page: "05", title: "The maths of a leaking funnel" },
  { src: "/blueprint/page-09.jpg", page: "09", title: "The order a converting page is built in" },
  { src: "/blueprint/page-12.jpg", page: "12", title: "Rewrite your offer in four lines" },
  { src: "/blueprint/page-20.jpg", page: "20", title: "The Growth System Scorecard" },
];

const facts = [
  [`${BLUEPRINT_PAGES}`, "pages"],
  ["6", "chapters"],
  ["12", "point scorecard"],
  ["20", "minute read"],
];

export default async function OptInPage() {
  const { copy } = await getContent();

  return (
    <>
      {/* ── 1. Hero: the promise, the guide, the form ── */}
      <section className="relative overflow-hidden pb-16 pt-[100px] md:pb-24 md:pt-[124px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-mist to-paper" />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div>
            <div className="animate-rise">
              <Eyebrow>
                {copy["optin.eyebrow"]} · {BLUEPRINT_PAGES} pages
              </Eyebrow>
            </div>
            <h1 className="h-display mt-6 text-[2.75rem] sm:text-[3.7rem] lg:text-[4rem] xl:text-[4.5rem]">
              <span className="line-mask">
                <span>{copy["optin.headline"]}</span>
              </span>
              <span className="line-mask">
                <span className="accent accent-green [animation-delay:0.12s]">{copy["optin.accent"]}</span>
              </span>
            </h1>
            <p className="lede mt-7 max-w-xl animate-rise [animation-delay:0.25s]">{copy["optin.sub"]}</p>

            <div className="mt-8 max-w-xl animate-rise [animation-delay:0.35s]">
              <OptInForm cta={copy["optin.cta"]} id="hero" />
            </div>
          </div>

          <div className="lg:pl-4">
            <GuideMockup priority />
          </div>
        </div>

        {/* what it is, in figures */}
        <div className="shell relative mt-14 md:mt-20">
          <dl className="grid grid-cols-2 border-y border-ink/15 md:grid-cols-4">
            {facts.map(([n, label], i) => (
              <div
                key={label}
                className={`flex items-baseline gap-3 px-1 py-5 md:px-6 ${i % 2 ? "border-l border-ink/15 pl-5" : ""} ${
                  i > 1 ? "border-t border-ink/15 md:border-t-0" : ""
                } ${i === 2 ? "md:border-l" : ""} ${i === 0 ? "md:pl-0" : ""}`}
              >
                <dt className="order-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mute">{label}</dt>
                <dd className="num font-display text-[2.1rem] font-extrabold leading-none text-ink" style={{ fontStretch: "80%" }}>
                  {n}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 2. What they'll discover: the guide's own contents page ── */}
      <section className="section" aria-labelledby="discover-h">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>Inside the Blueprint</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="discover-h" className="h-section mt-5">
                {copy["discover.title"]} <span className="accent accent-green">{copy["discover.accent"]}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6">
                Each chapter takes one reason customers slip away and ends with something you can fix this week,
                without hiring anyone.
              </p>
            </Reveal>
          </div>

          <Stagger as="ol" className="border-t-2 border-ink">
            {chapters.map((c, i) => (
              <StaggerItem
                as="li"
                key={c.page}
                className="group relative grid grid-cols-[auto_1fr] gap-x-5 border-b border-ink/15 py-6 transition-colors duration-300 hover:bg-mist sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-6 sm:px-4 sm:py-7"
              >
                <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-green transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-mute sm:pt-1.5">
                  Ch. {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[1.32rem] font-extrabold leading-[1.08] text-ink sm:text-[1.55rem]" style={{ fontStretch: "86%", letterSpacing: "-0.015em" }}>
                    {c.title}
                  </h3>
                  <p className="mt-2.5 max-w-xl text-[0.98rem] leading-relaxed text-body">{c.text}</p>
                </div>
                <span className="num hidden font-mono text-[0.74rem] uppercase tracking-[0.12em] text-mute sm:block sm:pt-1.5">
                  p. {c.page}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 3. Who this is for ── */}
      <section aria-labelledby="who-h" className="pb-20 md:pb-28">
        <div className="slab-dark on-dark bg-grid px-6 py-16 sm:px-10 md:py-24">
          <div className="mx-auto max-w-shell">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow>Who it's for</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 id="who-h" className="h-section mt-5">
                  {copy["who.title"]} <span className="accent accent-green">{copy["who.accent"]}</span>
                </h2>
              </Reveal>
            </div>

            <Stagger className="mt-12 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((a) => (
                <StaggerItem key={a.who} className="border-b border-r border-white/15 p-6 transition-colors duration-300 hover:bg-white/[0.04] sm:p-8">
                  <span aria-hidden className="block h-2 w-2 bg-green" />
                  <h3 className="mt-5 font-display text-[1.3rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "82%" }}>
                    {a.who}
                  </h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-ash">{a.line}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-[0.95rem] leading-relaxed text-ash">
                <span className="font-semibold text-white">Not for:</span> anyone looking for a trick that doubles
                sales by Friday. The Blueprint is about finding what's broken and fixing it properly.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. Free resource preview: real pages ── */}
      <section className="bg-mist py-20 md:py-28" aria-labelledby="preview-h">
        <div className="shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead
              eyebrow="A look inside"
              title="Real pages from the guide."
              accent="Nothing blurred."
              lede={`“${BLUEPRINT_TITLE}” is a working document, not a brochure. It has tables to fill in, a scorecard to score and a plan to follow.`}
            />
          </div>

          <Stagger className="-mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
            {previews.map((p, i) => (
              <StaggerItem key={p.page} className="w-[68vw] max-w-[300px] shrink-0 snap-center lg:w-auto lg:max-w-none">
                <figure className="group">
                  <div
                    className={`border border-ink/10 bg-paper shadow-card transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-doc ${
                      i % 2 ? "lg:translate-y-6 lg:group-hover:translate-y-4" : ""
                    }`}
                  >
                    <Image
                      src={p.src}
                      alt={`Page ${p.page} of ${BLUEPRINT_TITLE}: ${p.title}`}
                      width={596}
                      height={842}
                      sizes="(max-width: 1024px) 68vw, 280px"
                      className="block h-auto w-full"
                    />
                  </div>
                  <figcaption className={`mt-4 ${i % 2 ? "lg:mt-10" : ""}`}>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">Page {p.page}</span>
                    <span className="mt-1 block text-[0.95rem] font-semibold leading-snug text-ink">{p.title}</span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 5. Final opt-in ── */}
      <section id="get" className="section scroll-mt-24" aria-labelledby="final-h">
        <div className="shell">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow center>Free · {BLUEPRINT_PAGES}-page PDF</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="final-h" className="h-display mt-6 text-[2.5rem] sm:text-[3.6rem] lg:text-[4.3rem]">
                {copy["optinFinal.title"]} <span className="accent accent-green">{copy["optinFinal.accent"]}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mx-auto mt-6 max-w-xl">{copy["optinFinal.sub"]}</p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-10 max-w-2xl border border-ink bg-paper p-6 text-left shadow-lift sm:p-9">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mute">Where should we send it?</p>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-body">{BLUEPRINT_SUBTITLE}</p>
              <div className="mt-6">
                <OptInForm cta={copy["optin.cta"]} id="final" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 text-[0.9rem] leading-relaxed text-body">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-ink/15 text-ink">
                <Lock />
              </span>
              <p>
                <strong className="font-semibold text-ink">Your details stay with us.</strong> We use your email to
                send the Blueprint and the emails described above. We don't sell it, rent it or pass it on, and
                every email we send has a one-click unsubscribe.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
