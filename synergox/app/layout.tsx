import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://synergox.co"),
  title: {
    default: "Synergox — Revenue Growth Partner",
    template: "%s · Synergox",
  },
  description:
    "Synergox builds predictable customer acquisition systems: offer, funnel, traffic and follow-up assembled into one machine you can forecast from.",
  openGraph: {
    title: "Synergox — Revenue Growth Partner",
    description:
      "We don't sell marketing. We build predictable customer acquisition systems.",
    url: "https://synergox.co",
    siteName: "Synergox",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Synergox",
  url: "https://synergox.co",
  logo: "https://synergox.co/logo.png",
  description:
    "Revenue growth partner building predictable customer acquisition systems for service and e-commerce businesses.",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-display:'Bricolage Grotesque';--font-body:'Instrument Sans';--font-mono:'JetBrains Mono';}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="grain bg-void font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-5 focus:py-3 focus:text-void"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
