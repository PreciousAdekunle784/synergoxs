import ContactProvider from "@/components/ContactProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrackPageView from "@/components/TrackPageView";
import MotionProvider from "@/components/MotionProvider";
import { getContent } from "@/lib/content/get";
import { SITE_URL } from "@/lib/site";

/** Everything the public funnel wraps its pages in. */
export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const { contact } = await getContent();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "SYNERGOX",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: contact.email,
    description:
      "Growth and marketing agency. Websites, customer acquisition and conversion optimization, built to work as one connected growth system.",
    address: { "@type": "PostalAddress", addressLocality: contact.location },
    areaServed: "Worldwide",
    serviceType: ["Website Design and Development", "Customer Acquisition", "Conversion Rate Optimization"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <MotionProvider>
        <ContactProvider contact={contact}>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </ContactProvider>
      </MotionProvider>
      <TrackPageView />
    </>
  );
}
