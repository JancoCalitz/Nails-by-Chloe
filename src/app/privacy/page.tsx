import type { Metadata } from "next";
import { getLegal } from "@/lib/content";
import { PageHeader } from "@/components/Section";
import { RichText } from "@/components/RichText";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Nails by Chloe handles your personal information (POPIA).",
  alternates: { canonical: "privacy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy notice" />
      <div className="container-page max-w-3xl py-12">
        <RichText text={getLegal().privacy} className="text-lg" />
      </div>
    </>
  );
}
