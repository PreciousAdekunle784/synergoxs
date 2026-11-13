"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honours the visitor's "reduce motion" setting for every scroll and hover
 * animation on the site: movement is dropped, a plain fade is kept.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
