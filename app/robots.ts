import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tools.vuarix.com/sitemap.xml",
    host: "https://tools.vuarix.com",
  };
}
