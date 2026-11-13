"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Eyebrow from "./Eyebrow";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Reveal — the single scroll-entrance used site-wide.                  */
/* One consistent motion language beats scattered effects.              */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  scale = 1,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  /** start slightly smaller and settle — used for large panels */
  scale?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — a grid whose children arrive one after another as the     */
/* group scrolls into view. Wrap each child in <StaggerItem>.           */
/* ------------------------------------------------------------------ */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function Stagger({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={group}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Mark — the green marker under a key phrase, drawn left to right     */
/* the first time it scrolls into view. The text itself never moves.    */
/* ------------------------------------------------------------------ */
export function Mark({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={`hl hl-draw ${seen ? "is-in" : ""}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHead — eyebrow + heading + optional lede.                     */
/* `accent` is the second half of the headline: either marked in green  */
/* ("mark") or set in grey ("muted").                                   */
/* ------------------------------------------------------------------ */
export function SectionHead({
  eyebrow,
  title,
  accent,
  accentStyle = "muted",
  lede,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  accentStyle?: "mark" | "muted";
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal>
        <Eyebrow center={center}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <Tag className="h-section mt-5">
          {title}
          {accent ? (
            <>
              {" "}
              {accentStyle === "mark" ? <Mark>{accent}</Mark> : <span className="text-mute">{accent}</span>}
            </>
          ) : null}
        </Tag>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className={`lede mt-5 max-w-2xl ${center ? "mx-auto" : ""}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Headline copy for one section, as edited in the dashboard. */
export type HeadCopy = { title: string; accent?: string; lede?: string };
