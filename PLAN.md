# Nails by Chloe — Website Application Plan

> Hand this file to Claude Code as the project brief. Save it as `PLAN.md` in an empty project folder (and optionally copy the "Working agreement" section into `CLAUDE.md`).

---

## 0. Working agreement for Claude Code

1. Read this whole plan before writing code. Build in the phases in section 12, in order. Finish and verify one phase before starting the next.
2. Do not invent business facts. Anything marked **[TBC]** is a placeholder driven by content/settings in the admin panel, never hard-coded. Chloe's prices, hours, WhatsApp number, policies and photos must all be editable by her without touching code.
3. No fake reviews, fake photos, fake "as seen in" badges or fake booking counts. Use clearly labelled placeholder content during development and make sure it is removed or replaceable before launch.
4. The primary user is a 24-year-old nail tech on her phone, and her clients are almost all on phones too, many on limited mobile data. Mobile-first, light pages, big tap targets.
5. Commit often with clear messages. Keep a `README.md` with setup, env vars, deploy steps, and "how Chloe uses the admin" in plain language.
6. When a decision is genuinely open (see section 14), pick the default stated here, note it in the README, and carry on.

---

## 1. Project summary

**What:** A public showcase-and-booking website for Chloe, a mobile nail technician in the Roodepoort (Johannesburg West) area, plus a simple private admin area so she can manage the site herself from her phone.

**Why:** Chloe currently has nowhere to advertise beyond social media. A website gives her a permanent portfolio, clear pricing, a professional booking route, and a presence in Google searches like "nail tech Roodepoort". Instagram can't do the Google part.

**Who it's for:**
- *Clients:* women (mostly 18–40) in and around Roodepoort looking for a nail tech whose work they like. They decide almost entirely on what they see, then want to know price, location/travel, and how to book.
- *Chloe:* a solo tech with no web skills required. She needs to upload new sets after an appointment in under a minute, from her phone.

**Success looks like:**
- A visitor from an Instagram bio link can see her best work, understand pricing, and send a booking request in under 60 seconds on a phone.
- Chloe can add a new set to the gallery, change a price, or mark herself "fully booked" without help.
- The site ranks for local searches over time, and costs close to nothing to run.

**Business facts (from Janco):**
- Name: Chloe. Mobile nail tech, Roodepoort area, Gauteng, South Africa. Works on the side (not full-time).
- Typical pricing: roughly **R200–R400** per appointment. Final price depends on: the design, whether the colour is in stock, and distance travelled.
- Brand/business name: **Nails by Chloe** (confirmed). Use it as the default `business_name` in site settings, in page titles, the logo wordmark (text-based until she has a logo) and the share image.

---

## 2. What the research says (and how it shapes the build)

Findings from reviewing nail-tech/salon website guides, template galleries, and South African nail-tech booking pages:

| Finding | Decision in this plan |
|---|---|
| Clients pick a nail tech on what they can see; a permanent, organised portfolio matters more than almost any other trade. Recommended 12–20 designs grouped by style. | Gallery is the hero of the site. Filter by style, big photos, lightbox with swipe. |
| The strongest pages put a booking button above the fold, then gallery, pricing, location, reviews, aftercare/FAQ. | Homepage follows exactly that order. Sticky "Book" button on mobile. |
| Top examples feel calm, uncluttered and consistent in branding, with minimal text. | Editorial, airy design, one accent colour, limited type. See section 4. |
| Clear price menus filter out time-wasters and remove the awkward price conversation. | Public services page with "from R…" prices, duration, and a transparent extras and travel section. |
| Integrated booking is the most valuable feature for salons: real-time slots, confirmations, deposits. | Chloe is solo and mobile with variable pricing and travel, so **Phase 1 is a booking-request flow** (confirmed via WhatsApp), with a real availability calendar as a later phase. |
| In SA, many independent nail techs run booking through WhatsApp/Instagram DMs and EFT deposits (e.g. a R250 deposit with proof of payment sent over WhatsApp). | WhatsApp is a first-class channel: prefilled WhatsApp message, request form that hands off to WhatsApp, deposit instructions shared in chat rather than published on the site. |
| Clients like sharing inspiration photos so the tech can prepare colours and supplies. | Booking form lets the client upload up to 3 inspo photos. |
| Clear deposit/cancellation policy, repeated everywhere (site, confirmation, FAQ), protects the tech's time. Deposits do cost some conversions, so keep it simple. | Editable policy text shown on the book page, FAQ and confirmation. Deposit is optional per service and set by Chloe. |
| Mobile nail techs in SA price travel in tiers by distance/area. | Service-area list with optional travel fee per area, shown transparently. |
| A site can't rely on Instagram for search; a website is what shows in Google results. | Local SEO from day one (section 9). |

