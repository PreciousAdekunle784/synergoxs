import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/content/get";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern use of the SYNERGOX website, its free resources and its service packages.",
};

export default async function Terms() {
  const EMAIL = (await getContent()).contact.email;
  return (
    <LegalPage
      title="Terms of service"
      updated="November 2026"
      sections={[
        {
          h: "About these terms",
          p: [
            "These terms govern your use of this website and the purchase of service packages through it. Where a separate written agreement is signed for an engagement and the two conflict, the signed agreement wins.",
          ],
        },
        {
          h: "Using this site",
          p: [
            "You may read, share and reference the content here. You may not copy the site's code, copy or design system to build a competing offering, or use it in a way that misrepresents SYNERGOX.",
          ],
        },
        {
          h: "The Business Growth Blueprint",
          p: [
            "The Blueprint is a free educational guide. Its examples and figures are illustrations, not forecasts, and nothing in it is financial advice or a promise of results. You may share the guide as it is; you may not sell it or present it as your own.",
          ],
        },
        {
          h: "Packages, prices and payment",
          p: [
            "Each package is a defined scope of work for a one-time price. The deliverables, the scope and delivery terms, and the price shown on the package and at checkout at the time you pay are what you are buying.",
            "The Complete Growth Suite includes the packages listed with it at the time of purchase. Its price, the combined individual value and the saving shown are calculated from the prices in force at that moment.",
            "Payment is taken in full in advance through Paystack. An order is confirmed only when we have verified the payment with Paystack; you will receive a receipt by email.",
            "Advertising spend, domain names, hosting and other third-party fees are not included in any package unless the package says so. They are paid by you directly to the provider.",
          ],
        },
        {
          h: "Delivery",
          p: [
            "Work begins once we have received your project brief and any content the package depends on. Delivery times are estimates that assume feedback and approvals are returned within a few working days; delays in feedback extend the timeline by the same amount.",
            "Accounts created for your project, including advertising accounts, are created in your name. Finished work is yours on delivery.",
          ],
        },
        {
          h: "Our scope guarantee, and refunds",
          p: [
            "We do not guarantee revenue or any specific commercial result. Results depend on your market, offer, pricing, delivery and budget.",
            "We guarantee scope: every deliverable listed on the package you bought will be delivered. If we fail to deliver a listed item, we will refund the part of the fee that relates to it.",
            "If you ask to cancel before any work has started, write to us and we will refund the payment less any transaction fees charged by the payment provider. Once work has started, completed work is not refundable.",
          ],
        },
        {
          h: "Claims and case studies",
          p: [
            "Case studies describe work delivered for specific clients in specific conditions. Your results will differ.",
          ],
        },
        {
          h: "Intellectual property",
          p: [
            "The SYNERGOX name, mark and site content belong to SYNERGOX. Work produced for a client transfers to that client on delivery and full payment.",
          ],
        },
        {
          h: "Third-party services",
          p: [
            "This site relies on third-party services such as Paystack and Calendly. We aren't responsible for their availability or for how they handle your data under their own terms.",
          ],
        },
        {
          h: "Limitation of liability",
          p: [
            "To the extent permitted by law, SYNERGOX is not liable for indirect or consequential loss arising from use of this website or its resources, and our total liability for a package is limited to the amount you paid for it.",
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
