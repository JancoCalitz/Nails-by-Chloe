import type { Metadata } from "next";
import { Suspense } from "react";
import { activeServices, getGallery, getPolicies, getServices, getSettings } from "@/lib/content";
import { BookingForm, type BookingOptions } from "@/components/BookingForm";
import { PageHeader } from "@/components/Section";
import { PolicyList } from "@/components/Policies";
import { availabilityText } from "@/components/AvailabilityChip";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Send Chloe a booking request for mobile nails in Roodepoort. Pick your service, day and design — she’ll confirm on WhatsApp.",
  alternates: { canonical: "book/" },
};

export default function BookPage() {
  const settings = getSettings();
  const services = getServices();
  const categories = activeServices();
  const options: BookingOptions = {
    services: categories.flatMap((c) =>
      c.services.filter((s) => !s.addon).map((s) => ({ name: s.name, category: c.name, price_from: s.price_from, price_to: s.price_to })),
    ),
    addons: categories.flatMap((c) => c.services.filter((s) => s.addon).map((s) => ({ name: s.name, price_from: s.price_from, price_to: s.price_to }))),
    areas: services.areas.filter((a) => a.active).map((a) => ({ name: a.name, fee: a.fee })),
    showTravelFees: services.travel_mode === "tiers",
    designs: getGallery().map((g) => ({ slug: g.slug, caption: g.caption, thumb: g.thumb, blur: g.blur })),
    chloeWhatsapp: settings.whatsapp_number,
    responseTime: settings.response_time,
    emailKey: settings.booking_email_key,
    businessName: settings.business_name,
  };

  return (
    <>
      <PageHeader eyebrow="Book" title="Request a booking" intro="Fill this in and send it to me on WhatsApp. It only takes a minute." />
      <div className="container-page grid gap-12 py-10 md:grid-cols-[3fr_2fr] md:py-14">
        <div>
          {settings.availability_status !== "open" && (
            <p className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[0.95rem]">
              <strong>{availabilityText(settings)}.</strong> You’re welcome to send a request — I’ll offer you the next available slot.
            </p>
          )}
          <Suspense fallback={<p className="text-muted">Loading form…</p>}>
            <BookingForm options={options} />
          </Suspense>
        </div>
        <aside className="md:sticky md:top-24 md:self-start">
          <h2 className="text-3xl">Before you book</h2>
          <div className="mt-5">
            <PolicyList policies={getPolicies()} compact />
          </div>
        </aside>
      </div>
    </>
  );
}
