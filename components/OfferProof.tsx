import { CASE_STUDY_URL } from "@/lib/site";

/**
 * Proof for the offer page. Uses ONLY the real Kings Food Mart result — no
 * invented quotes or numbers. As Synergox collects more real results, add
 * them here.
 */
export default function OfferProof() {
  return (
    <section className="section">
      <div className="shell max-w-3xl">
        <p className="eyebrow">Real work, real reaction</p>
        <h2 className="h-section mt-5">What it looks like when the build lands.</h2>

        <figure className="on-dark mt-10 rounded-slab bg-ink p-8 text-white md:p-11">
          <span className="inline-flex items-center gap-2 rounded-full bg-green px-3.5 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink">
            Verified client
          </span>
          <blockquote className="mt-6 font-display text-[1.6rem] font-extrabold leading-[1.15] tracking-tightest md:text-[2rem]">
            &ldquo;It blew her mind — the brand finally looked like what
            she&apos;d built.&rdquo;
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3.5 border-t border-lineDark pt-6">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-display text-[1rem] font-extrabold text-ink"
            >
              K
            </span>
            <span>
              <span className="block font-semibold text-white">Owner, Kings Food Mart</span>
              <span className="block text-[0.88rem] text-ash">
                Full storefront built and shipped ·{" "}
                <a href={CASE_STUDY_URL} target="_blank" rel="noopener noreferrer" className="link">
                  see it live
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </span>
            </span>
          </figcaption>
        </figure>

        <p className="mt-5 text-[0.88rem] text-mute">
          More client results are added here as we&apos;re cleared to share them.
        </p>
      </div>
    </section>
  );
}
