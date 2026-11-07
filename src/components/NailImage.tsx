import type { CSSProperties } from "react";

export interface NailImageData {
  thumb: string;
  src: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  blur: string;
  alt: string;
}

/**
 * Lightweight responsive image: a small WebP thumbnail with explicit dimensions
 * (no layout shift) and a blurred placeholder painted underneath while it loads.
 */
export function NailImage({
  image,
  full = false,
  priority = false,
  className = "",
  sizes,
}: {
  image: NailImageData;
  full?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const style: CSSProperties = image.blur
    ? { backgroundImage: `url(${image.blur})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: "var(--color-tint)" };
  const src = full ? image.src : image.thumb;
  return (
    <img
      src={src}
      srcSet={full ? undefined : `${image.thumb} ${image.thumbWidth}w, ${image.src} ${image.width}w`}
      sizes={full ? undefined : (sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw")}
      width={full ? image.width : image.thumbWidth}
      height={full ? image.height : image.thumbHeight}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
