"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon width={26} height={26} /> : <MenuIcon width={26} height={26} />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-bg px-5 pb-28 pt-6"
        >
          <ul className="divide-y divide-line border-y border-line">
            {[{ href: "/", label: "Home" }, ...items].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex min-h-14 items-center font-serif text-3xl no-underline"
                  aria-current={pathname === n.href ? "page" : undefined}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/book/" className="btn btn-primary mt-8 w-full" data-track="book-click-menu">
            Book now
          </Link>
        </nav>
      )}
    </div>
  );
}
