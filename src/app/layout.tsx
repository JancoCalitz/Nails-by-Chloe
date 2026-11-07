import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { getServices, getSettings, socialLinks } from "@/lib/content";
import { themeFrom } from "@/lib/color";
import { SITE_URL, absoluteUrl, withBase } from "@/lib/paths";
import { whatsappLink } from "@/lib/whatsapp";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ActionBar } from "@/components/ActionBar";
import { Analytics } from "@/components/Analytics";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export function generateMetadata(): Metadata {
  const s = getSettings();
  return {
    metadataBase: new URL(SITE_URL + "/"),
    title: { default: s.seo_title, template: `%s | ${s.business_name}` },
    description: s.seo_description,
    applicationName: s.business_name,
    openGraph: {
      type: "website",
      siteName: s.business_name,
      locale: "en_ZA",
      title: s.seo_title,
      description: s.seo_description,
      images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: s.business_name }],
    },
    twitter: { card: "summary_large_image", images: [absoluteUrl("/og-image.png")] },
    icons: {
      icon: [{ url: withBase("/favicon.svg"), type: "image/svg+xml" }, { url: withBase("/icon-192.png"), sizes: "192x192" }],
      apple: withBase("/apple-touch-icon.png"),
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#FBF7F4", width: "device-width", initialScale: 1 };

function localBusinessJsonLd() {
  const s = getSettings();
  const services = getServices();
  const socials = socialLinks(s).map((l) => l.href);
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: s.business_name,
    description: s.seo_description,
    url: absoluteUrl("/"),
    image: absoluteUrl("/og-image.png"),
    priceRange: s.price_range || undefined,
    // Service-area business: no street address is published, for Chloe's safety.
    address: { "@type": "PostalAddress", addressLocality: "Roodepoort", addressRegion: "Gauteng", addressCountry: "ZA" },
    areaServed: services.areas.filter((a) => a.active).map((a) => ({ "@type": "Place", name: `${a.name}, Gauteng` })),
    telephone: s.whatsapp_number || undefined,
    email: s.email || undefined,
    sameAs: socials.length ? socials : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  const theme = themeFrom(settings.accent_color, settings.bg_color);
  const wa = whatsappLink(settings.whatsapp_number, "Hi Chloe! I found you on your website 💅");
  const themeCss = `:root{--color-accent:${theme.accent};--color-accent-strong:${theme.accentStrong};--color-accent-hover:${theme.accentHover};--color-bg:${theme.bg};--color-tint:${theme.tint}}`;

  return (
    <html lang="en-ZA" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        {settings.draft_notice && (
          <p className="bg-ink px-4 py-2 text-center text-sm text-bg">
            Preview site — photos, prices and text are drafts and not final yet.
          </p>
        )}
        <SiteHeader businessName={settings.business_name} />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} socials={socialLinks(settings)} whatsappHref={wa} />
        <ActionBar whatsappHref={wa} />
        <Analytics code={settings.goatcounter_code} />
      </body>
    </html>
  );
}
