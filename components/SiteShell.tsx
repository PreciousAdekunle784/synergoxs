import OptInProvider from "@/components/OptInProvider";
import ContactProvider from "@/components/ContactProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrackPageView from "@/components/TrackPageView";
import MotionProvider from "@/components/MotionProvider";
import { getContent } from "@/lib/content/get";

/** Everything the public website wraps its pages in. */
export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const { contact, copy, projects } = await getContent();
  const hasResults = projects.length > 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Synergox",
    url: "https://synergox.co",
    logo: "https://synergox.co/logo.png",
    email: contact.email,
    description:
      "Growth marketing agency building customer acquisition systems — offer, funnel, paid ads and follow-up — for service and e-commerce businesses.",
    address: { "@type": "PostalAddress", addressLocality: contact.location },
    areaServed: "Worldwide",
    serviceType: [
      "Conversion Rate Optimisation",
      "Sales Funnel Development",
      "Performance Marketing",
      "Lifecycle Email Marketing",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <MotionProvider>
        <ContactProvider contact={contact} cta={copy["hero.cta"]}>
          <OptInProvider>
            <Nav hasResults={hasResults} />
            <main id="main">{children}</main>
            <Footer hasResults={hasResults} />
          </OptInProvider>
        </ContactProvider>
      </MotionProvider>
      <TrackPageView />
    </>
  );
}
