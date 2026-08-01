"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import OptIn from "./OptIn";

type Ctx = { openOptIn: () => void };
const OptInContext = createContext<Ctx>({ openOptIn: () => {} });

/** Call this hook anywhere to trigger the lead-magnet modal. */
export function useOptIn() {
  return useContext(OptInContext);
}

export default function OptInProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openOptIn = useCallback(() => setOpen(true), []);

  return (
    <OptInContext.Provider value={{ openOptIn }}>
      {children}
      <OptIn open={open} onClose={() => setOpen(false)} />
    </OptInContext.Provider>
  );
}
