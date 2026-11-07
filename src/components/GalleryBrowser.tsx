"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { NailImage, type NailImageData } from "./NailImage";
import { Lightbox } from "./Lightbox";
import { track } from "./Analytics";

export interface GalleryClientItem extends NailImageData {
  slug: string;
  caption: string;
  styles: string[];
}

const PAGE = 24;

export function GalleryBrowser({
  items,
  styles,
}: {
  items: GalleryClientItem[];
  styles: { name: string; slug: string }[];
}) {
  const params = useSearchParams();
  const initial = params.get("style") ?? "all";
  const [style, setStyle] = useState(styles.some((s) => s.slug === initial) ? initial : "all");
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  // Only show filter chips for styles that actually have photos.
  const usedStyles = useMemo(() => styles.filter((s) => items.some((i) => i.styles.includes(s.slug))), [styles, items]);
  const styleNames = useMemo(() => Object.fromEntries(styles.map((s) => [s.slug, s.name])), [styles]);
  const filtered = useMemo(() => (style === "all" ? items : items.filter((i) => i.styles.includes(style))), [items, style]);
  const visible = filtered.slice(0, limit);

  function choose(slug: string) {
    setStyle(slug);
    setLimit(PAGE);
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("style");
    else url.searchParams.set("style", slug);
    window.history.replaceState(null, "", url);
  }

  return (
    <div>
      {usedStyles.length > 0 && (
        <div role="group" aria-label="Filter by style" className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {[{ name: "All", slug: "all" }, ...usedStyles].map((s) => (
            <button key={s.slug} type="button" className="chip" aria-pressed={style === s.slug} onClick={() => choose(s.slug)}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? "set" : "sets"}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No sets in this style yet — check back soon.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {visible.map((item, i) => (
            <li key={item.slug}>
              <button
                type="button"
                onClick={() => {
                  setOpen(i);
                  track("gallery-open");
                }}
                className="group block w-full overflow-hidden rounded-2xl text-left"
                aria-label={`Open ${item.caption}`}
              >
                <NailImage
                  image={item}
                  priority={i < 4}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {filtered.length > limit && (
        <div className="mt-10 text-center">
          <button type="button" className="btn btn-secondary" onClick={() => setLimit((l) => l + PAGE)}>
            Load more
          </button>
        </div>
      )}

      {open !== null && (
        <Lightbox items={visible} index={open} styleNames={styleNames} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </div>
  );
}
