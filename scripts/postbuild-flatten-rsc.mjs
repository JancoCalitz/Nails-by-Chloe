// Workaround for Next.js 16 static export on plain static hosts (GitHub Pages):
// the exporter writes prefetch segments as nested folders, e.g.
//   contact/__next.contact/__PAGE__.txt
// but the client router requests the flattened name
//   contact/__next.contact.__PAGE__.txt
// Without this, every link prefetch 404s and navigation falls back to full page
// loads. We add a flattened copy next to each nested file (originals are kept).
import fs from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "out");
let copied = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) flatten(full, dir, entry.name);
    else walk(full);
  }
}

function flatten(segDir, pageDir, prefix) {
  for (const entry of fs.readdirSync(segDir, { withFileTypes: true })) {
    const full = path.join(segDir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(full, pageDir, name);
    else {
      const target = path.join(pageDir, name);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(full, target);
        copied++;
      }
    }
  }
}

if (fs.existsSync(out)) {
  walk(out);
  // GitHub Pages runs Jekyll by default, which hides files/folders starting with "_".
  fs.writeFileSync(path.join(out, ".nojekyll"), "");
  console.log(`Flattened ${copied} prefetch files; wrote .nojekyll`);
}
