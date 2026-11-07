import type { Metadata } from "next";
import Link from "next/link";
import { getAbout, resolveImage } from "@/lib/content";
import { NailImage } from "@/components/NailImage";
import { RichText } from "@/components/RichText";

export const metadata: Metadata = {
  title: "About Chloe",
  description: "Meet Chloe, a mobile nail tech in Roodepoort who brings the salon to your home — with clean tools and a calm, friendly appointment.",
  alternates: { canonical: "about/" },
};

export default function AboutPage() {
  const about = getAbout();
  const photo = resolveImage(about.photo);
  const blocks = [
    { title: "Products I use", body: about.products },
    { title: "Clean & safe", body: about.hygiene },
    { title: "My mobile setup", body: about.setup },
  ].filter((b) => b.body.trim());

  return (
    <div className="container-page py-12 md:py-20">
      <div className="grid items-start gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
        {photo ? (
          <NailImage image={{ ...photo, alt: "Chloe, mobile nail tech in Roodepoort" }} priority sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[2rem] bg-tint font-serif text-9xl text-accent-strong/60" aria-hidden>
            C
          </div>
        )}
        <div>
          <p className="eyebrow mb-3">About</p>
          <h1 className="text-5xl md:text-6xl">{about.heading}</h1>
          <p className="mt-5 text-xl text-muted">{about.teaser}</p>
          <RichText text={about.story} className="mt-8 text-lg" />
        </div>
      </div>

      {blocks.length > 0 && (
        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {blocks.map((b) => (
            <li key={b.title} className="card reveal p-6">
              <h2 className="text-2xl">{b.title}</h2>
              <RichText text={b.body} className="mt-2 text-[0.95rem] text-muted" />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-16 text-center">
        <Link href="/book/" className="btn btn-primary" data-track="book-click-about">
          Book with me
        </Link>
      </div>
    </div>
  );
}
