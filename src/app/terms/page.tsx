import type { Metadata } from "next";
import { getLegal } from "@/lib/content";
import { PageHeader } from "@/components/Section";
import { RichText } from "@/components/RichText";

export const metadata: Metadata = {
  title: "Booking terms",
  description: "Booking, deposit, cancellation and aftercare terms for Nails by Chloe.",
  alternates: { canonical: "terms/" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Booking terms" />
      <div className="container-page max-w-3xl py-12">
        <RichText text={getLegal().terms} className="text-lg" />
      </div>
    </>
  );
}
