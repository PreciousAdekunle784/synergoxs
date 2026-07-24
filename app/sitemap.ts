import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://synergox.co";
  return ["", "/services", "/privacy", "/terms"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
