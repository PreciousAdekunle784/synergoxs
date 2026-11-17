import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/content/get";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How SYNERGOX collects, uses and protects your information.",
};

export default async function Privacy() {
  const EMAIL = (await getContent()).contact.email;
  return (
    <LegalPage
      title="Privacy policy"
      updated="November 2026"
      sections={[
        {
          h: "What we collect",
          p: [
            "When you request the Business Growth Blueprint, we collect your first name and email address, the page and campaign you came from, and the date and time.",
            "When you buy a package, we collect your name, email address and, if you give it, a phone number. After payment we ask for the details needed to deliver the work: your business name, website, industry, goals, audience and existing marketing assets.",
            "When you book a call, we collect the details you give us on the booking form.",
            "When you browse the site, we count visits ourselves: the page viewed, the site you came from and a random identifier that lasts one browser session. We do not record your IP address for this, and we do not count visits from browsers that send a Do Not Track signal.",
          ],
        },
        {
          h: "Why we collect it",
          p: [
            "To send you the resource you asked for, to send the emails described on the form you filled in, to take and confirm payments, to deliver the services you buy, to respond to your enquiries, and to understand how the site is performing.",
            "We do not sell your information, rent it, or share it with third parties for their own marketing.",
          ],
        },
        {
          h: "Marketing emails and consent",
          p: [
            "When you request the Blueprint, the form states that you will receive it by email followed by a short series of emails from SYNERGOX. Submitting the form is your consent to those emails, and we keep a record of the wording you agreed to and when.",
            "Every marketing email has a one-click unsubscribe link. Unsubscribing takes effect immediately. If you later buy from us you will still receive your receipt and messages about your project, which are not marketing.",
          ],
        },
        {
          h: "Payments",
          p: [
            "Payments are processed by Paystack on Paystack's own checkout page. We never see or store your card number or bank credentials. We receive confirmation of the payment, the amount, the payment method type and a transaction reference.",
          ],
        },
        {
          h: "Storage on your device",
          p: [
            "The site keeps a few small items in your browser's own storage so the pages work together: your name and email for the rest of a visit (to prefill the next form), a random visit identifier, and notes that you have requested the Blueprint, dismissed an offer or completed a purchase. These stay on your device, are not advertising cookies, and can be cleared from your browser at any time.",
          ],
        },
        {
          h: "Processors we use",
          p: [
            "Our database is hosted by Supabase. Email is sent through Resend. Payments are handled by Paystack. Scheduling is handled by Calendly. The site is hosted by Vercel. Each processes data on our behalf under its own terms.",
          ],
        },
        {
          h: "How long we keep it",
          p: [
            "Enquiry and client records are kept for as long as we have a relationship with you, plus the period required for tax and legal records. Marketing contacts are kept until you unsubscribe or ask us to delete them.",
          ],
        },
        {
          h: "Your rights",
          p: [
            "You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to delete it.",
            `To make a request, email ${EMAIL}. We respond within 30 days.`,
          ],
        },
        {
          h: "Security",
          p: [
            "Data is transmitted over encrypted connections and stored with reputable providers. Access to customer records is restricted to authorised SYNERGOX administrators. No system is perfectly secure, and we won't claim otherwise.",
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
