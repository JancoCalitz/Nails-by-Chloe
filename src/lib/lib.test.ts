import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { displaySaMobile, normaliseSaMobile, waDigits } from "./phone";
import { priceLabel, rand, shortDate, slugify, durationLabel } from "./format";
import { contrast, themeFrom } from "./color";
import { bookingMessage, whatsappLink } from "./whatsapp";
import * as schemas from "./schema";

describe("SA phone numbers", () => {
  it.each([
    ["082 123 4567", "+27821234567"],
    ["0821234567", "+27821234567"],
    ["+27 82 123 4567", "+27821234567"],
    ["27821234567", "+27821234567"],
    ["0027 72 555 0000", "+27725550000"],
    ["(061) 234-5678", "+27612345678"],
  ])("normalises %s", (input, expected) => expect(normaliseSaMobile(input)).toBe(expected));

  it.each(["011 123 4567", "12345", "082123456", "08212345678", ""])("rejects %s", (input) => expect(normaliseSaMobile(input)).toBeNull());

  it("formats for display and wa.me", () => {
    expect(displaySaMobile("+27821234567")).toBe("082 123 4567");
    expect(waDigits("082 123 4567")).toBe("27821234567");
    expect(waDigits("")).toBeNull();
  });
});

describe("formatting", () => {
  it("formats rands", () => {
    expect(rand(250)).toBe("R250");
    expect(rand(1200)).toBe("R1 200");
    expect(priceLabel(200, 400)).toBe("R200–R400");
    expect(priceLabel(200, 0)).toBe("from R200");
  });
  it("formats durations", () => {
    expect(durationLabel(45)).toBe("45 min");
    expect(durationLabel(90)).toBe("1 h 30 min");
    expect(durationLabel(0)).toBe("");
  });
  it("slugifies captions and strips SAMPLE prefix", () => {
    expect(slugify("SAMPLE — Soft pink French")).toBe("soft-pink-french");
    expect(slugify("Ombré 3D Flowers!")).toBe("ombre-3d-flowers");
  });
  it("formats dates without locale drift", () => expect(shortDate("2026-11-20")).toBe("20 Nov"));
});

describe("brand colours stay accessible", () => {
  it.each([
    ["#B76E79", "#FBF7F4"],
    ["#F2B8C6", "#FFFFFF"],
    ["#D9B99B", "#FBF7F4"],
  ])("accent %s on %s", (accent, bg) => {
    const t = themeFrom(accent, bg);
    expect(contrast(t.accentStrong, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.accentStrong, t.bg)).toBeGreaterThanOrEqual(4.5);
  });
  it("rejects a dark background", () => expect(themeFrom("#B76E79", "#222222").bg).toBe("#FBF7F4"));
});

describe("WhatsApp handoff", () => {
  it("builds an encoded link", () => {
    const link = whatsappLink("082 123 4567", "Hi & hello");
    expect(link).toBe("https://wa.me/27821234567?text=Hi%20%26%20hello");
    expect(whatsappLink("", "x")).toBeNull();
  });
  it("summarises a booking", () => {
    const msg = bookingMessage({
      name: "Lerato",
      whatsapp: "082 123 4567",
      service: "Gel toes",
      addons: ["French tips"],
      date: "Sat 21 Nov",
      windows: ["Morning"],
      area: "Florida",
      suburb: "Florida Park",
      notes: "Short almond",
    });
    expect(msg).toContain("*Service:* Gel toes");
    expect(msg).toContain("*Extras:* French tips");
    expect(msg).toContain("Sat 21 Nov (Morning)");
    expect(msg).toContain("Florida – Florida Park");
  });
});

describe("content files are valid", () => {
  const dir = path.join(process.cwd(), "content");
  const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  it.each([
    ["settings.json", schemas.settingsSchema],
    ["services.json", schemas.servicesSchema],
    ["styles.json", schemas.stylesSchema],
    ["gallery.json", schemas.gallerySchema],
    ["reviews.json", schemas.reviewsSchema],
    ["policies.json", schemas.policiesSchema],
    ["faq.json", schemas.faqSchema],
    ["about.json", schemas.aboutSchema],
    ["legal.json", schemas.legalSchema],
  ] as const)("%s", (file, schema) => {
    const r = schema.safeParse(read(file));
    expect(r.error?.issues ?? []).toEqual([]);
  });
  it("gallery styles all exist", () => {
    const styles = new Set(read("styles.json").styles.map((s: { slug: string }) => s.slug));
    for (const item of read("gallery.json").items) for (const s of item.styles) expect(styles.has(s)).toBe(true);
  });
});
