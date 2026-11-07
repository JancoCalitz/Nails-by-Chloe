"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    goatcounter?: { count: (o: { path: string; title?: string; event?: boolean }) => void };
  }
}

/** Send a custom event (e.g. "whatsapp-click") to the cookie-free analytics, if enabled. */
export function track(event: string) {
  try {
    window.goatcounter?.count({ path: event, title: event, event: true });
  } catch {
    /* analytics must never break the site */
  }
}

/**
 * Cookie-free GoatCounter analytics (no cookie banner needed). Disabled until a
 * GoatCounter code is set in the CMS. Any element with data-track="name" is
 * counted as an event when clicked.
 */
export function Analytics({ code }: { code: string }) {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!code) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    document.body.appendChild(s);
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) track(el.dataset.track);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [code]);

  // count.js records the first page view itself; count client-side navigations here.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      window.goatcounter?.count({ path: location.pathname });
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
