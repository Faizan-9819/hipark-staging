import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ must stay crawlable: Google needs its JS/CSS to render pages
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.hiparks.com/sitemap.xml",
  };
}
