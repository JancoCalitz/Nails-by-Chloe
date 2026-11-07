# Launch checklist

## Content (Chloe, in the editor)
- [ ] WhatsApp number, email, Instagram/TikTok handles (*Settings*)
- [ ] Real services and prices, durations, travel areas and fees (*Services & prices*)
- [ ] 15–20 of the best real photos uploaded with captions and styles; 6–8 marked **Show on homepage**
- [ ] All SAMPLE photos removed from the gallery (and `public/samples/` deleted by Janco)
- [ ] Homepage main photo set
- [ ] About page rewritten in Chloe's words, with her photo; products listed
- [ ] Working hours and "I usually reply within…" checked
- [ ] Policies (deposit, cancellation, late, payment) and FAQ answers read and edited
- [ ] Privacy notice and booking terms reviewed (drafts, not legal advice)
- [ ] "Preview site" banner switched **off**

## Tech (Janco)
- [ ] Chloe has a GitHub account, collaborator access and a token, and can sign in to `/admin/` on her phone
- [ ] Test: Chloe uploads 5 photos, changes a price and sets "Fully booked until…", then sees it live within ~2 min
- [ ] Test booking from an iPhone and an Android: the WhatsApp message opens with everything filled in
- [ ] Optional: Web3Forms key for email copies; GoatCounter for stats
- [ ] Custom domain + HTTPS (see README); update CMS `site_url`; regenerate QR code
- [ ] Lighthouse (mobile) on Home, Gallery, Services, Book: aim for 90+ in all categories
- [ ] Submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console) (after the custom domain)

## Getting found
1. **Google Business Profile:** create it as a *service-area business* and **hide the address**. Set the service areas to Roodepoort and surrounds, add the website link, photos and hours.
2. Put the website link in the Instagram/TikTok bios and the WhatsApp Business profile.
3. **WhatsApp Business:** set a greeting message and catalogue that point to the website.
4. Ask happy clients for a Google review; paste the review link into *Settings → Google review link*.
5. Print the QR code (`public/qr-code.png`) on business cards and aftercare cards.
