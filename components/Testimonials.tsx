"use client";

import { Reveal, SectionHead, Stagger, StaggerItem, type HeadCopy } from "./Primitives";
import type { Testimonial } from "@/lib/content/defaults";

/**
 * Client testimonials. Added, edited, published and removed in the dashboard
 * (Website content → Testimonials). Only published ones reach this component,
 * and with none published the section is left out entirely, so the site never
 * shows an empty or half-finished testimonial area.
 */
function Quote({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="22" viewBox="0 0 26 20" fill="none" aria-hidden className={className}>
      <path
        d="M0 20V11.6C0 5.2 3.4 1.3 10.1 0l1 2.7C7 4 5 6 5 8.6h4.6V20H0Zm15 0v-8.4C15 5.2 18.4 1.3 25.1 0l1 2.7C22 4 20 6 20 8.6h4.6V20H15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Featured({ t }: { t: Testimonial }) {
  return (
    <figure className="on-dark relative overflow-hidden rounded-slab bg-ink p-8 text-white md:p-12">
      <Quote className="text-green" />
      <blockquote className="mt-6 max-w-4xl font-display text-[1.7rem] font-extrabold leading-[1.12] tracking-tightest sm:text-[2.3rem]">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3.5 border-t border-lineDark pt-6">
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[0.85rem] font-bold text-ink">
          {initials(t.name)}
        </span>
        <span>
          <span className="block font-semibold text-white">{t.name}</span>
          {t.role && <span className="mt-0.5 block text-[0.9rem] text-ash">{t.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="card card-hover flex h-full flex-col p-7">
      <Quote className="text-green" />
      <blockquote className="mt-5 text-[1rem] leading-relaxed text-ink">{t.quote}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5 [margin-top:1.5rem]">
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[0.8rem] font-bold text-white">
          {initials(t.name)}
        </span>
        <span className="min-w-0">
          <span className="block text-[0.95rem] font-semibold text-ink">{t.name}</span>
          {t.role && <span className="block text-[0.84rem] leading-snug text-mute">{t.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({
  copy,
  testimonials,
}: {
  copy: HeadCopy;
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;
  const [first, ...rest] = testimonials;

  return (
    <section id="testimonials" className="section bg-mist">
      <div className="shell">
        <SectionHead eyebrow="Testimonials" title={copy.title} accent={copy.accent} />

        <Reveal delay={0.08} scale={0.98} className="mt-12">
          <Featured t={first} />
        </Reveal>

        {rest.length > 0 && (
          <Stagger
            className={`mt-4 grid gap-4 ${
              rest.length === 1 ? "" : rest.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {rest.map((t) => (
              <StaggerItem key={t.id}>
                <Card t={t} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
