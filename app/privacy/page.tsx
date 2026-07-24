import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Synergox collects, uses and protects your information.",
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="July 2026"
      sections={[
        {
          h: "What we collect",
          p: [
            "When you book a call or request a resource, we collect the details you give us: your name, email address, company name, and anything you choose to tell us about your business.",
            "When you browse the site, we collect standard analytics: pages viewed, referring source, approximate location derived from IP, device and browser type. This is aggregate behaviour, not identity.",
          ],
        },
        {
          h: "Why we collect it",
          p: [
            "To respond to your enquiry, prepare for and conduct a strategy call, send resources you asked for, and improve how the site performs.",
            "We do not sell your information, and we do not share it with third parties for their own marketing.",
          ],
        },
        {
          h: "Cookies and tracking",
          p: [
            "We use cookies for analytics and, where advertising is running, for conversion measurement. You can block or delete cookies in your browser; core parts of the site will still work.",
          ],
        },
        {
          h: "Processors we use",
          p: [
            "Scheduling is handled by Calendly. Email is handled by our email service provider. Analytics is handled by Google Analytics. Hosting is handled by Vercel. Each processes data on our behalf under their own terms.",
          ],
        },
        {
          h: "How long we keep it",
          p: [
            "Enquiry and client records are kept for as long as we have a relationship with you, plus the period required for tax and legal records. Marketing contacts are kept until you unsubscribe.",
          ],
        },
        {
          h: "Your rights",
          p: [
            "You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to delete it. Unsubscribe links appear in every marketing email.",
            `To make a request, email ${EMAIL}. We respond within 30 days.`,
          ],
        },
        {
          h: "Security",
          p: [
            "Data is transmitted over encrypted connections and stored with reputable providers. No system is perfectly secure, and we won't claim otherwise.",
          ],
        },
        {
          h: "Changes",
          p: [
            "If this policy changes materially, we'll update the date at the top and, where the change affects you directly, tell you by email.",
          ],
        },
      ]}
    />
  );
}
