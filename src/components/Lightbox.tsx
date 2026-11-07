"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CloseIcon } from "./icons";
import { NailImage } from "./NailImage";
import type { GalleryClientItem } from "./GalleryBrowser";

export function Lightbox({
  items,
  index,
  styleNames,
  onClose,
  onIndex,
}: {
  items: GalleryClientItem[];
  index: number;
  styleNames: Record<string, string>;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const item = items[index];
  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  // Native <dialog> gives us a real focus trap, Esc-to-close and an inert background.
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Preload neighbours so swiping feels instant.
  useEffect(() => {
    [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]].forEach((it) => {
      if (it) new Image().src = it.src;
    });
  }, [index, items]);

  if (!item) return null;

  return (
    <dialog
      ref={ref}
      aria-label={`${item.caption} (${index + 1} of ${items.length})`}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-bg backdrop:bg-ink/80"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm opacity-80" aria-live="polite">
            {index + 1} / {items.length}
          </p>
          <button type="button" onClick={onClose} className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close">
            <CloseIcon width={26} height={26} />
          </button>
        </div>

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
            touchX.current = null;
          }}
        >
          <NailImage key={item.slug} image={item} full priority className="max-h-full w-auto max-w-full rounded-xl object-contain" />
          {items.length > 1 && (
            <>
              <button type="button" onClick={prev} aria-label="Previous set" className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 md:inline-flex">
                <ChevronLeft width={28} height={28} />
              </button>
              <button type="button" onClick={next} aria-label="Next set" className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 md:inline-flex">
                <ChevronRight width={28} height={28} />
              </button>
            </>
          )}
        </div>

        <div className="mx-auto w-full max-w-2xl px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
          <p className="font-serif text-2xl">{item.caption}</p>
          {item.styles.length > 0 && (
            <p className="mt-1 text-sm opacity-75">{item.styles.map((s) => styleNames[s] ?? s).join(" · ")}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/book/?design=${item.slug}`} className="btn btn-primary flex-1 sm:flex-none" data-track="want-this-set">
              I want this set
            </Link>
            <Link href={`/gallery/${item.slug}/`} className="btn flex-1 border border-white/40 text-bg hover:bg-white/10 sm:flex-none">
              Share / details
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
