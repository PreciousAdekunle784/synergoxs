export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <section className="pb-28 pt-[132px] md:pb-32 md:pt-[160px]">
      <div className="shell max-w-3xl">
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-signal" />
          <span className="eyebrow">Legal</span>
        </div>
        <h1 className="h-display mt-7 text-[2.6rem] text-ink sm:text-[3.2rem]">
          {title}
        </h1>
        <p className="mt-5 font-mono text-[0.78rem] text-inkFaint">
          Last updated {updated}
        </p>

        <div className="mt-14 space-y-12">
          {sections.map((s, i) => (
            <div key={s.h}>
              <div className="flex items-baseline gap-4">
                <span className="num text-[0.7rem] text-inkFaint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-[1.4rem] font-extrabold tracking-tightest text-ink">
                  {s.h}
                </h2>
              </div>
              <div className="mt-4 space-y-4 pl-0 sm:pl-10">
                {s.p.map((para, j) => (
                  <p key={j} className="text-[0.98rem] leading-relaxed text-inkMute">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 rounded-xl border border-hair bg-panel p-6 text-[0.85rem] leading-relaxed text-inkFaint">
          This document is a starting template, not legal advice. Have a
          qualified lawyer review it against your jurisdiction and how you
          actually handle data before you publish it.
        </p>
      </div>
    </section>
  );
}
