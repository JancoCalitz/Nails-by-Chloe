import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";
import { withBase } from "@/lib/paths";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const s = getSettings();
  return {
    name: s.business_name,
    short_name: s.business_name,
    description: s.seo_description,
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    background_color: "#FBF7F4",
    theme_color: "#FBF7F4",
    icons: [
      { src: withBase("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: withBase("/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: withBase("/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
