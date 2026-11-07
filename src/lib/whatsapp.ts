import { waDigits } from "./phone";

export function whatsappLink(chloeNumber: string, text?: string): string | null {
  const digits = waDigits(chloeNumber);
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export interface BookingSummary {
  name: string;
  whatsapp: string;
  email?: string;
  service: string;
  addons: string[];
  date: string;
  windows: string[];
  area: string;
  suburb: string;
  design?: { caption: string; url: string };
  notes: string;
}

export function bookingMessage(b: BookingSummary): string {
  const lines = ["Hi Chloe! I'd like to book 💅", "", `*Name:* ${b.name}`, `*Service:* ${b.service}`];
  if (b.addons.length) lines.push(`*Extras:* ${b.addons.join(", ")}`);
  lines.push(`*Preferred date:* ${b.date}${b.windows.length ? ` (${b.windows.join(" / ")})` : ""}`);
  lines.push(`*Area:* ${b.area}${b.suburb ? ` – ${b.suburb}` : ""}`);
  if (b.design) lines.push(`*Design:* ${b.design.caption} – ${b.design.url}`);
  if (b.notes) lines.push(`*Notes:* ${b.notes}`);
  lines.push(`*My number:* ${b.whatsapp}`);
  if (b.email) lines.push(`*Email:* ${b.email}`);
  lines.push("", "I'll attach any inspo photos here. Thanks!");
  return lines.join("\n");
}
