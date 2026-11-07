import Link from "next/link";
import type { Settings } from "@/lib/schema";
import { NAV } from "./SiteHeader";

export function SiteFooter({
  settings,
  socials,
  whatsappHref,
}: {
  settings: Settings;
  socials: { label: string; href: string }[];
  whatsappHref: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-3xl">{settings.business_name}</p>
          <p className="mt-2 text-muted">{settings.tagline}</p>
          <p className="mt-1 text-sm text-muted">Mobile service — I come to you.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-y-2 text-[0.95rem]">
            {[...NAV, { href: "/book/", label: "Book" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="no-underline hover:text-accent-strong">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 text-[0.95rem]">
          {whatsappHref && (
            <p>
              <a href={whatsappHref} className="link" data-track="whatsapp-click-footer" rel="noopener">
                Chat on WhatsApp
              </a>
            </p>
          )}
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`} className="link">
                {settings.email}
              </a>
            </p>
          )}
          {socials.map((s) => (
            <p key={s.href}>
              <a href={s.href} className="link" target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </p>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} {settings.business_name}
          </p>
          <p className="flex gap-5">
            <Link href="/privacy/" className="no-underline hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms/" className="no-underline hover:text-ink">
              Booking terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
