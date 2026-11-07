// Runs before every build. For each image referenced in the content files it:
//  - reads the real width/height (prevents layout shift),
//  - writes a small 640px-wide WebP thumbnail for grids (saves mobile data),
//  - creates a tiny blurred placeholder shown while the image loads.
// Results go to src/generated/images.json and public/_generated/ (both git-ignored).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const thumbDir = path.join(publicDir, "_generated", "thumbs");
const manifestFile = path.join(root, "src", "generated", "images.json");
fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(path.dirname(manifestFile), { recursive: true });

const read = (f) => JSON.parse(fs.readFileSync(path.join(root, "content", f), "utf8"));
const refs = new Set();
const settings = read("settings.json");
const about = read("about.json");
const gallery = read("gallery.json");
const reviews = read("reviews.json");
[settings.hero_image, about.photo, ...gallery.items.map((i) => i.image), ...reviews.reviews.map((r) => r.image)]
  .filter((p) => typeof p === "string" && p.startsWith("/"))
  .forEach((p) => refs.add(p));

const previous = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, "utf8")) : {};
const manifest = {};
let made = 0;

for (const ref of refs) {
  const file = path.join(publicDir, decodeURIComponent(ref));
  if (!fs.existsSync(file)) {
    console.warn(`  ! missing image referenced in content: ${ref}`);
    continue;
  }
  const stat = fs.statSync(file);
  const hash = crypto.createHash("md5").update(ref + stat.size + stat.mtimeMs).digest("hex").slice(0, 10);
  const thumbName = `${path.basename(ref).replace(/\.[^.]+$/, "")}-${hash}.webp`;
  const thumbPath = path.join(thumbDir, thumbName);
  if (previous[ref]?.hash === hash && fs.existsSync(thumbPath)) {
    manifest[ref] = previous[ref];
    continue;
  }
  try {
    const img = sharp(file, { density: 144 }).rotate(); // rotate() honours EXIF orientation
    const meta = await img.metadata();
    const portrait = (meta.autoOrient?.height ?? meta.height) >= (meta.autoOrient?.width ?? meta.width);
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;
    const thumb = await sharp(file, { density: 144 })
      .rotate()
      .resize({ width: 640, withoutEnlargement: !ref.endsWith(".svg") })
      .webp({ quality: 74 })
      .toFile(thumbPath);
    const blurBuf = await sharp(file).rotate().resize(16, portrait ? 20 : 12, { fit: "cover" }).webp({ quality: 40 }).toBuffer();
    manifest[ref] = {
      hash,
      width,
      height,
      thumb: `/_generated/thumbs/${thumbName}`,
      thumbWidth: thumb.width,
      thumbHeight: thumb.height,
      blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    };
    made++;
  } catch (err) {
    console.warn(`  ! could not process ${ref}: ${err.message}`);
  }
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(`Images ready: ${Object.keys(manifest).length} (${made} new thumbnails)`);
