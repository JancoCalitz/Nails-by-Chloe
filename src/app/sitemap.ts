import type { MetadataRoute } from "next";
import { getGallery } from "@/lib/content";
import { absoluteUrl } from "@/lib/paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/gallery/", "/services/", "/book/", "/about/", "/faq/", "/contact/", "/privacy/", "/terms/"];
  const sets = getGallery()
    .filter((g) => !g.isSample)
    .map((g) => `/gallery/${g.slug}/`);
  return [...pages, ...sets].map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: p.startsWith("/gallery") ? "weekly" : "monthly",
    priority: p === "/" ? 1 : p === "/gallery/" || p === "/book/" ? 0.9 : 0.6,
  }));
}
