import type { Metadata } from "next";
import { Suspense } from "react";
import { getGallery, getStyles } from "@/lib/content";
import { PageHeader } from "@/components/Section";
import { GalleryBrowser } from "@/components/GalleryBrowser";

export const metadata: Metadata = {
  title: "Gallery — nail sets in Roodepoort",
  description: "Browse gel, acrylic, French, chrome and nail art sets by Chloe, a mobile nail tech in Roodepoort. Tap any set to book it.",
  alternates: { canonical: "gallery/" },
};

export default function GalleryPage() {
  const items = getGallery().map(({ slug, caption, alt, styles, thumb, src, width, height, thumbWidth, thumbHeight, blur }) => ({
    slug,
    caption,
    alt,
    styles,
    thumb,
    src,
    width,
    height,
    thumbWidth,
    thumbHeight,
    blur,
  }));
  return (
    <>
      <PageHeader eyebrow="Gallery" title="My work" intro="Tap a set to see it bigger — then tap “I want this set” to book it." />
      <div className="container-page py-10 md:py-14">
        <Suspense fallback={null}>
          <GalleryBrowser items={items} styles={getStyles()} />
        </Suspense>
      </div>
    </>
  );
}
