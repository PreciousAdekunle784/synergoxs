/**
 * The hero image for the sales page: the three things SYNERGOX builds, drawn
 * as three working surfaces threaded onto one line that ends at a customer.
 *
 * The panels are illustrative interfaces, not screenshots of client results:
 * they carry no figures, only structure.
 */
// Drawn in a 560 × 560 box. The line leaves the right edge of the website,
// passes behind the campaigns panel, then behind the funnel, and runs out
// along the bottom to the customer. The panels sit on top of it.
const PATH =
  "M 330 122 C 420 122, 456 150, 456 230 L 456 330 C 456 410, 380 436, 292 436 C 176 436, 168 526, 300 526 L 468 526";

function Tag({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="bg-ink px-1.5 py-1 font-mono text-[0.58rem] font-medium leading-none tracking-[0.1em] text-green">{n}</span>
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-mute">{children}</span>
    </div>
  );
}

const bar = "block h-[5px] rounded-[1px] bg-ink/10";

export default function SystemVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden>
      <div className="absolute inset-[4%] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(0,197,81,0.2),rgba(0,197,81,0.05)_55%,transparent)] blur-2xl" />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(closest-side,black_55%,transparent)]" />

      {/* the line everything hangs on */}
      <svg viewBox="0 0 560 560" fill="none" className="absolute inset-0 h-full w-full">
        <path d={PATH} stroke="#0a0c0a" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
        <path
          d={PATH}
          pathLength={1}
          stroke="#00c551"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1"
          className="animate-draw [animation-delay:0.5s] [animation-duration:2.4s]"
        />
        <circle cx="330" cy="122" r="5" fill="#0a0c0a" />
        <circle r="6" fill="#0a0c0a" stroke="#00c551" strokeWidth="3" opacity="0" className="motion-reduce:hidden">
          <set attributeName="opacity" to="1" begin="2.8s" fill="freeze" />
          <animateMotion dur="7s" begin="2.8s" repeatCount="indefinite" path={PATH} />
        </circle>
      </svg>

      {/* 01 — the website */}
      <div className="absolute left-0 top-[2%] w-[59%] animate-rise [animation-delay:0.15s]">
        <Tag n="01">Website</Tag>
        <div className="border border-ink bg-paper shadow-lift">
          <div className="flex items-center gap-1.5 border-b border-ink/15 px-2.5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
            <span className="ml-2 h-3 flex-1 rounded-[2px] bg-mist" />
          </div>
          <div className="grid grid-cols-[1.25fr_1fr] gap-3 p-3.5">
            <div>
              <span className="block h-[9px] w-[92%] bg-ink" />
              <span className="mt-1.5 block h-[9px] w-[64%] bg-ink" />
              <span className={`${bar} mt-3 w-full`} />
              <span className={`${bar} mt-1.5 w-[80%]`} />
              <span className="mt-3.5 flex h-[18px] w-[58%] items-center justify-between bg-green px-1.5">
                <span className="h-[3px] w-[55%] bg-ink/70" />
                <span className="h-[7px] w-[7px] bg-ink" />
              </span>
            </div>
            <div className="bg-[linear-gradient(135deg,#eef0ec,#dfe3dc)]">
              <div className="flex h-full min-h-[70px] items-end p-1.5">
                <span className="h-[3px] w-1/2 bg-ink/25" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-ink/10 px-3.5 py-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <span className="block h-[5px] w-3/4 bg-ink/60" />
                <span className={`${bar} mt-1.5 w-full`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 — acquisition */}
      <div className="absolute right-0 top-[37%] w-[44%] animate-rise [animation-delay:0.4s]">
        <Tag n="02">Acquisition</Tag>
        <div className="on-dark border border-ink bg-ink p-3.5 text-white shadow-lift">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ash">Campaigns</span>
            <span className="flex items-center gap-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-green">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-green" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-green" />
              </span>
              Live
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              ["Meta", "78%"],
              ["Google", "56%"],
            ].map(([name, w]) => (
              <div key={name} className="grid grid-cols-[3.2rem_1fr] items-center gap-2">
                <span className="font-mono text-[0.6rem] text-white">{name}</span>
                <span className="h-[7px] bg-white/10">
                  <span className="block h-full origin-left animate-grow bg-green [animation-delay:1.2s]" style={{ width: w }} />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex h-[46px] items-end gap-[5px] border-t border-white/10 pt-3">
            {[30, 42, 38, 55, 50, 68, 62, 80, 76, 94].map((h, i) => (
              <span key={i} className={`flex-1 ${i > 6 ? "bg-green" : "bg-white/25"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* 03 — conversion */}
      <div className="absolute left-[3.5%] top-[62%] w-[48.5%] animate-rise [animation-delay:0.65s]">
        <Tag n="03">Conversion</Tag>
        <div className="border border-ink bg-paper p-3.5 shadow-lift">
          {[
            ["Visit", "100%", false],
            ["Enquire", "64%", false],
            ["Buy", "38%", true],
          ].map(([label, w, hot]) => (
            <div key={label as string} className="mb-2 grid grid-cols-[3.4rem_1fr] items-center gap-2 last:mb-0">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-mute">{label}</span>
              <span className="h-[13px] bg-mist">
                <span className={`block h-full ${hot ? "bg-green" : "bg-ink"}`} style={{ width: w as string }} />
              </span>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-2 border-t border-ink/10 pt-2.5">
            <span className="border border-ink/20 px-1.5 py-1 font-mono text-[0.56rem] leading-none text-mute">A</span>
            <span className="border border-ink bg-ink px-1.5 py-1 font-mono text-[0.56rem] leading-none text-green">B</span>
            <span className={`${bar} flex-1`} />
          </div>
        </div>
      </div>

      {/* where the line ends */}
      <div className="absolute left-[83.6%] top-[93.9%] flex -translate-y-1/2 animate-fade items-center gap-2.5 [animation-delay:2.2s]">
        <span className="relative -ml-[18px] flex h-9 w-9 shrink-0 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-green" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-green text-ink">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M3.5 8l3 3 5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        <span className="hidden whitespace-nowrap border border-ink bg-paper px-2 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink min-[420px]:block">Customer</span>
      </div>
    </div>
  );
}
