import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "public/**", "src/generated/**", "next-env.d.ts"] },
  {
    rules: {
      // Static export: next/image optimisation is unavailable; we ship our own thumbnails.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
