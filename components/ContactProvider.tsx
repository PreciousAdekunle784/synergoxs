"use client";

import { createContext, useContext } from "react";
import { DEFAULT_CONTACT, type Contact } from "@/lib/content/defaults";

type Value = { contact: Contact; cta: string };
const Ctx = createContext<Value>({ contact: DEFAULT_CONTACT, cta: "Book my free growth teardown" });

/** Contact details and the main button text, as edited in the dashboard. */
export function useContact() {
  return useContext(Ctx).contact;
}
export function useCtaLabel() {
  return useContext(Ctx).cta;
}

export default function ContactProvider({
  contact,
  cta,
  children,
}: {
  contact: Contact;
  cta: string;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ contact, cta }}>{children}</Ctx.Provider>;
}