---

## 3. Scope

### In scope (v1)
Public site, booking-request flow with WhatsApp handoff, admin panel (gallery, services, requests, reviews, settings), local SEO, analytics, POPIA-aware privacy handling, deployment.

### Later phases (designed for, not built in v1)
Live availability calendar with time slots; online deposit payment (PayFast); automated WhatsApp/SMS reminders; gift vouchers; client loyalty/referral codes; blog/aftercare articles.

### Explicitly out of scope
Native mobile app, e-commerce for products, multi-technician accounts, client login accounts.

---

## 4. Design direction

**Feel:** soft, premium, editorial. Think boutique beauty brand, not a generic salon template. Calm, lots of white space, the nail photos do the talking. Feminine but not childish.

**Palette (defaults, make them CSS variables / Tailwind theme tokens so Chloe can pick final colours easily):**
- Background: warm off-white `#FBF7F4`
- Surface/cards: `#FFFFFF`
- Text: deep warm charcoal `#2A2422`
- Muted text: `#6F6560`
- Accent (primary buttons, links): dusty rose / mauve `#B76E79`
- Accent hover: `#9C5964`
- Soft tint (section backgrounds): `#F3E6E4`
- Optional secondary highlight: champagne `#D9B99B`
- Check contrast: body text and button labels must meet WCAG AA.

**Typography:** one elegant serif for headings (e.g. Cormorant Garamond or Playfair Display), one clean sans for body/UI (e.g. Inter or DM Sans). Load via `next/font` (self-hosted, no layout shift). Generous line height, large mobile body size (16–18px).

**Imagery rules:**
- Photos are the design. Consistent crops (4:5 portrait for gallery tiles), consistent warm lighting. Provide a short "How to photograph your nails" tip card in the admin.
- No stock photos of other people's nails in the final site.
- Subtle motion only: fade/slide-up on scroll, gentle image hover zoom on desktop, smooth lightbox. Respect `prefers-reduced-motion`.

**Layout principles:**
- Mobile-first, single column, thumb-friendly. Sticky bottom bar on mobile with two buttons: **Book now** and **WhatsApp**.
- One primary action per screen. Short copy. No walls of text.
- Optional touch: small decorative elements (soft blurred colour blobs, thin line accents) behind sections. Keep it tasteful.

---

## 5. Site map and page specs

### 5.1 Home `/`
Order matters, follows the research:
1. **Hero:** best photo (full-bleed on mobile, split layout on desktop), headline (e.g. "Nails, done at your door"), subline with area ("Mobile nail tech · Roodepoort & surrounds"), primary button **Book now**, secondary **See my work**. Small status chip driven by settings, e.g. "Taking bookings this week" / "Fully booked until 20 Nov".
2. **Latest work strip:** 6–8 featured photos (horizontal scroll on mobile, grid on desktop) linking to the gallery.
3. **Services snapshot:** 3–4 headline services with "from R…" prices, link to full menu.
4. **How it works:** 3 steps — Pick your set → Send a request → I confirm on WhatsApp.
5. **Reviews:** 3 real testimonials (only if Chloe has them; hide section if none).
6. **About teaser:** photo of Chloe, two lines, link to About.
7. **Service area teaser:** list of areas she covers + "Not sure if I travel to you? Ask."
8. **Final CTA** + Instagram feed link (just a link and a grid of 6 latest gallery photos, no third-party embed that slows the page).

