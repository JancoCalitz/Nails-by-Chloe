import type { Metadata } from "next";
import Link from "next/link";
import { getFaqs, getPolicies } from "@/lib/content";
import { PageHeader } from "@/components/Section";
import { PolicyList } from "@/components/Policies";
import { RichText } from "@/components/RichText";
import { PlusIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "FAQ & policies",
  description: "How booking works, deposits, cancellations, prep, aftercare and where Chloe travels for mobile nails in Roodepoort.",
  alternates: { canonical: "faq/" },
};

export default function FaqPage() {
  const faqs = getFaqs();
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Questions & policies" intro="Everything you need to know before your appointment." />
      <div className="container-page grid gap-14 py-12 md:grid-cols-[3fr_2fr] md:py-16">
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.question} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <PlusIcon className="shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <RichText text={f.answer} className="pb-5 text-muted" />
            </details>
          ))}
        </div>
        <aside>
          <h2 className="text-3xl">Policies</h2>
          <div className="mt-5">
            <PolicyList policies={getPolicies()} compact />
          </div>
          <p className="mt-6 text-muted">
            Still unsure?{" "}
            <Link href="/contact/" className="link">
              Ask me anything
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
