import Link from "next/link";
import { activeServices, getAbout, getGallery, getReviews, getServices, getSettings, resolveImage, socialLinks } from "@/lib/content";
import { priceLabel } from "@/lib/format";
import { AvailabilityChip } from "@/components/AvailabilityChip";
import { NailImage } from "@/components/NailImage";
import { SectionHeading } from "@/components/Section";
import { ArrowRight, InstagramIcon } from "@/components/icons";

export default function HomePage() {
  const settings = getSettings();
  const gallery = getGallery();
  const featured = (gallery.filter((g) => g.featured).length ? gallery.filter((g) => g.featured) : gallery).slice(0, 8);
  const heroImg = resolveImage(settings.hero_image) ?? featured[0];
  const services = activeServices()
    .flatMap((c) => c.services)
    .filter((s) => !s.addon);
  const headline = (services.some((s) => s.featured) ? services.filter((s) => s.featured) : services).slice(0, 4);
  const reviews = getReviews().slice(0, 3);
  const about = getAbout();
  const aboutImg = resolveImage(about.photo);
  const areas = getServices().areas.filter((a) => a.active);
  const instagram = socialLinks(settings).find((l) => l.label === "Instagram");

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div className="blob -left-32 top-10 h-80 w-80 bg-tint" aria-hidden />
        <div className="blob -right-20 bottom-0 h-72 w-72 bg-champagne/50" aria-hidden />
        <div className="container-page relative z-10 grid items-center gap-8 pb-14 pt-6 md:grid-cols-2 md:gap-14 md:py-20">
          {heroImg && (
            <div className="relative order-first md:order-last">
              <NailImage
                image={{ ...heroImg, alt: "Recent nail set by Chloe" }}
                sizes="(min-width: 768px) 45vw, 100vw"
                priority
                className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(42,36,34,0.45)] max-md:max-h-[62vh]"
              />
            </div>
          )}
          <div>
            <AvailabilityChip settings={settings} />
            <h1 className="mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{settings.hero_headline}</h1>
            <p className="mt-5 max-w-lg text-lg text-muted">{settings.hero_subline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book/" className="btn btn-primary" data-track="book-click-hero">
                Book now
              </Link>
              <Link href="/gallery/" className="btn btn-secondary">
                See my work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Latest work */}
      {featured.length > 0 && (
        <section className="py-14 md:py-20" aria-labelledby="latest-work">
          <div className="container-page flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Latest work</p>
              <h2 id="latest-work" className="text-4xl md:text-5xl">
                Fresh sets
              </h2>
            </div>
            <Link href="/gallery/" className="link hidden shrink-0 sm:inline-flex sm:items-center sm:gap-1">
              Full gallery <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <ul className="no-scrollbar container-page mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
            {featured.map((item) => (
              <li key={item.slug} className="w-[62vw] shrink-0 snap-start sm:w-[40vw] md:w-auto">
                <Link href={`/gallery/${item.slug}/`} className="group block overflow-hidden rounded-2xl">
                  <NailImage image={item} sizes="(min-width: 768px) 25vw, 62vw" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="sr-only">{item.caption}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-page mt-6 sm:hidden">
            <Link href="/gallery/" className="link inline-flex items-center gap-1">
              See the full gallery <ArrowRight width={16} height={16} />
            </Link>
          </div>
        </section>
      )}

      {/* 3. Services snapshot */}
      <section className="bg-tint/60 py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Services" title="What I do" intro="Prices start here and are confirmed on WhatsApp once I've seen your design." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {headline.map((s) => (
              <li key={s.name} className="card reveal p-6">
                <h3 className="text-2xl">{s.name}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{s.description}</p>
                <p className="mt-4 font-semibold text-accent-strong">{priceLabel(s.price_from, s.price_to)}</p>
              </li>
            ))}
          </ul>
          <Link href="/services/" className="btn btn-secondary mt-10">
            Full price list
          </Link>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="Booking is easy" align="center" />
          <ol className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              ["Pick your set", "Browse my gallery and choose a design you love — or bring your own inspo."],
              ["Send a request", "Tell me the service, your preferred day and your area. It takes a minute."],
              ["I confirm on WhatsApp", `I'll reply within ${settings.response_time} to confirm your time and final price.`],
            ].map(([title, body], i) => (
              <li key={title} className="reveal text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 font-serif text-2xl text-accent-strong">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-2xl">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href="/book/" className="btn btn-primary" data-track="book-click-how">
              Send a booking request
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Reviews (hidden until Chloe adds real ones) */}
      {reviews.length > 0 && (
        <section className="bg-surface py-16 md:py-24" aria-labelledby="reviews">
          <div className="container-page">
            <p className="eyebrow mb-3">Kind words</p>
            <h2 id="reviews" className="text-4xl md:text-5xl">
              From my clients
            </h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {reviews.map((r, i) => (
                <li key={i} className="reveal rounded-[var(--radius-card)] bg-tint/60 p-7">
                  <blockquote className="font-serif text-2xl leading-snug">“{r.body}”</blockquote>
                  <p className="mt-4 text-sm font-semibold">— {r.client_name}</p>
                </li>
              ))}
            </ul>
            {settings.google_review_url && (
              <a href={settings.google_review_url} className="link mt-8 inline-block" target="_blank" rel="noopener noreferrer">
                Leave a review on Google
              </a>
            )}
          </div>
        </section>
      )}

      {/* 6. About teaser */}
      <section className="py-16 md:py-24">
        <div className="container-page grid items-center gap-10 md:grid-cols-[2fr_3fr]">
          {aboutImg ? (
            <NailImage image={{ ...aboutImg, alt: "Chloe, mobile nail tech" }} className="aspect-[4/5] w-full max-w-sm rounded-[2rem] object-cover" />
          ) : (
            <div className="flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-[2rem] bg-tint font-serif text-8xl text-accent-strong/60" aria-hidden>
              C
            </div>
          )}
          <div>
            <p className="eyebrow mb-3">About</p>
            <h2 className="text-4xl md:text-5xl">{about.heading}</h2>
            <p className="mt-5 max-w-xl text-lg text-muted">{about.teaser}</p>
            <Link href="/about/" className="link mt-6 inline-flex items-center gap-1">
              More about me <ArrowRight width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Service area */}
      {areas.length > 0 && (
        <section className="bg-tint/60 py-16 md:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Where I travel" title="I come to you" />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {areas.map((a) => (
                <li key={a.name} className="rounded-full border border-line bg-surface px-4 py-2 text-[0.95rem]">
                  {a.name}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-muted">
              Not sure if I travel to you?{" "}
              <Link href="/contact/" className="link">
                Ask me
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      {/* 8. Final CTA + Instagram */}
      <section className="py-16 md:py-24">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-2xl text-4xl md:text-6xl">Ready for your next set?</h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted">Send a request and I’ll get back to you on WhatsApp.</p>
          <Link href="/book/" className="btn btn-primary mt-8" data-track="book-click-final">
            Book now
          </Link>
          {instagram && (
            <div className="mt-16">
              <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium" data-track="instagram-click">
                <InstagramIcon /> Follow on Instagram
              </a>
              <ul className="mx-auto mt-6 grid max-w-3xl grid-cols-3 gap-2 md:grid-cols-6">
                {gallery.slice(0, 6).map((g) => (
                  <li key={g.slug}>
                    <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl" tabIndex={-1} aria-hidden>
                      <NailImage image={g} sizes="(min-width: 768px) 16vw, 33vw" className="aspect-square w-full object-cover" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
