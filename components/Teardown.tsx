"use client";

import { useMemo, useState } from "react";
import BookCTA from "./BookCTA";
import { motion } from "framer-motion";
import Link from "next/link";
import { Reveal, SectionHead } from "./Primitives";

/* Benchmarks are stated as targets, not promises. */
const TARGET = { toLead: 0.15, toCall: 0.3, toClose: 0.25 };

type Cur = "USD" | "NGN";
const CUR: Record<Cur, { sym: string; mult: number; locale: string }> = {
  USD: { sym: "$", mult: 1, locale: "en-US" },
  NGN: { sym: "₦", mult: 1500, locale: "en-NG" },
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[0.85rem] text-inkMute" htmlFor={label}>
          {label}
        </label>
        <span className="num text-[0.92rem] font-medium text-ink">
          {format(value)}
        </span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
        aria-label={label}
      />
    </div>
  );
}

export default function Teardown() {
  const [cur, setCur] = useState<Cur>("USD");
  const m = CUR[cur].mult;

  const [spendBase, setSpendBase] = useState(4000);
  const [cpcBase, setCpcBase] = useState(1.2);
  const [toLead, setToLead] = useState(6);
  const [toCall, setToCall] = useState(18);
  const [toClose, setToClose] = useState(20);
  const [valueBase, setValueBase] = useState(600);

  const money = (n: number) =>
    `${CUR[cur].sym}${Math.round(n).toLocaleString(CUR[cur].locale)}`;

  const r = useMemo(() => {
    const spend = spendBase * m;
    const cpc = cpcBase * m;
    const val = valueBase * m;

    const visitors = spend / cpc;
    const leads = visitors * (toLead / 100);
    const calls = leads * (toCall / 100);
    const customers = calls * (toClose / 100);
    const revenue = customers * val;
    const cac = customers > 0 ? spend / customers : 0;
    const roas = spend > 0 ? revenue / spend : 0;

    /* Which single stage is furthest below target, weighted by what it unlocks */
    const gaps = [
      {
        key: "toLead",
        name: "Visitor → lead",
        current: toLead / 100,
        target: TARGET.toLead,
      },
      {
        key: "toCall",
        name: "Lead → booked call",
        current: toCall / 100,
        target: TARGET.toCall,
      },
      {
        key: "toClose",
        name: "Call → customer",
        current: toClose / 100,
        target: TARGET.toClose,
      },
    ].map((g) => ({
      ...g,
      lift: g.current > 0 ? Math.max(0, g.target / g.current - 1) : 0,
    }));

    const worst = gaps.reduce((a, b) => (b.lift > a.lift ? b : a));

    const fixed = {
      toLead: worst.key === "toLead" ? TARGET.toLead : toLead / 100,
      toCall: worst.key === "toCall" ? TARGET.toCall : toCall / 100,
      toClose: worst.key === "toClose" ? TARGET.toClose : toClose / 100,
    };
    const fixedCustomers =
      visitors * fixed.toLead * fixed.toCall * fixed.toClose;
    const fixedRevenue = fixedCustomers * val;
    const fixedCac = fixedCustomers > 0 ? spend / fixedCustomers : 0;

    return {
      spend,
      visitors,
      leads,
      calls,
      customers,
      revenue,
      cac,
      roas,
      worst,
      fixedCustomers,
      fixedRevenue,
      fixedCac,
      gainMonthly: fixedRevenue - revenue,
      gainYearly: (fixedRevenue - revenue) * 12,
      hasGap: worst.lift > 0.001,
      val,
    };
  }, [spendBase, cpcBase, toLead, toCall, toClose, valueBase, m]);

  const funnelRows = [
    { name: "Visitors", v: r.visitors, kept: 1 },
    { name: "Leads", v: r.leads, kept: toLead / 100, stage: "toLead" },
    { name: "Booked calls", v: r.calls, kept: toCall / 100, stage: "toCall" },
    { name: "Customers", v: r.customers, kept: toClose / 100, stage: "toClose" },
  ];

  return (
    <section id="teardown" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHead
          eyebrow="Objection: prove you understand my business"
          title={
            <>
              Sixty seconds{" "}
              <span className="text-inkFaint">
                to the most expensive number in your business.
              </span>
            </>
          }
          lede="Move the sliders until they roughly match your business. The model finds the single stage bleeding the most, then prices what closing that one alone would be worth — on the traffic and the budget you already have."
        />

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-slab border border-hair bg-hair shadow-lift lg:grid-cols-[0.85fr_1.15fr]">
            {/* Inputs */}
            <div className="bg-panel p-8 md:p-10">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Your numbers</p>
                <div className="flex rounded-full border border-hair p-0.5">
                  {(["USD", "NGN"] as Cur[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCur(c)}
                      className={`rounded-full px-3 py-1 font-mono text-[0.7rem] transition-colors ${
                        cur === c
                          ? "bg-signal text-void"
                          : "text-inkFaint hover:text-inkMute"
                      }`}
                      aria-pressed={cur === c}
                    >
                      {CUR[c].sym}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-7">
                <Slider
                  label="Monthly ad spend"
                  value={spendBase}
                  min={500}
                  max={40000}
                  step={250}
                  onChange={setSpendBase}
                  format={(n) => money(n * m)}
                />
                <Slider
                  label="Cost per click"
                  value={cpcBase}
                  min={0.2}
                  max={8}
                  step={0.1}
                  onChange={setCpcBase}
                  format={(n) =>
                    `${CUR[cur].sym}${(n * m).toLocaleString(CUR[cur].locale, {
                      maximumFractionDigits: cur === "NGN" ? 0 : 2,
                      minimumFractionDigits: cur === "NGN" ? 0 : 2,
                    })}`
                  }
                />
                <Slider
                  label="Visitors who become leads"
                  value={toLead}
                  min={1}
                  max={40}
                  step={0.5}
                  onChange={setToLead}
                  format={(n) => `${n}%`}
                />
                <Slider
                  label="Leads who book a call"
                  value={toCall}
                  min={2}
                  max={70}
                  step={1}
                  onChange={setToCall}
                  format={(n) => `${n}%`}
                />
                <Slider
                  label="Calls that close"
                  value={toClose}
                  min={2}
                  max={70}
                  step={1}
                  onChange={setToClose}
                  format={(n) => `${n}%`}
                />
                <Slider
                  label="Average customer value"
                  value={valueBase}
                  min={50}
                  max={10000}
                  step={50}
                  onChange={setValueBase}
                  format={(n) => money(n * m)}
                />
              </div>
            </div>

            {/* Output */}
            <div className="bg-pitch p-8 md:p-10">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { l: "Customers / mo", v: Math.round(r.customers).toLocaleString() },
                  { l: "Cost per customer", v: money(r.cac) },
                  { l: "Revenue / mo", v: money(r.revenue) },
                  { l: "ROAS", v: `${r.roas.toFixed(2)}×` },
                ].map((k) => (
                  <div key={k.l}>
                    <p className="eyebrow">{k.l}</p>
                    <p className="num mt-2 font-display text-[1.35rem] font-extrabold tracking-tighter2 text-ink sm:text-[1.5rem]">
                      {k.v}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cascade */}
              <div className="mt-10 space-y-4">
                {funnelRows.map((row, i) => {
                  const w = Math.max(
                    2,
                    (row.v / Math.max(r.visitors, 1)) * 100
                  );
                  const isLeak = r.hasGap && row.stage === r.worst.key;
                  return (
                    <div key={row.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex items-center gap-2 text-[0.85rem] text-inkMute">
                          {row.name}
                          {isLeak && (
                            <span className="rounded-full bg-bone/10 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-bone">
                              biggest leak
                            </span>
                          )}
                        </span>
                        <span className="num text-[0.85rem] text-ink">
                          {Math.round(row.v).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 h-[10px] overflow-hidden rounded-full bg-rail">
                        <motion.div
                          className={`h-full rounded-full ${
                            isLeak ? "bg-bone" : "bg-signal"
                          }`}
                          animate={{ width: `${w}%` }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          style={{ opacity: 1 - i * 0.12 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* The verdict */}
              <div className="mt-10 rounded-card border border-signal/25 bg-signal/[0.05] p-6">
                {r.hasGap ? (
                  <>
                    <p className="eyebrow text-signal">Here&apos;s where the money is</p>
                    <p className="mt-3 font-display text-[1.28rem] font-semibold leading-snug tracking-tighter2 text-ink">
                      Your weakest stage is{" "}
                      <span className="text-signal">{r.worst.name}</span>. Bring
                      it to {Math.round(r.worst.target * 100)}% and — without
                      buying a single extra visitor, on the same{" "}
                      {money(r.spend)} — you&apos;d add{" "}
                      <span className="text-signal">
                        {Math.round(r.fixedCustomers - r.customers).toLocaleString()}
                      </span>{" "}
                      customers a month. Every month.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-6 border-t border-signal/15 pt-5 sm:grid-cols-3">
                      <div>
                        <p className="eyebrow">New cost per customer</p>
                        <p className="num mt-1.5 text-[1.05rem] text-ink">
                          {money(r.fixedCac)}
                        </p>
                      </div>
                      <div>
                        <p className="eyebrow">Found revenue / mo</p>
                        <p className="num mt-1.5 text-[1.05rem] text-signal">
                          {money(r.gainMonthly)}
                        </p>
                      </div>
                      <div>
                        <p className="eyebrow">Over 12 months</p>
                        <p className="num mt-1.5 text-[1.05rem] text-signal">
                          {money(r.gainYearly)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-signal">Nothing obviously broken</p>
                    <p className="mt-3 font-display text-[1.28rem] font-semibold leading-snug tracking-tighter2 text-ink">
                      Every stage sits at or above the target range. From here
                      growth comes from volume and offer, not repair. That&apos;s
                      a different conversation — and a considerably better one to
                      be having.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <BookCTA
                  className="btn-signal shadow-press"
                  label="Get the free growth playbook"
                />
                <p className="text-[0.78rem] leading-relaxed text-inkFaint">
                  Targets are typical mid-range benchmarks, not a forecast. On
                  the call we throw them out and use your analytics instead.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
