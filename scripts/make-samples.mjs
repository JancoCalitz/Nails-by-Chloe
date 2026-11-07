// One-off: generates clearly-labelled SAMPLE placeholder images so the gallery
// can be designed before Chloe uploads real photos. These are NOT photos of
// real work and must be replaced (or unpublished) before launch.
import fs from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "public", "samples");
fs.mkdirSync(out, { recursive: true });

const palettes = [
  ["#F6DCD8", "#E9B8B5", "#FFFFFF"],
  ["#E7D3DB", "#B76E79", "#D9B99B"],
  ["#F4EEE8", "#FFFDFB", "#E6D8CC"],
  ["#EFE1D6", "#D9B99B", "#B08A64"],
  ["#F2D9D9", "#A8202E", "#7E1621"],
  ["#F7E8EE", "#F2B8C6", "#C9E4CA"],
  ["#EEE7E2", "#F3EDE6", "#CFC4BA"],
  ["#FFF1D6", "#F6A04D", "#F7D154"],
  ["#E9DDE6", "#5E2750", "#B784A7"],
  ["#E3EEF6", "#FFFFFF", "#9CC3E4"],
  ["#EAE3F0", "#C9A227", "#7A4E9E"],
  ["#F3E9E2", "#D8B6A4", "#C49A87"],
];

palettes.forEach(([bg, nail, tip], i) => {
  const nails = [
    [250, 430, 48, 92, -14],
    [345, 360, 52, 104, -5],
    [445, 345, 52, 108, 3],
    [540, 380, 50, 100, 10],
    [620, 500, 44, 84, 22],
  ]
    .map(
      ([x, y, rx, ry, r]) =>
        `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${nail}"/><path d="M${x - rx * 0.85} ${y - ry * 0.55} Q${x} ${y - ry * 1.15} ${x + rx * 0.85} ${y - ry * 0.55}" stroke="${tip}" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="${x - rx * 0.35}" cy="${y - ry * 0.2}" rx="${rx * 0.12}" ry="${ry * 0.35}" fill="#fff" opacity=".45"/></g>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#FBF7F4"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><circle cx="640" cy="160" r="180" fill="${nail}" opacity=".18"/><circle cx="120" cy="860" r="220" fill="${tip}" opacity=".18"/>${nails}<rect x="250" y="760" width="300" height="56" rx="28" fill="#2A2422" opacity=".78"/><text x="400" y="797" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="#fff" text-anchor="middle">SAMPLE ${String(i + 1).padStart(2, "0")}</text><text x="400" y="860" font-family="Arial, sans-serif" font-size="22" fill="#2A2422" opacity=".7" text-anchor="middle">Placeholder — replace with a real photo</text></svg>`;
  fs.writeFileSync(path.join(out, `sample-${String(i + 1).padStart(2, "0")}.svg`), svg);
});
console.log(`Wrote ${palettes.length} sample images to public/samples`);
