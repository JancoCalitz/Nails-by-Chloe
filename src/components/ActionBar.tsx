"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "./icons";

/** Sticky bottom bar on phones: the two things almost every visitor wants. */
export function ActionBar({ whatsappHref }: { whatsappHref: string | null }) {
  const pathname = usePathname();
  const onBook = pathname?.startsWith("/book");
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pt-3 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-3">
        {!onBook && (
          <Link href="/book/" className="btn btn-primary flex-1" data-track="book-click-bar">
            Book now
          </Link>
        )}
        {whatsappHref ? (
          <a href={whatsappHref} className="btn btn-whatsapp flex-1" data-track="whatsapp-click-bar" rel="noopener">
            <WhatsAppIcon /> WhatsApp
          </a>
        ) : (
          <Link href="/contact/" className="btn btn-secondary flex-1">
            Contact
          </Link>
        )}
      </div>
    </div>
  );
}
