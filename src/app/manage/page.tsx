import type { Metadata } from "next";
import { withBase } from "@/lib/paths";

export const metadata: Metadata = { title: "Manage your site", robots: { index: false, follow: false } };

const TIPS = [
  "Use daylight from a window — no flash, no yellow lamps.",
  "Hold the phone upright (portrait) and fill the frame with the hand.",
  "Plain background: a white towel, a marble tile or your mat.",
  "Clean up cuticles and wipe the nails before the photo.",
  "Take a few angles, then upload only the best one or two.",
];

export default function ManagePage() {
  return (
    <div className="container-page max-w-2xl py-12">
      <p className="eyebrow">Chloe’s corner</p>
      <h1 className="mt-2 text-5xl">Manage your site</h1>
      <p className="mt-3 text-muted">Bookmark this page on your phone’s home screen.</p>

      <div className="mt-8 grid gap-4">
        <a href={withBase("/admin/")} className="card block p-6 no-underline transition hover:border-accent">
          <p className="font-serif text-3xl">📸 Add photos & edit the site</p>
          <p className="mt-1 text-muted">Upload new sets, change prices, mark yourself fully booked, edit your About page and policies.</p>
        </a>
      </div>

      <div className="mt-10 rounded-[var(--radius-card)] bg-tint/60 p-6">
        <h2 className="text-2xl">How changes go live</h2>
        <p className="mt-2 text-[0.95rem] text-muted">
          After you press <strong>Save</strong> in the editor, the website rebuilds itself. Your change shows on the live site in about 2 minutes. Refresh the page to see it.
        </p>
      </div>

      <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h2 className="text-2xl">How to photograph your nails</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem]">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h2 className="text-2xl">Staying safe as a mobile tech</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem]">
          <li>Only ask for a full address once you’ve confirmed the booking on WhatsApp.</li>
          <li>Share your location and appointment details with someone you trust.</li>
          <li>Trust your gut — it’s fine to decline a booking that feels off.</li>
        </ul>
      </div>
    </div>
  );
}
