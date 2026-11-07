# Nails by Chloe

The website for Chloe's mobile nail business in Roodepoort: a portfolio, a price list and a booking request that goes to WhatsApp, plus a phone-friendly editor so Chloe can update everything herself.

- **Live site:** https://jancocalitz.github.io/Nails-by-Chloe/
- **Chloe's editor:** https://jancocalitz.github.io/Nails-by-Chloe/admin/
- **Chloe's help page:** https://jancocalitz.github.io/Nails-by-Chloe/manage/

`PLAN.md` is the original brief. Where this build differs from it, the reason is under [Decisions](#decisions).

---

## How Chloe uses the editor (plain language)

1. Open **/admin/** on your phone and tap **Sign In with Token**. Paste the token Janco gave you. You only do this once per phone.
2. **Add new photos:** tap 📸 **Gallery photos**, then **Add photo**. Pick a photo from your camera roll, type a short caption, choose the styles and tap **Save**. New photos go to the top. Drag them to change the order. Turn on **Show on homepage** for your best ones.
3. **Change a price:** open 💅 **Services & prices**, edit the number and tap **Save**.
4. **Fully booked?** Open ⚙️ **Settings**, set **Availability** to 🔴 *Fully booked*, pick a date and tap **Save**.
5. Wait about **2 minutes**, then refresh the website. Your change is live.

Good to know:

- The photo is shrunk on your phone before it uploads, so it uses very little data. Location info is removed from the photo.
- If something you typed is broken (for example a letter in a price), the site **won't update**. The old version stays online, so nothing can break. Ask Janco to have a look.
- Before launch: put in your WhatsApp number, Instagram and real prices, swap the SAMPLE photos for real ones, rewrite the About page in your own words, then switch off **Show "Preview site" banner**.

## How booking works

There is no database. The booking form checks the client's details (service, date, area, a valid SA cellphone number, consent) and builds a neat WhatsApp message. The client taps **Send on WhatsApp**, and it opens a chat with Chloe with everything filled in. Clients attach inspiration photos in that chat.

- **Optional email copy:** create a free key at [web3forms.com](https://web3forms.com) using Chloe's email and paste it into *Settings → Web3Forms key*. Each request is then also emailed to her.
- **Spam:** a hidden honeypot field blocks bots. Requests only go anywhere when the client sends the WhatsApp message themselves, so the risk is low.

---

## For Janco: setup & development

```bash
npm install
npm run dev          # http://localhost:3000 (also makes image thumbnails)
npm test             # unit tests + validates every content file
npm run lint && npm run typecheck
npm run build        # static site in ./out
npm run brand-assets # rebuild share image, icons and QR code (see below)
```

Requires Node 20+. No environment variables are needed locally. `.env.example` lists the two that the deploy sets.

### Project layout

| Path | What |
|---|---|
| `content/*.json` | **All site content** (settings, services, gallery, FAQ, policies, about, legal, reviews). The CMS edits these files. |
| `public/admin/` | Sveltia CMS (`index.html` + `config.yml`). The editor runs in the browser and commits to this repo. |
| `public/uploads/` | Photos uploaded through the CMS (WebP, max 2000px). |
| `public/samples/` | Clearly labelled SAMPLE placeholders. Delete them once real photos are in. |
| `src/lib/schema.ts` | Zod schemas. Content is validated at build time and in tests. |
| `src/lib/content.ts` | Loads content and resolves images. |
| `scripts/prepare-images.mjs` | Runs before every build: 640px WebP thumbnails, blur placeholders, real dimensions. |
| `scripts/postbuild-flatten-rsc.mjs` | Works around a Next 16 static-export file-naming bug for prefetch files, and writes `.nojekyll`. |
| `.github/workflows/deploy.yml` | Lint → type-check → test → build → deploy to GitHub Pages on every push to `main`. |

### Deploying

Every push to `main`, including every CMS save, triggers the GitHub Action. It runs in about 1–2 minutes. Pages is set to **Build and deployment → GitHub Actions**. The base path (`/Nails-by-Chloe`) and site URL come from `actions/configure-pages`, so a custom domain needs no code changes.

### Giving Chloe access to the editor (one-time)

1. Chloe creates a free GitHub account. Add her as a collaborator: *Repo → Settings → Collaborators*.
2. On her account, create a **fine-grained personal access token**: *Settings → Developer settings → Fine-grained tokens*. Use these settings:
   - Repository access: **Only select repositories → Nails-by-Chloe**
   - Permissions: **Contents: Read and write** (Metadata read-only is added automatically)
   - Expiration: the longest allowed. Put a reminder in your calendar to renew it.
3. On her phone, open `/admin/`, tap **Sign In with Token**, paste the token, then add the page to her home screen.

> If you'd rather she logs in with a normal "Sign in with GitHub" button, deploy the free [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) to Cloudflare Workers and add `base_url` under `backend` in `public/admin/config.yml`.

### Custom domain (e.g. nailsbychloe.co.za)

1. Register the domain. Add it under *Repo → Settings → Pages → Custom domain*, and point the DNS as GitHub describes (an `A`/`ALIAS` record for the apex, or a `CNAME` for `www`). Tick **Enforce HTTPS**.
2. Update `site_url` / `display_url` / `logo_url` in `public/admin/config.yml`.
3. Regenerate the QR code: `SITE_URL=https://nailsbychloe.co.za/ npm run brand-assets` and commit.

### Analytics (optional, cookie-free)

Create a free [GoatCounter](https://www.goatcounter.com) site and put its code (the `xyz` in `xyz.goatcounter.com`) in *Settings → GoatCounter code*. It counts page views and these events: `book-click-*`, `whatsapp-click-*`, `gallery-open`, `want-this-set`, `booking-form-start`, `booking-form-submit`. It uses no cookies, so no cookie banner is needed.

---

## Decisions

These are the choices I made where the plan's defaults didn't fit GitHub Pages hosting, as section 0.6 of the plan asks.

- **Static site instead of Next.js server + Supabase + Vercel.** GitHub Pages only serves static files. Content lives in JSON files in the repo, edited with **Sveltia CMS**, a free Git-based editor that works on phones. This meets the plan's must-haves: fast on mobile, photo upload from a phone, everything editable, zero running cost.
- **Bookings via WhatsApp only (no database or inbox).** Janco chose this. The form validates the request and hands it to WhatsApp, with an optional email copy. *Not built because of this:* the admin requests inbox, statuses, stored inspiration photos, server-side rate limiting and the "This month" stats card. If needed later, add Supabase (an insert-only RLS table) or a small Cloudflare Worker.
- **Reordering and multi-select tags** use the CMS's drag-to-reorder list and a relation field. Bulk delete happens one item at a time in the CMS.
- **No server security headers.** GitHub Pages can't set them (CSP, X-Frame-Options). Pages does serve over HTTPS. Moving to Cloudflare Pages later would allow a `_headers` file.
- **robots.txt** only takes effect at a domain root, so it starts working once a custom domain is set.
- **Prices are in whole rands** (not cents) so Chloe can edit them easily.
- **Not yet done from the plan:** Playwright E2E suite (the flows were checked manually with a headless browser), price estimator, Lighthouse audit on the live URL. See `docs/launch-checklist.md`.

## Free-tier limits

GitHub Pages: 1 GB site size and a soft limit of 100 GB bandwidth per month. GitHub Actions: free for public repos. At about 300 KB per photo, 1 GB holds roughly 3 000 photos.
