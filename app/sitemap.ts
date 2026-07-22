import type { MetadataRoute } from "next";
import { categories } from "@/lib/data";

export const dynamic = "force-static";

const baseUrl = "https://tools.vuarix.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/categorias/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacidade/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...categories.flatMap((category) => [
      {
        url: `${baseUrl}/${category.slug}/`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      ...category.tools.map((tool) => ({
        url: `${baseUrl}/${category.slug}/${tool.slug}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ]),
  ];
}
