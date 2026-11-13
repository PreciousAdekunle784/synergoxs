"use client";

import { Reveal, SectionHead, Stagger, StaggerItem, type HeadCopy } from "./Primitives";
import { Check } from "./Icons";
import type { Project } from "@/lib/content/defaults";

/**
 * Case studies. Managed in the dashboard (Website content → Case studies).
 * The first published project is shown in full; any others follow as cards.
 * With nothing published, the whole section is left out.
 *
 * Project names are plain text. Nothing here links away from the site.
 */
function Story({ p }: { p: Project }) {
  const parts = [
    { k: "The problem", body: p.problem },
    { k: "What we built", body: p.solution },
    { k: "The outcome", body: p.outcome },
  ].filter((x) => x.body);

  return (
    <article className="overflow-hidden rounded-slab border border-line bg-paper shadow-card transition-shadow duration-500 hover:shadow-lift">
      <header className="p-7 md:p-10">
        <p className="eyebrow">Case study{p.sector ? ` · ${p.sector}` : ""}</p>
        <h3 className="mt-3 font-display text-[2rem] font-extrabold leading-none tracking-tightest text-ink sm:text-[2.5rem]">
          {p.client}
        </h3>
        {p.headline && (
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-body">{p.headline}</p>
        )}
      </header>

      {parts.length > 0 && (
        <div className={`grid border-t border-line ${parts.length === 3 ? "md:grid-cols-3" : parts.length === 2 ? "md:grid-cols-2" : ""}`}>
          {parts.map((s, i) => (
            <div
              key={s.k}
              className={`p-7 transition-colors duration-300 hover:bg-mist/70 md:p-9 ${
                i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""
              }`}
            >
              <p className="flex items-center gap-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-greenDeep">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                {s.k}
              </p>
              <p className="mt-4 text-[0.97rem] leading-relaxed text-body">{s.body}</p>
            </div>
          ))}
        </div>
      )}

      {p.facts.length > 0 && (
        <ul className="on-dark grid gap-x-8 gap-y-3 bg-ink px-7 py-6 text-white md:grid-cols-3 md:px-10">
          {p.facts.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[0.95rem] font-medium text-white">
              <Check className="mt-1 text-green" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <article className="card card-hover card-accent flex h-full flex-col p-7 md:p-8">
      {p.sector && <p className="eyebrow">{p.sector}</p>}
      <h3 className="mt-3 font-display text-[1.6rem] font-extrabold leading-tight tracking-tighter2 text-ink">
        {p.client}
      </h3>
      {p.headline && <p className="mt-3 text-[1rem] leading-relaxed text-body">{p.headline}</p>}
      {p.outcome && (
        <p className="mt-4 border-l-[3px] border-green pl-4 text-[0.95rem] leading-relaxed text-ink">
          {p.outcome}
        </p>
      )}
      {p.facts.length > 0 && (
        <ul className="mt-auto space-y-2 pt-6">
          {p.facts.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[0.9rem] text-body">
              <Check className="mt-1 text-greenDeep" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Proof({ copy, projects }: { copy: HeadCopy; projects: Project[] }) {
  if (projects.length === 0) return null;
  const [first, ...rest] = projects;

  return (
    <section id="results" className="section">
      <div className="shell">
        <SectionHead eyebrow="Results" title={copy.title} accent={copy.accent} lede={copy.lede} />

        <Reveal delay={0.1} scale={0.98} className="mt-12">
          <Story p={first} />
        </Reveal>

        {rest.length > 0 && (
          <Stagger className="mt-4 grid gap-4 md:grid-cols-2">
            {rest.map((p) => (
              <StaggerItem key={p.id}>
                <Card p={p} />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-[0.9rem] leading-relaxed text-mute">
            Performance data from current engagements is shared on the call,
            under NDA where clients require it. We don&apos;t publish numbers we
            can&apos;t back with a screenshot.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