### 5.2 Gallery `/gallery`
- Masonry or uniform 4:5 grid, infinite/"load more" pagination (24 at a time).
- **Filter chips** by style/category (e.g. Gel, Acrylic, French, Chrome, 3D art, Minimal, Seasonal, Bridal). Categories are editable in admin.
- Tap a photo → lightbox with swipe/arrow/keyboard navigation, caption, tags, and a button **"I want this set"** that opens the booking form prefilled with that design reference.
- Deep-linkable (`/gallery?style=chrome`, `/gallery/[slug]` for individual sets for SEO and sharing).
- Lazy-loaded, responsive images (AVIF/WebP), blur-up placeholders, explicit width/height to avoid layout shift.

### 5.3 Services & Pricing `/services`
- Cards/list grouped by category (e.g. Gel polish, Gel overlay, Acrylic/builder, Nail art add-ons, Removals/soak-off, Repairs).
- Each service: name, short description, **"from R…"** price (or range, e.g. R200–R400), approximate duration, optional deposit.
- **"What affects your price"** block explaining the three real factors in plain language: design complexity, colour availability/stock, and travel distance.
- **Travel fees** table by area (editable). If Chloe prefers to quote, show "Travel quoted by distance".
- **Optional price estimator** (Phase 2): pick service + add-ons + area → "Estimated total R…" with a clear "final price confirmed on WhatsApp" note.
- Policies summary (deposit, cancellation, running late) with link to FAQ.

### 5.4 Book `/book`
Booking **request** form (not instant booking in v1). Mobile-optimised multi-step or single short form:
1. Service (select, with optional add-ons)
2. Preferred date + 2 preferred time windows (morning / afternoon / evening) — not exact slots
3. Area (dropdown of service areas + "Other / not sure") and suburb/street area only (full address collected by Chloe over WhatsApp after confirmation)
4. Design: choose from gallery (prefilled if coming from "I want this set") and/or upload up to 3 inspiration photos (client-side compressed) and a notes box (colour, shape, length)
5. Name, WhatsApp number (validated for SA formats, normalised to `+27…`), optional email
6. Consent checkbox (POPIA): "I agree to Chloe storing these details to arrange my appointment." Link to Privacy page.
7. Submit → success screen: "Request sent! Chloe will confirm on WhatsApp, usually within X hours **[TBC]**." Plus a **"Open WhatsApp"** button with a prefilled message summarising the request (via `https://wa.me/<number>?text=<encoded>`), because many clients will prefer to continue there.

Behind the scenes: save to DB, email notification to Chloe, and (optional later) WhatsApp Business API notification. Anti-spam: honeypot field + rate limiting + Cloudflare Turnstile (free) if spam appears.

### 5.5 About `/about`
Chloe's story in a warm voice, her photo, the products she uses **[TBC]**, hygiene/sanitation commitment (genuine, stated by Chloe), what a clean mobile setup looks like. Short, personal, approachable.

### 5.6 FAQ & Policies `/faq`
Editable accordions: How booking works, deposit, cancellation/reschedule window, running late, do I need to prep (clean nails, removal), aftercare tips, how long do sets last, where she travels, what to have ready at home (a table/good light), payment methods accepted. Single source of truth for the policy text that also appears on `/book` and in confirmations.

### 5.7 Reviews `/reviews` (or section only at first)
Real testimonials entered by Chloe (name or initials, optional photo of the set, date). No star-rating schema unless reviews are genuinely collected and visible on the page (avoid misleading structured data).

### 5.8 Contact `/contact`
WhatsApp button, Instagram, TikTok/Facebook if she has them, email, operating hours, service area. **Do not publish a home address.** Show "Mobile service · Roodepoort & surrounds".

