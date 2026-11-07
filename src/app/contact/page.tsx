import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSettings, socialLinks } from "@/lib/content";
import { displaySaMobile } from "@/lib/phone";
import { whatsappLink } from "@/lib/whatsapp";
import { PageHeader } from "@/components/Section";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "WhatsApp Chloe for mobile nails in Roodepoort and surrounds. Hours, service area and social links.",
  alternates: { canonical: "contact/" },
};

export default function ContactPage() {
  const s = getSettings();
  const wa = whatsappLink(s.whatsapp_number, "Hi Chloe! I have a question 💅");
  const socials = socialLinks(s);
  const areas = getServices().areas.filter((a) => a.active);

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s chat" intro={`WhatsApp is the quickest way to reach me — I usually reply within ${s.response_time}.`} />
      <div className="container-page grid gap-6 py-12 md:grid-cols-2 md:py-16">
        <div className="card p-7">
          <h2 className="text-3xl">Get in touch</h2>
          {wa ? (
            <a href={wa} className="btn btn-whatsapp mt-6 w-full sm:w-auto" data-track="whatsapp-click-contact" rel="noopener">
              <WhatsAppIcon /> WhatsApp {displaySaMobile(s.whatsapp_number)}
            </a>
          ) : (
            <p className="mt-6 rounded-xl bg-tint/70 p-4 text-sm">WhatsApp number coming soon.</p>
          )}
          <ul className="mt-6 space-y-2">
            {s.email && (
              <li>
                Email:{" "}
                <a href={`mailto:${s.email}`} className="link">
                  {s.email}
                </a>
              </li>
            )}
            {socials.map((l) => (
              <li key={l.href}>
                {l.label}:{" "}
                <a href={l.href} className="link" target="_blank" rel="noopener noreferrer">
                  {l.href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
            ))}
          </ul>
          <Link href="/book/" className="btn btn-primary mt-8 w-full sm:w-auto" data-track="book-click-contact">
            Send a booking request
          </Link>
        </div>

        <div className="space-y-6">
          {s.hours.length > 0 && (
            <div className="card p-7">
              <h2 className="text-3xl">When I work</h2>
              <dl className="mt-4 divide-y divide-line">
                {s.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 py-2.5">
                    <dt className="font-medium">{h.days}</dt>
                    <dd className="text-right text-muted">{h.times}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="card p-7">
            <h2 className="text-3xl">Where I work</h2>
            <p className="mt-3 text-muted">Mobile service · Roodepoort & surrounds. I come to your home — there’s no salon address.</p>
            {areas.length > 0 && <p className="mt-3 text-[0.95rem]">{areas.map((a) => a.name).join(" · ")}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
