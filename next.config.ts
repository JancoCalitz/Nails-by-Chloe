import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH from actions/configure-pages, so if a custom domain is
// added later the base path automatically becomes "" with no code change.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