### 5.9 Legal
`/privacy` (POPIA-aware privacy notice) and `/terms` (booking terms). Provide sensible draft text with a note that Janco/Chloe should review it; not legal advice.

### 5.10 Utility
Custom 404, `robots.txt`, `sitemap.xml`, web manifest + icons, social share (OG) image.

---

## 6. Admin panel (`/admin`) — Chloe's control room

Phone-first, large buttons, plain language. Single-user login (Chloe) plus a second login for Janco.

**Dashboard:** new requests count, quick actions (Add photos, Mark fully booked, Edit prices).

**Gallery manager (most important screen):**
- Multi-photo upload straight from phone camera roll/camera. Client-side resize/compress before upload (max ~2000px long edge, WebP/JPEG ~0.8) to save her data.
- Per photo: caption, style tags (multi-select), "featured on homepage" toggle, optional linked service, alt text (auto-suggest from caption, editable), published/hidden.
- Drag to reorder, bulk hide/delete with confirm.

**Services & pricing manager:** CRUD services and categories, price-from / price-to, duration, deposit (amount or %), active toggle, sort order. Travel areas and fees CRUD.

**Booking requests inbox:** list with status (New → Contacted → Confirmed → Completed / Declined / No-show), client details, chosen service, inspiration photos, notes, one-tap "Reply on WhatsApp" (prefilled), internal notes, simple filters. Optional "Add to calendar" (.ics download).

**Reviews manager:** add/edit/hide testimonials.

**Site settings:**
- Business name, tagline, WhatsApp number, email, Instagram/TikTok/Facebook handles
- Availability banner: "Taking bookings" / "Limited spots" / "Fully booked until [date]" with optional message; this drives the chip on the homepage and a notice on `/book`
- Opening days/hours
- Service areas list
- Policy texts (deposit, cancellation, late arrival, aftercare)
- Brand colours (accent + background, with a safe preset palette picker; validate contrast)
- SEO fields (meta title/description defaults)
- About page content

Everything the public site shows must come from here, never hard-coded.

---

## 7. Technical architecture

### Recommended stack (low cost, easy for Janco to maintain)
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS (+ a small set of shared components; optionally shadcn/ui primitives)
- **Backend/DB/Auth/Storage:** Supabase (Postgres, Row Level Security, Auth, Storage) — free tier is sufficient for a solo business
- **Image handling:** Supabase Storage + Next.js `<Image>` (or Supabase image transforms) with AVIF/WebP, responsive `sizes`, blur placeholders
- **Forms/validation:** React Hook Form + Zod, shared client/server schemas
- **Email:** Resend (free tier) for new-request notifications to Chloe
- **Hosting:** Vercel (free hobby tier is fine; confirm terms permit this commercial-ish use or use Cloudflare Pages/Netlify instead) **[verify at build time]**
- **Domain:** register a `.co.za`, first choice `nailsbychloe.co.za` (check availability; fall back to `nailsbychloe.com` or a close variant) **[TBC]**
- **Analytics:** privacy-friendly and cookie-free (Plausible, Umami, or Vercel Analytics) so no cookie banner is needed
- **Spam protection:** honeypot + server-side rate limiting; Cloudflare Turnstile if needed
- **Testing:** Vitest for logic/validation, Playwright for the critical flows (gallery → book → submit; admin login → upload)

> If Claude Code finds a simpler path that meets every requirement (e.g. all-in-one on Cloudflare with D1/R2), it may propose it in the README, but must keep: mobile-first performance, admin image upload from a phone, editable content, and near-zero running cost.

