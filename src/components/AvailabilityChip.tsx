import type { Settings } from "@/lib/schema";
import { shortDate } from "@/lib/format";

export function availabilityText(s: Settings): string {
  if (s.availability_message) return s.availability_message;
  if (s.availability_status === "full")
    return s.full_until_date ? `Fully booked until ${shortDate(s.full_until_date)}` : "Fully booked right now";
  if (s.availability_status === "limited") return "Limited spots this week";
  return "Taking bookings this week";
}

export function AvailabilityChip({ settings }: { settings: Settings }) {
  const dot =
    settings.availability_status === "open"
      ? "bg-emerald-600"
      : settings.availability_status === "limited"
        ? "bg-amber-500"
        : "bg-rose-600";
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-sm font-medium backdrop-blur">
      <span className={`relative flex h-2.5 w-2.5`} aria-hidden>
        {settings.availability_status === "open" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dot} opacity-50`} />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
      </span>
      {availabilityText(settings)}
    </p>
  );
}
