import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGallery, getStyles } from "@/lib/content";
import { SITE_URL } from "@/lib/paths";
import { NailImage } from "@/components/NailImage";
import { ChevronLeft } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  const items = getGallery();
  // Static export needs at least one param; a placeholder keeps the build happy with an empty gallery.
  return items.length ? items.map((i) => ({ slug: i.slug })) : [{ slug: "none" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getGallery().find((i) => i.slug === slug);
  if (!item) return {};
  return {
    title: item.caption,
    description: `${item.caption} — a nail set by Chloe, mobile nail tech in Roodepoort. Book this set or something similar.`,
    alternates: { canonical: `gallery/${slug}/` },
    // item.src already includes the base path, so join it to the site's origin.
    openGraph: item.isSample
      ? undefined
      : { images: [{ url: new URL(item.src, SITE_URL).toString(), width: item.width, height: item.height }] },
  };
}

export default async function GallerySetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = getGallery();
  const index = items.findIndex((i) => i.slug === slug);
  if (index < 0) notFound();
  const item = items[index];
  const styleNames = Object.fromEntries(getStyles().map((s) => [s.slug, s.name]));
  const more = items.filter((i) => i.slug !== slug && i.styles.some((s) => item.styles.includes(s))).slice(0, 4);

  return (
    <div className="container-page py-8 md:py-14">
      <Link href="/gallery/" className="inline-flex min-h-11 items-center gap-1 text-[0.95rem] font-medium no-underline hover:text-accent-strong">
        <ChevronLeft width={18} height={18} /> Back to gallery
      </Link>
      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-14">
        <NailImage image={item} sizes="(min-width: 768px) 50vw, 100vw" priority className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        <div className="md:pt-8">
          {item.isSample && <p className="mb-3 inline-block rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bg">Placeholder</p>}
          <h1 className="text-5xl">{item.caption}</h1>
          {item.styles.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.styles.map((s) => (
                <li key={s}>
                  <Link href={`/gallery/?style=${s}`} className="chip no-underline">
                    {styleNames[s] ?? s}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-lg text-muted">
            Love this one? Send me a request with this set and I’ll confirm the price and time on WhatsApp.
          </p>
          <Link href={`/book/?design=${item.slug}`} className="btn btn-primary mt-8 w-full sm:w-auto" data-track="want-this-set">
            I want this set
          </Link>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl">Similar sets</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/gallery/${m.slug}/`} className="group block overflow-hidden rounded-2xl">
                  <NailImage image={m} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="sr-only">{m.caption}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
