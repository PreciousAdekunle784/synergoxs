import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import OptInProvider from "@/components/OptInProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/* Self-hosted at build time: no render-blocking request to Google, no layout shift. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const TITLE = "Synergox — More customers from the traffic you already pay for";
const DESCRIPTION =
  "Synergox is a growth marketing agency. We find the stage of your funnel losing the most customers and rebuild it — offer, pages, ads and follow-up — into a system with a cost per customer you can forecast. Start with a free 30-minute growth teardown.";

export const metadata: Metadata = {
  metadataBase: new URL("https://synergox.co"),
  title: {
    default: TITLE,
    template: "%s · Synergox",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description:
      "Funnels, ads and follow-up, done for you. Start with a free 30-minute growth teardown of your own numbers.",
    url: "https://synergox.co",
    siteName: "Synergox",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Synergox",
  url: "https://synergox.co",
  logo: "https://synergox.co/logo.png",
  description:
    "Growth marketing agency building customer acquisition systems — offer, funnel, paid ads and follow-up — for service and e-commerce businesses.",
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  areaServed: "Worldwide",
  serviceType: [
    "Conversion Rate Optimisation",
    "Sales Funnel Development",
    "Performance Marketing",
    "Lifecycle Email Marketing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <OptInProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </OptInProvider>
      </body>
    </html>
  );
}
