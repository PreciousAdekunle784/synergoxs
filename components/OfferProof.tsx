"use client";

import { motion } from "framer-motion";

/**
 * Proof for the offer page. Uses ONLY the real Kings Food Mart result — no
 * invented quotes or numbers (same rule as components/Trust.tsx). As Synergox
 * collects more real results, add them here.
 */
export default function OfferProof() {
  return (
    <section className="border-t border-hair py-20 md:py-28">
      <div className="shell max-w-2xl">
        <p className="eyebrow text-signal">Real work, real reaction</p>
        <h2 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink md:text-[2.6rem]">
          What it looks like when the system lands.
        </h2>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 rounded-slab border border-hair bg-panel p-8 shadow-lift md:p-10"
        >
          <div className="flex items-center gap-1 text-signal">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="17" height="17" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
              </svg>
            ))}
          </div>

          <blockquote className="mt-6 font-display text-[1.5rem] font-semibold leading-snug tracking-tighter2 text-ink md:text-[1.75rem]">
            &ldquo;It blew her mind — the brand finally looked like what
            she&apos;d built.&rdquo;
          </blockquote>

          <figcaption className="mt-6 flex items-center gap-3 border-t border-hair pt-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-signal/30 bg-signal/[0.08] font-display text-[0.95rem] font-extrabold text-signal">
              K
            </span>
            <span>
              <span className="block text-[0.95rem] font-semibold text-ink">
                Owner, Kings Food Mart
              </span>
              <span className="block text-[0.85rem] text-inkFaint">
                Full storefront built &amp; shipped ·{" "}
                <a
                  href="https://kingsfoodstoreabuja.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inkMute underline decoration-hair underline-offset-2 hover:text-ink"
                >
                  kingsfoodstoreabuja.com.ng
                </a>
              </span>
            </span>
          </figcaption>
        </motion.figure>

        <p className="mt-6 text-center text-[0.85rem] text-inkFaint">
          More client results are added here as we&apos;re cleared to share them.
        </p>
      </div>
    </section>
  );
}
