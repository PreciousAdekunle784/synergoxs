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
/* `accent` is the phrase set in italic serif: the one idea the section */
/* turns on.                                                            */
/* ------------------------------------------------------------------ */
export function SectionHead({
  eyebrow,
  title,
  accent,
  lede,
  align = "left",
  as: Tag = "h2",
  wide = false,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  wide?: boolean;
  /** for aria-labelledby on the surrounding section */
  id?: string;
}) {
  const center = align === "center";
  const width = wide ? "max-w-4xl" : "max-w-3xl";
  return (
    <div className={center ? `mx-auto ${width} text-center` : width}>
      <Reveal>
        <Eyebrow center={center}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <Tag id={id} className="h-section mt-5 text-balance">
          {title}
          {accent ? (
            <>
              {" "}
              <span className="accent accent-green">{accent}</span>
            </>
          ) : null}
        </Tag>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className={`lede mt-6 max-w-2xl ${center ? "mx-auto" : ""}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* InView — adds `is-in` the first time its children scroll into view.  */
/* Drives the CSS-only effects: struck prices, drawn lines.             */
/* ------------------------------------------------------------------ */
export function InView({
  children,
  className = "",
  as: Tag = "div",
  margin = "0px 0px -15% 0px",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "span" | "section" | "li";
  margin?: string;
}) {
  const ref = useRef<HTMLElement>(null);
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
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={`${className} ${seen ? "is-in" : ""}`}>
      {children}
    </Comp>
  );
}
