import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import {
  aboutSchema,
  faqSchema,
  gallerySchema,
  legalSchema,
  policiesSchema,
  reviewsSchema,
  servicesSchema,
  settingsSchema,
  stylesSchema,
} from "./schema";
import { slugify } from "./format";
import { withBase } from "./paths";

const CONTENT_DIR = path.join(process.cwd(), "content");

function load<S extends z.ZodType>(file: string, schema: S): z.infer<S> {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`content/${file} is invalid:\n${issues}`);
  }
  return result.data;
}

export const getSettings = () => load("settings.json", settingsSchema);
export const getServices = () => load("services.json", servicesSchema);
export const getPolicies = () => load("policies.json", policiesSchema).policies;
export const getFaqs = () => load("faq.json", faqSchema).faqs;
export const getAbout = () => load("about.json", aboutSchema);
export const getLegal = () => load("legal.json", legalSchema);
export const getStyles = () => load("styles.json", stylesSchema).styles;
export const getReviews = () => load("reviews.json", reviewsSchema).reviews.filter((r) => r.published);

// ---------- Images ----------

interface ImageMeta {
  width: number;
  height: number;
  thumb: string;
  thumbWidth: number;
  thumbHeight: number;
  blur: string;
}

let manifest: Record<string, ImageMeta> | null = null;
function imageManifest(): Record<string, ImageMeta> {
  if (manifest) return manifest;
  const file = path.join(process.cwd(), "src", "generated", "images.json");
  manifest = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  return manifest!;
}

export interface ResolvedImage {
  src: string;
  thumb: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  blur: string;
}

export function resolveImage(p: string): ResolvedImage | null {
  if (!p) return null;
  const meta = imageManifest()[p];
  return {
    src: withBase(p),
    thumb: withBase(meta?.thumb ?? p),
    width: meta?.width ?? 1600,
    height: meta?.height ?? 2000,
    thumbWidth: meta?.thumbWidth ?? 640,
    thumbHeight: meta?.thumbHeight ?? 800,
    blur: meta?.blur ?? "",
  };
}

// ---------- Gallery ----------

export interface GalleryItem extends ResolvedImage {
  slug: string;
  caption: string;
  alt: string;
  styles: string[];
  featured: boolean;
  isSample: boolean;
}

export function getGallery(): GalleryItem[] {
  const { items } = load("gallery.json", gallerySchema);
  const used = new Set<string>();
  return items
    .filter((i) => i.published)
    .map((item, index) => {
      let slug = slugify(item.slug || item.caption) || `set-${index + 1}`;
      while (used.has(slug)) slug = `${slug}-${index + 1}`;
      used.add(slug);
      const caption = item.caption || "Nail set by Chloe";
      return {
        ...resolveImage(item.image)!,
        slug,
        caption,
        alt: item.alt || `${caption} — nails by Chloe, mobile nail tech in Roodepoort`,
        styles: item.styles,
        featured: item.featured,
        isSample: item.image.startsWith("/samples/"),
      };
    });
}

// ---------- Derived helpers ----------

export function activeServices() {
  const s = getServices();
  return s.categories
    .map((c) => ({ ...c, services: c.services.filter((x) => x.active) }))
    .filter((c) => c.services.length > 0);
}

export function socialLinks(settings = getSettings()) {
  const clean = (h: string) => h.trim().replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "");
  const links: { label: string; href: string }[] = [];
  if (settings.instagram_handle) links.push({ label: "Instagram", href: `https://instagram.com/${clean(settings.instagram_handle)}` });
  if (settings.tiktok_handle) links.push({ label: "TikTok", href: `https://www.tiktok.com/@${clean(settings.tiktok_handle)}` });
  if (settings.facebook_url) links.push({ label: "Facebook", href: settings.facebook_url });
  return links;
}
