"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * Dashboard charts. Plain SVG, no chart library.
 *
 * One series per chart (so no legend: the card title names it), one axis,
 * thin bars with a rounded data-end, hairline grid, a tooltip on hover or
 * keyboard focus, and a table view so no value is only reachable by hovering.
 * The bar colour is the brand's deep green, checked with the palette
 * validator for contrast against white.
 */
const BAR = "#007A35";
const BAR_ACTIVE = "#0A0C0A";
const GRID = "#E3E6E1";

type Point = { day: string; value: number };

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const asDate = (day: string) => new Date(`${day}T00:00:00Z`);

/** A clean axis maximum and step for small whole numbers. */
function niceScale(max: number) {
  if (max <= 4) return { top: 4, step: 1 };
  const rough = max / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough && Number.isInteger(s)) ?? Math.ceil(rough);
  return { top: Math.ceil(max / step) * step, step };
}

/** Top corners rounded, baseline square. */
function barPath(x: number, y: number, w: number, h: number) {
  if (h <= 0) return "";
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

export function ColumnChart({
  data,
  unit,
  height = 220,
  emptyNote,
}: {
  data: Point[];
  /** e.g. ["lead", "leads"] */
  unit: [string, string];
  height?: number;
  emptyNote?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const id = useId();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { top, step } = useMemo(() => niceScale(Math.max(0, ...data.map((d) => d.value))), [data]);
  const total = useMemo(() => data.reduce((a, d) => a + d.value, 0), [data]);

  const m = { top: 10, right: 6, bottom: 26, left: 30 };
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const slot = iw / Math.max(1, data.length);
  const bw = Math.max(1.5, Math.min(24, slot - 2));
  const y = (v: number) => m.top + ih - (v / top) * ih;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);

  // A handful of date labels, never one per bar.
  const every = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 76))));
  const cur = active !== null ? data[active] : null;
  const plural = (n: number) => `${n.toLocaleString("en-GB")} ${n === 1 ? unit[0] : unit[1]}`;

  const onKey = (e: React.KeyboardEvent) => {
    if (!data.length) return;
    if (e.key === "ArrowRight") { e.preventDefault(); setActive((a) => Math.min(data.length - 1, (a ?? -1) + 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => Math.max(0, (a ?? data.length) - 1)); }
    if (e.key === "Escape") setActive(null);
  };

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setTable((v) => !v)}
          aria-pressed={table}
          aria-controls={`${id}-view`}
          className="text-[0.8rem] font-medium text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {table ? "Show chart" : "Show as table"}
        </button>
      </div>

      <div id={`${id}-view`}>
        {table ? (
          <div className="max-h-[260px] overflow-y-auto rounded-xl border border-line" tabIndex={0}>
            <table className="w-full text-left text-[0.88rem]">
              <thead className="sticky top-0 bg-mist">
                <tr>
                  <th scope="col" className="px-4 py-2 font-semibold text-ink">Day</th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold capitalize text-ink">{unit[1]}</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((d) => (
                  <tr key={d.day} className="border-t border-line">
                    <td className="px-4 py-2 text-body">{longFmt.format(asDate(d.day))}</td>
                    <td className="num px-4 py-2 text-right font-medium text-ink">{d.value.toLocaleString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            ref={wrap}
            className="relative w-full min-w-0 overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-greenDeep"
            tabIndex={0}
            role="group"
            aria-label={`${plural(total)} over ${data.length} days. Use the arrow keys to read each day.`}
            onKeyDown={onKey}
            onFocus={() => setActive((a) => a ?? data.length - 1)}
            onBlur={() => setActive(null)}
            onPointerLeave={() => setActive(null)}
          >
            <svg width={width} height={height} role="img" aria-hidden className="block">
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
                  <text x={m.left - 8} y={y(t) + 4} textAnchor="end" className="num fill-mute text-[11px]">
                    {t}
                  </text>
                </g>
              ))}
              {data.map((d, i) => {
                const x = m.left + i * slot + (slot - bw) / 2;
                const h = (d.value / top) * ih;
                return (
                  <g key={d.day}>
                    <path
                      d={barPath(x, y(d.value), bw, h)}
                      fill={active === i ? BAR_ACTIVE : BAR}
                      style={{ transition: "fill 120ms ease" }}
                    />
                    {(i % every === 0 || i === data.length - 1) && (data.length - 1 - i >= every / 2 || i === data.length - 1) && (
                      <text x={m.left + i * slot + slot / 2} y={height - 7} textAnchor={i === data.length - 1 ? "end" : i === 0 ? "start" : "middle"} className="fill-mute text-[11px]">
                        {dayFmt.format(asDate(d.day))}
                      </text>
                    )}
                    {/* Hit area: the whole column, not just the painted bar */}
                    <rect
                      x={m.left + i * slot}
                      y={m.top}
                      width={slot}
                      height={ih}
                      fill="transparent"
                      onPointerEnter={() => setActive(i)}
                      onPointerDown={() => setActive(i)}
                    />
                  </g>
                );
              })}
            </svg>

            {total === 0 && (
              <p className="pointer-events-none absolute inset-x-0 top-[38%] text-center text-[0.9rem] text-mute">
                {emptyNote ?? `No ${unit[1]} in this period yet.`}
              </p>
            )}

            {cur && active !== null && (
              <div
                role="status"
                className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-2 text-white shadow-lift"
                style={{
                  left: Math.min(Math.max(m.left + active * slot + slot / 2, 70), width - 70),
                  top: Math.max(0, y(cur.value) - 58),
                }}
              >
                <span className="block text-[0.95rem] font-semibold leading-tight">{plural(cur.value)}</span>
                <span className="block text-[0.76rem] text-ash">{longFmt.format(asDate(cur.day))}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Ranked horizontal bars: one hue, value at the tip, label always in text. */
export function BarList({
  rows,
  emptyNote = "Nothing to show yet.",
}: {
  rows: { label: string; value: number; href?: string }[];
  emptyNote?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length || rows.every((r) => r.value === 0)) {
    return <p className="py-6 text-center text-[0.9rem] text-mute">{emptyNote}</p>;
  }
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const label = r.href ? (
          <a href={r.href} className="truncate underline-offset-4 hover:underline">{r.label}</a>
        ) : (
          <span className="truncate">{r.label}</span>
        );
        return (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-3 text-[0.9rem]">
              <span className="flex min-w-0 text-body">{label}</span>
              <span className="num shrink-0 font-semibold text-ink">{r.value.toLocaleString("en-GB")}</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full" aria-hidden>
              <div
                className="h-full rounded-r-[4px]"
                style={{ width: `${Math.max(r.value > 0 ? 1.5 : 0, (r.value / max) * 100)}%`, background: BAR }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
