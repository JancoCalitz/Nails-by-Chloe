// Safe to import from client components.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Prefix a public-folder path ("/uploads/x.webp") with the deploy base path. */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return BASE_PATH + (path.startsWith("/") ? path : `/${path}`);
}

/** Absolute URL for sharing / SEO. SITE_URL already includes the base path. */
export function absoluteUrl(path = "/"): string {
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}
