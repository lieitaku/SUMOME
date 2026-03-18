import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://memory-sumo.com";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const sitemapUrl = `${baseUrl.replace(/\/+$/, "")}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/preview"],
    },
    sitemap: sitemapUrl,
  };
}