### Data model (Postgres / Supabase)
```
site_settings (single row)
  id, business_name, tagline, whatsapp_number, email, instagram_handle,
  tiktok_handle, facebook_url, availability_status (enum: open|limited|full),
  availability_message, full_until_date, hours_json, about_md,
  accent_color, bg_color, seo_title, seo_description, updated_at

policies
  id, key (deposit|cancellation|late|aftercare|payment), title, body_md, sort_order

service_categories
  id, name, slug, sort_order

services
  id, category_id, name, description, price_from_cents, price_to_cents (nullable),
  duration_minutes, deposit_type (none|fixed|percent), deposit_value,
  is_addon (bool), is_active, sort_order

service_areas
  id, name, travel_fee_cents (nullable), notes, is_active, sort_order

gallery_items
  id, slug, caption, alt_text, image_path, width, height, blur_data_url,
  is_featured, is_published, sort_order, service_id (nullable), created_at

gallery_tags
  id, name, slug, sort_order

gallery_item_tags
  gallery_item_id, tag_id

testimonials
  id, client_name, body, rating (nullable), gallery_item_id (nullable),
  is_published, created_at

booking_requests
  id, created_at, status (new|contacted|confirmed|completed|declined|no_show),
  client_name, whatsapp_e164, email (nullable), service_id, addon_ids[],
  area_id (nullable), area_text, preferred_date, preferred_windows[],
  design_gallery_item_id (nullable), notes, inspo_image_paths[] (max 3),
  consent_given_at, consent_text_version, internal_notes, ip_hash (for rate limiting)
```
Money stored in cents (ZAR) as integers. Phone numbers normalised to E.164 (`+27…`).

### Security & privacy
- Row Level Security: public can only `select` published/active content and `insert` booking requests (via a server route with validation, not directly from the browser); only authenticated admin users can read booking requests and write content.
- Inspiration-photo bucket is private; admin views via signed URLs. Gallery bucket is public-read.
- Validate and size-limit all uploads server-side (type, size, dimensions); strip EXIF GPS data from uploads.
- Admin routes protected by middleware; secure, httpOnly session cookies; rate-limit login.
- Security headers (CSP, X-Frame-Options, Referrer-Policy), HTTPS only.
- Never put secrets in client code; document all env vars in `.env.example`.
- **POPIA:** collect only what is needed, explicit consent checkbox with versioned text, privacy notice, and an easy deletion path (admin "delete client data" action + contact instruction). Hash IPs instead of storing raw IPs.
- **Chloe's safety:** no home address on the site, collect full client address only after she's agreed to the booking (over WhatsApp). The admin should show a small reminder card of mobile-tech safety habits **[optional, her call]**.

---

## 8. Performance, accessibility and quality bars

- **Performance (mobile, 4G throttled):** Lighthouse Performance ≥ 90, LCP < 2.5s, CLS < 0.1, INP < 200ms. Home page initial transfer under ~1 MB excluding lazy-loaded gallery images. No heavy sliders or third-party embeds (no Instagram widget).
- **Accessibility:** WCAG 2.2 AA target. Keyboard-navigable lightbox with focus trap and Esc to close; real `alt` text for every gallery image; visible focus rings; form labels and error messages announced; sufficient contrast; respects reduced-motion.
- **Browser support:** current Chrome/Safari/Samsung Internet on Android and iOS (the main audience), plus current desktop Chrome/Edge/Firefox/Safari.
- **Resilience:** forms show clear errors; if saving fails, show the WhatsApp fallback so the client can still reach Chloe.
- **Load-shedding awareness:** the public site is static/edge-cached so it remains fast; admin should save drafts locally if the connection drops mid-upload and retry.

---

## 9. SEO and discoverability

