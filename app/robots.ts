import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Funnel steps that only make sense mid-journey.
      disallow: ["/admin", "/api", "/booked", "/thank-you", "/offer", "/guide", "/payment"],
    },
    sitemap: "https://synergox.co/sitemap.xml",
  };
}
