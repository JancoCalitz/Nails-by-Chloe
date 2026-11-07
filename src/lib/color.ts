// Small colour utilities so Chloe can pick brand colours in the CMS without
// ever breaking readability: button/link colours are automatically darkened
// until they meet WCAG AA (4.5:1) contrast.

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(rgb: number[]): string {
  return (
    "#" +
    rgb
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function mix(hex: string, target: string, amount: number): string {
  const a = toRgb(hex);
  const b = toRgb(target);
  return toHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * amount));
}

/** Darken `hex` until it reaches `ratio` against every colour in `against`. */
export function ensureContrast(hex: string, against: string[], ratio = 4.5): string {
  let c = hex;
  for (let i = 0; i < 40 && against.some((bg) => contrast(c, bg) < ratio); i++) c = mix(c, "#000000", 0.05);
  return c;
}

export interface ThemeVars {
  accent: string;
  accentStrong: string;
  accentHover: string;
  bg: string;
  tint: string;
}

export const TEXT_COLOR = "#2A2422";

export function themeFrom(accent: string, bg: string): ThemeVars {
  // The background must stay light enough for charcoal text to pass AA comfortably.
  const safeBg = contrast(TEXT_COLOR, bg) >= 7 ? bg : "#FBF7F4";
  const accentStrong = ensureContrast(accent, ["#FFFFFF", safeBg]);
  return {
    accent,
    accentStrong,
    accentHover: mix(accentStrong, "#000000", 0.15),
    bg: safeBg,
    tint: mix(accent, "#FFFFFF", 0.82),
  };
}
