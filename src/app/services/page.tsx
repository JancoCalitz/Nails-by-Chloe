import type { Metadata } from "next";
import Link from "next/link";
import { activeServices, getPolicies, getServices } from "@/lib/content";
import { durationLabel, priceLabel, rand, slugify } from "@/lib/format";
import { PageHeader, SectionHeading } from "@/components/Section";
import { PolicyList } from "@/components/Policies";

export const metadata: Metadata = {
  title: "Prices & services",
  description: "Gel polish, overlays, acrylic, builder gel, pedicures, press-ons and nail art prices for Chloe's mobile nail service in Roodepoort. From R200.",
  alternates: { canonical: "services/" },
};

export default function ServicesPage() {
  const content = getServices();
  const categories = activeServices();
  const areas = content.areas.filter((a) => a.active);

  return (
    <>
      <PageHeader eyebrow="Prices" title="Services & pricing" intro={content.price_note} />

      <div className="container-page py-12 md:py-16">
        {categories.length > 1 && (
          <nav aria-label="Service categories" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            {categories.map((c) => (
              <a key={c.name} href={`#${slugify(c.name)}`} className="chip no-underline">
                {c.name}
              </a>
            ))}
          </nav>
        )}

        <div className="space-y-14">
          {categories.map((c) => (
            <section key={c.name} id={slugify(c.name)} className="scroll-mt-24" aria-labelledby={`${slugify(c.name)}-h`}>
              <h2 id={`${slugify(c.name)}-h`} className="text-4xl">
                {c.name}
              </h2>
              {c.intro && <p className="mt-2 text-muted">{c.intro}</p>}
              <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                {c.services.map((s) => (
                  <li key={s.name} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <h3 className="font-sans text-lg font-semibold">{s.name}</h3>
                      {s.description && <p className="mt-1 text-[0.95rem] text-muted">{s.description}</p>}
                      <p className="mt-1.5 flex flex-wrap gap-x-4 text-sm text-muted">
                        {s.duration_minutes > 0 && <span>≈ {durationLabel(s.duration_minutes)}</span>}
                        {s.deposit && <span>Deposit: {s.deposit}</span>}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-semibold text-accent-strong sm:text-right">{priceLabel(s.price_from, s.price_to)}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {content.price_factors.length > 0 && (
        <section className="bg-tint/60 py-14 md:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Good to know" title="What affects your price" />
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {content.price_factors.map((f) => (
                <li key={f.title} className="card p-6">
                  <h3 className="text-2xl">{f.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-muted">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Travel" title="Travel fees" />
            {content.travel_mode === "quote" || areas.length === 0 ? (
              <p className="mt-6 text-muted">Travel is quoted by distance — I’ll confirm it with your booking.</p>
            ) : (
              <table className="mt-6 w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-left">
                <caption className="sr-only">Travel fee by area</caption>
                <thead className="bg-tint/60 text-sm">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Area
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      Travel fee
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {areas.map((a) => (
                    <tr key={a.name}>
                      <td className="px-5 py-3">
                        {a.name}
                        {a.notes && <span className="block text-sm text-muted">{a.notes}</span>}
                      </td>
                      <td className="px-5 py-3 text-right font-medium">{a.fee ? rand(a.fee) : "Free"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {content.travel_note && (
              <p className="mt-4 text-muted">
                {content.travel_note}{" "}
                <Link href="/contact/" className="link">
                  Contact me
                </Link>
              </p>
            )}
          </div>
          <div>
            <SectionHeading eyebrow="Policies" title="The fine print" />
            <div className="mt-6">
              <PolicyList policies={getPolicies()} compact />
            </div>
            <Link href="/faq/" className="link mt-4 inline-block">
              More questions? Read the FAQ
            </Link>
          </div>
        </div>
        <div className="container-page mt-14 text-center">
          <Link href="/book/" className="btn btn-primary" data-track="book-click-services">
            Book now
          </Link>
        </div>
      </section>
    </>
  );
}