- Local keywords in titles/headings naturally, e.g. "Mobile nail tech in Roodepoort | Gel & acrylic nails at your door". Per-page unique titles/descriptions.
- `LocalBusiness` / `BeautySalon` JSON-LD with `areaServed` (service-area business, **no street address**), `sameAs` social links, price range, opening hours.
- Individual gallery set pages with descriptive alt text so Google Images can surface her work.
- `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph/Twitter cards with a branded share image (important when links are shared on WhatsApp/Instagram).
- Include a short guide (in README or a `docs/launch-checklist.md`) for Chloe/Janco to:
  1. Create a **Google Business Profile** as a service-area business (hide address),
  2. Add the website link to Instagram/TikTok bios and WhatsApp Business profile,
  3. Ask happy clients for Google reviews and add a "Leave a review" link,
  4. Create a **WhatsApp Business** account with a catalogue/greeting message pointing to the site.
- Create a QR code (SVG/PNG) for the site to print on business cards / aftercare cards.

---

## 10. Content Claude Code should draft (editable by Chloe)

Provide warm, concise, South African-English starter copy (not corporate, not cringe) for: hero headline/subline, "How it works" steps, About page skeleton with prompts for Chloe to fill in, FAQ answers, deposit/cancellation/late policy drafts, aftercare tips, privacy notice, booking confirmation message, and WhatsApp prefilled message template. Mark every draft clearly so Chloe edits it before launch. Use South African conventions (ZAR with "R" prefix, `+27` numbers, 24-hour or am/pm time consistently, "cellphone").

---

## 11. Tracking, analytics and success metrics

Track (cookie-free): page views, gallery opens, "Book now" clicks, WhatsApp clicks, form starts vs submissions, top traffic sources (Instagram/TikTok/Google). A tiny admin "This month" card: requests received, confirmed, top services. Review monthly: which designs get "I want this set" clicks, to guide what she posts.

---

## 12. Build phases and acceptance criteria

### Phase 0 — Setup (½ day)
Repo, Next.js + TS + Tailwind, lint/format, env handling, Supabase project + schema + RLS, CI check, deploy preview on Vercel.
**Done when:** a blank branded page deploys and the DB migrations run from the repo.

### Phase 1 — Public site foundation (core)
Design system (tokens, fonts, buttons, cards), layout with header/footer and mobile sticky action bar, Home, Services, About, FAQ, Contact, Privacy, Terms, 404, SEO basics, using seed/placeholder content from the DB.
**Done when:** all pages render from DB content on mobile and desktop, Lighthouse mobile ≥ 90 on Home, a11y checks pass.

### Phase 2 — Gallery
Gallery grid, filters, lightbox, set pages, lazy/responsive images, "I want this set" deep link.
**Done when:** 30+ test images scroll smoothly on a mid-range Android on throttled 4G, lightbox is keyboard- and swipe-accessible.

### Phase 3 — Admin panel
Auth, dashboard, gallery manager (multi-upload with compression, tags, reorder, featured), services/areas/policies/settings/testimonials managers.
**Done when:** Chloe can, from her phone and without help, log in, upload 5 photos with captions, change a price, and set "Fully booked until…", and see it live on the site within a minute.

### Phase 4 — Booking requests
Form with validation, inspiration photo upload, consent, success screen with WhatsApp handoff, admin inbox with statuses, email notification, spam protection, rate limiting.
**Done when:** an end-to-end test request lands in the admin and in Chloe's email, the prefilled WhatsApp link opens correctly on iOS and Android, and invalid numbers/oversized files are rejected cleanly.

### Phase 5 — Polish & launch
Animations, empty/error states, OG images, JSON-LD, sitemap, analytics, Playwright E2E for the key flows, security headers, real content import, domain + DNS + HTTPS, launch checklist (Google Business Profile, bio links, QR code), handover walkthrough doc for Chloe (screenshots, plain language, 1 page).
**Done when:** launch checklist is complete and Janco signs off.

### Phase 6 (later) — Growth features
Live availability calendar with time slots and buffers for travel; price estimator; PayFast deposit payments; automated reminders (WhatsApp Business API/SMS); gift vouchers; referral codes; before/after sliders; "Quick quote" chat widget.

---

## 13. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Chloe doesn't keep the gallery fresh | Make "add photos" a two-tap, phone-first flow; dashboard nudge "Last upload 3 weeks ago". |
| Spam booking requests | Honeypot, rate limit, Turnstile, easy "mark as spam". |
| Heavy images hurt load times on mobile data | Mandatory client-side compression, AVIF/WebP, lazy loading, strict image-size caps. |
| Clients expect instant booking | Clear copy that Chloe confirms by WhatsApp; Phase 6 adds live slots. |
| Safety/privacy of a solo mobile tech | No public home address, address collected only after confirmation, POPIA consent + deletion path. |
| Free-tier limits | Document limits in README, set storage/bandwidth alerts, keep images small. |
| Deposit friction lowers conversions | Deposit is optional per service; keep policy short and friendly; she can start without one and add it later. |

---

## 14. Open questions (use the defaults if not answered)

1. **Branding:** name is confirmed as "Nails by Chloe". Still to confirm: whether she has a logo or brand colours, and that the Instagram/TikTok handle `nailsbychloe` (or a close variant) is free.
2. **WhatsApp number & Instagram/TikTok handles** — needed for contact and handoff links.
3. **Photos:** how many quality photos exist right now? Aim for 15–20 before launch.
4. **Real price list:** services, from-prices, durations, travel tiers by area, add-ons, removal pricing.
5. **Deposit:** yes/no, amount, EFT vs later PayFast. Default: no online payment in v1; deposit instructions shared over WhatsApp after she accepts a request.
6. **Hours/days she works** around her other job, and typical response time promise.
7. **Domain:** `.co.za` preferred; who registers/pays.
8. **Services she does:** gel, acrylic, builder gel, press-ons, pedicures? (Only list what she actually offers.)
9. **Does she want a "bridal/events" section?** Default: skip until she asks.
10. **Languages:** English only by default; Afrikaans toggle can be a later add-on.

---

## 15. Definition of done (v1 launch)

- All Phase 1–5 acceptance criteria met.
- Chloe has edited and approved all copy, photos and prices.
- Lighthouse mobile ≥ 90 (Performance, Accessibility, Best Practices, SEO) on Home, Gallery, Services, Book.
- E2E tests pass for: browse gallery → open set → book request; admin upload; admin status change.
- Privacy notice, consent capture and data-deletion process in place.
- Domain live over HTTPS, analytics running, sitemap submitted to Google Search Console.
- README + one-page "How to use your admin" guide delivered.

---

## Sources (research)

- GlossGenius — Best nail salon website examples and design ideas for 2026: https://webflow.glossgenius.com/blog/nail-salon-websites
- HubSpot — 25 Nail Salon Website Designs We Love: https://blog.hubspot.com/website/nail-salon-websites
- Colorlib — 28 Best Nail Salon Website Examples 2026: https://colorlib.com/wp/nail-salon-website-examples/
- My Codeless Website — Best Nail Salon Websites of 2026: https://mycodelesswebsite.com/nail-salon-websites
- Sitekick — Websites for Nail Technicians: https://sitekick.pages.dev/industries/nail-technicians
- UniLink — Link in Bio for Nail Techs (layout order, 12–20 designs): https://unil.ink/blog/link-in-bio-for-nail-techs
- DigitalThrive — Nail Salon Websites guide (booking, deposits, gallery): https://www.digitalthriveai.com/en-us/resources/web-development/nail-salon-websites/
- Zenoti — Nail salon booking app (deposit at booking): https://www.zenoti.com/en-uk/salon-management-software/nail-salon-booking
- Katie Barnes Academy — Why every nail tech needs a deposit policy: https://www.katiebarnesacademy.com/en-ca/blogs/business-blogs/why-every-nail-tech-needs-a-deposit-policy-and-how-to-actually-stick-to-it
- NeverGhost — Deposit vs reminders trade-off: https://neverghost-website.pages.dev/blog/2026-03-06-should-nail-techs-charge-a-deposit-or-just-send-better-remin
- SchedulingKit — WhatsApp booking for nail salons: https://schedulingkit.com/whatsapp-booking/nail-salons
- Example SA independent nail tech booking page (deposit + proof of payment via WhatsApp): https://book.heygoldie.com/Gotnailedbydee
- Fresha SA listings (mobile-nail travel-tier pricing example): https://fresha.com/lp/en/bt/nail-salons/in/za-chatsworth/umhlatuzana
