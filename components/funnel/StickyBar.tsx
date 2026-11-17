"use client";

import { useEffect, useState } from "react";
import { Arrow } from "../Icons";

/**
 * Mobile only: once the hero is out of view, a slim bar keeps the packages
 * one tap away. It steps aside while the packages or the Suite are on screen
 * (their own buttons are right there) and near the foot of the page.
 */
export default function StickyBar({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const nearEnd = y + vh > document.documentElement.scrollHeight - 500;
      const inOffer = ["packages", "suite"].some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return !!r && r.top < vh * 0.7 && r.bottom > vh * 0.3;
      });
      setShow(y > vh * 0.9 && !nearEnd && !inOffer);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-paper px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ease-out lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.7rem] uppercase leading-snug tracking-[0.1em] text-body">{label}</p>
        <a href="#packages" tabIndex={show ? 0 : -1} className="btn-primary min-h-[46px] shrink-0 px-4 py-2 text-[0.9rem]">
          See packages
          <Arrow />
        </a>
      </div>
    </div>
  );
}
