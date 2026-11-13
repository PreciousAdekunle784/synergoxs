"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import BookCall from "./CTA";
import { Reveal, SectionHead } from "./Primitives";

/* Benchmarks are stated as targets, not promises. */
const TARGET = { toLead: 0.15, toCall: 0.3, toClose: 0.25 };

type Cur = "USD" | "NGN";
const CUR: Record<Cur, { sym: string; mult: number; locale: string }> = {
  USD: { sym: "$", mult: 1, locale: "en-US" },
  NGN: { sym: "₦", mult: 1500, locale: "en-NG" },
};

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  id: string;
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
        <label className="text-[0.92rem] font-medium text-body" htmlFor={id}>
          {label}
        </label>
        <span className="num text-[0.98rem] font-semibold text-ink">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format(value)}
        className="mt-1.5 w-full"
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

    /* Which single stage is furthest below target, weighted by what it unlocks */
    const gaps = [
      { key: "toLead", name: "visitor → lead", current: toLead / 100, target: TARGET.toLead },
      { key: "toCall", name: "lead → booked call", current: toCall / 100, target: TARGET.toCall },
      { key: "toClose", name: "call → customer", current: toClose / 100, target: TARGET.toClose },
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
    const fixedCustomers = visitors * fixed.toLead * fixed.toCall * fixed.toClose;
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
      worst,
      fixedCustomers,
      fixedCac,
      gainMonthly: fixedRevenue - revenue,
      gainYearly: (fixedRevenue - revenue) * 12,
      hasGap: worst.lift > 0.001,
    };
  }, [spendBase, cpcBase, toLead, toCall, toClose, valueBase, m]);

  const funnelRows = [
    { name: "Visitors", v: r.visitors },
    { name: "Leads", v: r.leads, stage: "toLead" },
    { name: "Booked calls", v: r.calls, stage: "toCall" },
    { name: "Customers", v: r.customers, stage: "toClose" },
  ];

  return (
    <section id="teardown" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="Put a number on it"
          title={
            <>
              What is your biggest leak{" "}
              <span className="hl">costing you every month?</span>
            </>
          }
          lede="Move the sliders until they roughly match your business. The model finds your weakest stage and shows what fixing that one stage would be worth, on the traffic and budget you already have."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid overflow-hidden rounded-slab border border-line shadow-card lg:grid-cols-[0.82fr_1.18fr]">
            {/* Inputs — white */}
            <div className="flex flex-col bg-paper p-6 sm:p-9">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Your numbers</p>
                <div
                  className="flex rounded-full border border-line p-1"
                  role="group"
                  aria-label="Currency"
                >
                  {(["USD", "NGN"] as Cur[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCur(c)}
                      className={`min-w-[44px] rounded-full px-3 py-1.5 text-[0.8rem] font-semibold transition-colors ${
                        cur === c ? "bg-ink text-white" : "text-mute hover:text-ink"
                      }`}
                      aria-pressed={cur === c}
                      aria-label={c}
                    >
                      {CUR[c].sym}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <Slider
                  id="td-spend"
                  label="Monthly ad spend"
                  value={spendBase}
                  min={500}
                  max={40000}
                  step={250}
                  onChange={setSpendBase}
                  format={(n) => money(n * m)}
                />
                <Slider
                  id="td-cpc"
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
                  id="td-lead"
                  label="Visitors who become leads"
                  value={toLead}
                  min={1}
                  max={40}
                  step={0.5}
                  onChange={setToLead}
                  format={(n) => `${n}%`}
                />
                <Slider
                  id="td-call"
                  label="Leads who book a call"
                  value={toCall}
                  min={2}
                  max={70}
                  step={1}
                  onChange={setToCall}
                  format={(n) => `${n}%`}
                />
                <Slider
                  id="td-close"
                  label="Calls that close"
                  value={toClose}
                  min={2}
                  max={70}
                  step={1}
                  onChange={setToClose}
                  format={(n) => `${n}%`}
                />
                <Slider
                  id="td-value"
                  label="Average customer value"
                  value={valueBase}
                  min={50}
                  max={10000}
                  step={50}
                  onChange={setValueBase}
                  format={(n) => money(n * m)}
                />
              </div>

              <p className="mt-auto pt-7 text-[0.84rem] leading-relaxed text-mute">
                Not sure of a number? Leave it where it is. The defaults are a
                typical starting point, and a rough guess is enough to find
                the leak.
              </p>
            </div>

            {/* Output — black */}
            <div className="on-dark bg-ink p-6 text-white sm:p-9" aria-live="polite">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { l: "Customers / mo", v: Math.round(r.customers).toLocaleString() },
                  { l: "Cost per customer", v: money(r.cac) },
                  { l: "Revenue / mo", v: money(r.revenue) },
                ].map((k) => (
                  <div key={k.l} className="min-w-0">
                    <p className="text-[0.72rem] font-semibold uppercase leading-snug tracking-[0.1em] text-ash">
                      {k.l}
                    </p>
                    <p className="num mt-2 truncate font-display text-[1.25rem] font-extrabold tracking-tighter2 sm:text-[1.6rem]">
                      {k.v}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cascade */}
              <div className="mt-8 space-y-3.5">
                {funnelRows.map((row) => {
                  const w = Math.max(2, (row.v / Math.max(r.visitors, 1)) * 100);
                  const isLeak = r.hasGap && row.stage === r.worst.key;
                  return (
                    <div key={row.name}>
                      <div className="flex items-baseline justify-between gap-3 text-[0.88rem]">
                        <span className="flex items-center gap-2 text-ash">
                          {row.name}
                          {isLeak && (
                            <span className="rounded-full bg-white px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-ink">
                              Biggest leak
                            </span>
                          )}
                        </span>
                        <span className="num font-semibold">
                          {Math.round(row.v).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-lineDark">
                        <motion.div
                          className={`h-full rounded-full ${isLeak ? "bg-white" : "bg-green"}`}
                          animate={{ width: `${w}%` }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* The verdict */}
              <div className="mt-8 rounded-card bg-coal p-6">
                {r.hasGap ? (
                  <>
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-green">
                      Here&apos;s where the money is
                    </p>
                    <p className="mt-3 font-display text-[1.2rem] font-semibold leading-snug tracking-tighter2 sm:text-[1.3rem]">
                      Your weakest stage is{" "}
                      <span className="text-green">{r.worst.name}</span>. Bring
                      it to {Math.round(r.worst.target * 100)}% and, on the same{" "}
                      {money(r.spend)} of ad spend, you&apos;d add about{" "}
                      <span className="text-green">
                        {Math.round(r.fixedCustomers - r.customers).toLocaleString()}
                      </span>{" "}
                      customers a month.
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-4 border-t border-lineDark pt-5">
                      {[
                        { l: "New cost per customer", v: money(r.fixedCac), g: false },
                        { l: "Found revenue / mo", v: money(r.gainMonthly), g: true },
                        { l: "Over 12 months", v: money(r.gainYearly), g: true },
                      ].map((k) => (
                        <div key={k.l} className="min-w-0">
                          <p className="text-[0.7rem] font-semibold uppercase leading-snug tracking-[0.1em] text-ash">
                            {k.l}
                          </p>
                          <p className={`num mt-1.5 truncate text-[1rem] font-semibold sm:text-[1.1rem] ${k.g ? "text-green" : "text-white"}`}>
                            {k.v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-green">
                      Nothing obviously broken
                    </p>
                    <p className="mt-3 font-display text-[1.2rem] font-semibold leading-snug tracking-tighter2 sm:text-[1.3rem]">
                      Every stage sits at or above the target range. From here,
                      growth comes from volume and offer rather than repair.
                      That&apos;s a different conversation, and a better one to
                      be having.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <BookCall label="Run this on my real numbers" className="shrink-0" />
                <p className="text-[0.8rem] leading-relaxed text-ash">
                  Targets are typical mid-range benchmarks, not a forecast. On
                  the call we use your analytics instead.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
