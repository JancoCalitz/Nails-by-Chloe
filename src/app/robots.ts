import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/paths";

export const dynamic = "force-static";

// Note: on a GitHub Pages project site (username.github.io/repo) search engines only
// read robots.txt at the domain root, so this file takes effect once a custom domain is used.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/manage/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
