import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Steps that only make sense mid-journey, and everything private.
      disallow: ["/admin", "/api", "/checkout", "/order", "/unsubscribe", "/apply", "/booked"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
