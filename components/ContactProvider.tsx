"use client";

import { createContext, useContext } from "react";
import { DEFAULT_CONTACT, type Contact } from "@/lib/content/defaults";

const Ctx = createContext<Contact>(DEFAULT_CONTACT);

/** Contact details, as edited in the dashboard. */
export function useContact() {
  return useContext(Ctx);
}

export default function ContactProvider({ contact, children }: { contact: Contact; children: React.ReactNode }) {
  return <Ctx.Provider value={contact}>{children}</Ctx.Provider>;
}
