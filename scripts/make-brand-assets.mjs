// Generates the share image (shown when the link is posted on WhatsApp/Instagram),
// app icons and a printable QR code. Re-run after changing the name or domain:
//   SITE_URL=https://nailsbychloe.co.za npm run brand-assets
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import QRCode from "qrcode";

const root = process.cwd();
const pub = path.join(root, "public");
const settings = JSON.parse(fs.readFileSync(path.join(root, "content", "settings.json"), "utf8"));
const siteUrl = process.env.SITE_URL ?? "https://jancocalitz.github.io/Nails-by-Chloe/";
const accent = "#9C5964";
const name = settings.business_name;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FBF7F4"/>
  <circle cx="1040" cy="90" r="260" fill="#F3E6E4"/>
  <circle cx="140" cy="600" r="220" fill="#EAD5CF" opacity=".7"/>
  <line x1="120" y1="400" x2="320" y2="400" stroke="${accent}" stroke-width="3"/>
  <text x="120" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="#2A2422">${name}</text>
  <text x="120" y="470" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="#6F6560">Mobile nail tech · Roodepoort &amp; surrounds</text>
  <text x="120" y="530" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="${accent}">Gel · Acrylic · Nail art · At your door</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(path.join(pub, "og-image.png"));

const icon = (size, pad = 0) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${pad ? 0 : 22}" fill="${accent}"/>
  <text x="50" y="${pad ? 64 : 66}" font-family="Georgia, 'Times New Roman', serif" font-size="${pad ? 40 : 46}" fill="#FBF7F4" text-anchor="middle">NC</text>
</svg>`;
fs.writeFileSync(path.join(pub, "favicon.svg"), icon(64));
await sharp(Buffer.from(icon(192))).png().toFile(path.join(pub, "icon-192.png"));
await sharp(Buffer.from(icon(512))).png().toFile(path.join(pub, "icon-512.png"));
await sharp(Buffer.from(icon(512, 1))).png().toFile(path.join(pub, "icon-maskable-512.png"));
await sharp(Buffer.from(icon(180, 1))).png().toFile(path.join(pub, "apple-touch-icon.png"));

const qrOpts = { margin: 2, color: { dark: "#2A2422", light: "#FFFFFF" } };
fs.writeFileSync(path.join(pub, "qr-code.svg"), await QRCode.toString(siteUrl, { ...qrOpts, type: "svg" }));
await QRCode.toFile(path.join(pub, "qr-code.png"), siteUrl, { ...qrOpts, width: 1200 });

console.log(`Brand assets written (QR points to ${siteUrl})`);
