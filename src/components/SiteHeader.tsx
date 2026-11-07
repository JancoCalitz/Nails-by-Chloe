import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

export const NAV = [
  { href: "/gallery/", label: "Gallery" },
  { href: "/services/", label: "Prices" },
  { href: "/about/", label: "About" },
  { href: "/faq/", label: "FAQ" },
  { href: "/contact/", label: "Contact" },
];

export function SiteHeader({ businessName }: { businessName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-serif text-2xl tracking-tight no-underline md:text-[1.7rem]">
          {businessName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[0.95rem] font-medium no-underline hover:text-accent-strong">
              {n.label}
            </Link>
          ))}
          <Link href="/book/" className="btn btn-primary min-h-11 px-5 py-2" data-track="book-click-header">
            Book now
          </Link>
        </nav>
        <MobileMenu items={NAV} />
      </div>
    </header>
  );
}
