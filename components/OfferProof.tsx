import type { Testimonial } from "@/lib/content/defaults";

/**
 * Proof on the offer page: the first published testimonial from the
 * dashboard. With none published, this section is left out.
 */
export default function OfferProof({ testimonial }: { testimonial?: Testimonial }) {
  if (!testimonial) return null;
  return (
    <section className="section">
      <div className="shell max-w-3xl">
        <p className="eyebrow">Real work, real reaction</p>
        <h2 className="h-section mt-5">What it looks like when the build lands.</h2>

        <figure className="on-dark mt-10 rounded-slab bg-ink p-8 text-white md:p-11">
          <blockquote className="font-display text-[1.6rem] font-extrabold leading-[1.15] tracking-tightest md:text-[2rem]">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3.5 border-t border-lineDark pt-6">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-display text-[1rem] font-extrabold text-ink"
            >
              {testimonial.name.trim().charAt(0).toUpperCase()}
            </span>
            <span>
              <span className="block font-semibold text-white">{testimonial.name}</span>
              {testimonial.role && <span className="block text-[0.88rem] text-ash">{testimonial.role}</span>}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
