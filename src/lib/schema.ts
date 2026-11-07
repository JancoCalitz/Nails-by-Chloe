import { z } from "zod";

// Every content file is validated at build time. If an edit in the CMS produces
// invalid content, the GitHub Actions build fails and the previous version of
// the site stays live, so a typo can never take the site down.

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #B76E79");
const rands = z.coerce.number().int().min(0);

export const settingsSchema = z.object({
  business_name: z.string().min(1),
  tagline: z.string(),
  hero_headline: z.string().min(1),
  hero_subline: z.string(),
  hero_image: z.string().default(""),
  draft_notice: z.boolean().default(false),
  whatsapp_number: z.string().default(""),
  email: z.string().default(""),
  instagram_handle: z.string().default(""),
  tiktok_handle: z.string().default(""),
  facebook_url: z.string().default(""),
  google_review_url: z.string().default(""),
  availability_status: z.enum(["open", "limited", "full"]),
  availability_message: z.string().default(""),
  full_until_date: z.string().default(""),
  response_time: z.string().default("a few hours"),
  hours: z.array(z.object({ days: z.string(), times: z.string() })).default([]),
  accent_color: hex,
  bg_color: hex,
  seo_title: z.string(),
  seo_description: z.string(),
  price_range: z.string().default(""),
  booking_email_key: z.string().default(""),
  goatcounter_code: z.string().default(""),
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  price_from: rands,
  price_to: rands.default(0),
  duration_minutes: rands.default(0),
  deposit: z.string().default(""),
  featured: z.boolean().default(false),
  addon: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const servicesSchema = z.object({
  price_note: z.string().default(""),
  price_factors: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
  categories: z.array(
    z.object({
      name: z.string().min(1),
      intro: z.string().default(""),
      services: z.array(serviceSchema).default([]),
    }),
  ),
  travel_mode: z.enum(["tiers", "quote"]).default("tiers"),
  travel_note: z.string().default(""),
  areas: z
    .array(
      z.object({
        name: z.string().min(1),
        fee: rands.default(0),
        notes: z.string().default(""),
        active: z.boolean().default(true),
      }),
    )
    .default([]),
});

export const stylesSchema = z.object({
  styles: z.array(z.object({ name: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/) })),
});

export const gallerySchema = z.object({
  items: z.array(
    z.object({
      image: z.string().min(1),
      caption: z.string().default(""),
      alt: z.string().default(""),
      styles: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      published: z.boolean().default(true),
      slug: z.string().default(""),
    }),
  ),
});

export const reviewsSchema = z.object({
  reviews: z
    .array(
      z.object({
        client_name: z.string().min(1),
        body: z.string().min(1),
        date: z.string().default(""),
        image: z.string().default(""),
        published: z.boolean().default(true),
      }),
    )
    .default([]),
});

export const policiesSchema = z.object({
  policies: z.array(z.object({ key: z.string(), title: z.string(), body: z.string() })),
});

export const faqSchema = z.object({
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export const aboutSchema = z.object({
  heading: z.string(),
  teaser: z.string(),
  photo: z.string().default(""),
  story: z.string(),
  products: z.string().default(""),
  hygiene: z.string().default(""),
  setup: z.string().default(""),
});

export const legalSchema = z.object({ privacy: z.string(), terms: z.string() });

export type Settings = z.infer<typeof settingsSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ServicesContent = z.infer<typeof servicesSchema>;
export type Policy = z.infer<typeof policiesSchema>["policies"][number];
export type Review = z.infer<typeof reviewsSchema>["reviews"][number];
