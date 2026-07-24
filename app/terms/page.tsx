import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern use of the Synergox website and services.",
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms of service"
      updated="July 2026"
      sections={[
        {
          h: "About these terms",
          p: [
            "These terms govern your use of this website. Client engagements are governed by a separate written agreement signed by both parties; where the two conflict, the signed agreement wins.",
          ],
        },
        {
          h: "Using this site",
          p: [
            "You may read, share and reference the content here. You may not copy the site's code, copy or design system to build a competing offering, or use it in a way that misrepresents Synergox.",
          ],
        },
        {
          h: "The teardown tool",
          p: [
            "The interactive teardown is a model. It projects outcomes from the inputs you provide against typical mid-range benchmarks, and it is not a forecast, a valuation or a promise of results.",
            "Nothing produced by the tool should be relied on as financial advice or used as the sole basis for a spending decision.",
          ],
        },
        {
          h: "Claims and results",
          p: [
            "Case studies describe work delivered for specific clients in specific conditions. Your results will depend on your market, offer, delivery and budget.",
            "We do not guarantee revenue outcomes. Where we offer a guarantee, it is a scope guarantee — work not delivered is not billed — and it is stated in your signed agreement.",
          ],
        },
        {
          h: "Intellectual property",
          p: [
            "The Synergox name, mark and site content belong to Synergox. Work produced for a client under a signed agreement transfers to that client on the terms set out in it.",
          ],
        },
        {
          h: "Third-party links",
          p: [
            "This site links to third-party services such as Calendly. We aren't responsible for their content, availability or handling of your data.",
          ],
        },
        {
          h: "Limitation of liability",
          p: [
            "To the extent permitted by law, Synergox is not liable for indirect or consequential loss arising from use of this website.",
          ],
        },
        {
          h: "Contact",
          p: [`Questions about these terms can be sent to ${EMAIL}.`],
        },
      ]}
    />
  );
}
