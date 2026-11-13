import Eyebrow from "./Eyebrow";

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
    <section className="pb-24 pt-[120px] md:pb-28 md:pt-[156px]">
      <div className="shell max-w-3xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="h-display mt-5 text-[2.5rem] sm:text-[3.1rem]">{title}</h1>
        <p className="mt-4 text-[0.9rem] text-mute">Last updated {updated}</p>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <div key={s.h}>
              <div className="flex items-baseline gap-3.5">
                <span className="num text-[0.82rem] font-semibold text-greenDeep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-[1.4rem] font-extrabold tracking-tighter2 text-ink">
                  {s.h}
                </h2>
              </div>
              <div className="mt-3 space-y-4 sm:pl-9">
                {s.p.map((para, j) => (
                  <p key={j} className="text-[1rem] leading-relaxed text-body">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 rounded-card bg-mist p-6 text-[0.88rem] leading-relaxed text-mute">
          This document is a starting template, not legal advice. Have a
          qualified lawyer review it against your jurisdiction and how you
          actually handle data before you publish it.
        </p>
      </div>
    </section>
  );
}
