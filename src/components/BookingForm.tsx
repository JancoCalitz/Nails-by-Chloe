"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { normaliseSaMobile, displaySaMobile } from "@/lib/phone";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";
import { priceLabel, rand } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { track } from "./Analytics";
import { WhatsAppIcon } from "./icons";

export interface BookingOptions {
  services: { name: string; category: string; price_from: number; price_to: number }[];
  addons: { name: string; price_from: number; price_to: number }[];
  areas: { name: string; fee: number }[];
  showTravelFees: boolean;
  designs: { slug: string; caption: string; thumb: string; blur: string }[];
  chloeWhatsapp: string;
  responseTime: string;
  emailKey: string;
  businessName: string;
}

const WINDOWS = ["Morning", "Afternoon", "Evening"] as const;
const OTHER_AREA = "Other / not sure";

const schema = z.object({
  service: z.string().min(1, "Please choose a service"),
  addons: z.array(z.string()),
  date: z.string().min(1, "Please pick a date"),
  windows: z.array(z.string()).min(1, "Pick at least one time of day"),
  area: z.string().min(1, "Please choose your area"),
  suburb: z.string().max(80),
  design: z.string(),
  notes: z.string().max(600, "Please keep notes under 600 characters"),
  name: z.string().trim().min(2, "Please tell me your name").max(60),
  whatsapp: z.string().refine((v) => normaliseSaMobile(v) !== null, "Please enter a valid SA cellphone number, e.g. 082 123 4567"),
  email: z.union([z.literal(""), z.email("That email doesn’t look right")]),
  consent: z.literal(true, { error: "Please tick the box so I can use your details to arrange your booking" }),
});

type FormState = z.input<typeof schema>;
type Errors = Partial<Record<keyof FormState, string>>;

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" });
}

export function BookingForm({ options }: { options: BookingOptions }) {
  const params = useSearchParams();
  const ids = useId();
  // useSearchParams makes this component render only in the browser (static export),
  // so reading today's date here can't cause a hydration mismatch.
  const [minDate] = useState(todayIso);

  const [form, setForm] = useState<FormState>(() => {
    const design = params.get("design") ?? "";
    return {
      service: "",
      addons: [],
      date: "",
      windows: [],
      area: "",
      suburb: "",
      design: options.designs.some((d) => d.slug === design) ? design : "",
      notes: "",
      name: "",
      whatsapp: "",
      email: "",
      consent: false as unknown as true,
    };
  });
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ message: string; link: string | null } | null>(null);
  const [pickingDesign, setPickingDesign] = useState(false);

  const chosenDesign = options.designs.find((d) => d.slug === form.design);
  const servicesByCategory = useMemo(() => {
    const map = new Map<string, BookingOptions["services"]>();
    options.services.forEach((s) => map.set(s.category, [...(map.get(s.category) ?? []), s]));
    return [...map.entries()];
  }, [options.services]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (!started) {
      setStarted(true);
      track("booking-form-start");
    }
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggle(key: "addons" | "windows", value: string) {
    const list = form[key];
    set(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // bots fill hidden fields; humans never see it
    const result = schema.safeParse(form);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof FormState;
        next[k] ??= issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document.getElementById(`${ids}-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    const v = result.data;
    const message = bookingMessage({
      name: v.name.trim(),
      whatsapp: displaySaMobile(v.whatsapp),
      email: v.email || undefined,
      service: v.service,
      addons: v.addons,
      date: prettyDate(v.date),
      windows: v.windows,
      area: v.area,
      suburb: v.suburb.trim(),
      design: chosenDesign ? { caption: chosenDesign.caption, url: absoluteUrl(`/gallery/${chosenDesign.slug}/`) } : undefined,
      notes: v.notes.trim(),
    });

    // Optional email copy to Chloe (Web3Forms, free). Never blocks the WhatsApp handoff.
    if (options.emailKey) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 6000);
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: options.emailKey,
            subject: `New booking request: ${v.name} – ${v.service}`,
            from_name: `${options.businessName} website`,
            message,
          }),
          signal: ctrl.signal,
        });
        clearTimeout(t);
      } catch {
        /* the WhatsApp step still works */
      }
    }

    track("booking-form-submit");
    setDone({ message, link: whatsappLink(options.chloeWhatsapp, message) });
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) return <Success done={done} responseTime={options.responseTime} />;

  const err = (k: keyof FormState) =>
    errors[k] ? (
      <p id={`${ids}-${k}-err`} className="mt-1.5 text-sm font-medium text-[#b42318]">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof FormState) => ({
    id: `${ids}-${k}`,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${ids}-${k}-err` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {Object.values(errors).some(Boolean) && (
        <p role="alert" className="rounded-xl bg-[#fef3f2] p-4 text-[0.95rem] font-medium text-[#b42318]">
          Almost there — please check the highlighted fields below.
        </p>
      )}

      <Step n={1} title="What would you like?">
        <label htmlFor={`${ids}-service`} className="mb-1.5 block font-medium">
          Service
        </label>
        <select {...aria("service")} className="field" value={form.service} onChange={(e) => set("service", e.target.value)}>
          <option value="">Choose a service…</option>
          {servicesByCategory.map(([cat, list]) => (
            <optgroup key={cat} label={cat}>
              {list.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({priceLabel(s.price_from, s.price_to)})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {err("service")}

        {options.addons.length > 0 && (
          <fieldset className="mt-6">
            <legend className="mb-2 font-medium">Extras (optional)</legend>
            <div className="flex flex-wrap gap-2">
              {options.addons.map((a) => (
                <label key={a.name} className="chip">
                  <input type="checkbox" className="sr-only" checked={form.addons.includes(a.name)} onChange={() => toggle("addons", a.name)} />
                  {a.name} <span className="opacity-70">+{rand(a.price_from)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </Step>

      <Step n={2} title="When suits you?">
        <label htmlFor={`${ids}-date`} className="mb-1.5 block font-medium">
          Preferred date
        </label>
        <input type="date" {...aria("date")} className="field" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} />
        {err("date")}
        <fieldset className="mt-6" aria-describedby={errors.windows ? `${ids}-windows-err` : undefined}>
          <legend className="mb-2 font-medium">Time of day (pick one or more)</legend>
          <div className="flex flex-wrap gap-2" id={`${ids}-windows`} tabIndex={-1}>
            {WINDOWS.map((w) => (
              <label key={w} className="chip">
                <input type="checkbox" className="sr-only" checked={form.windows.includes(w)} onChange={() => toggle("windows", w)} />
                {w}
              </label>
            ))}
          </div>
          {err("windows")}
        </fieldset>
        <p className="mt-3 text-sm text-muted">This is a request — I’ll confirm the exact time on WhatsApp.</p>
      </Step>

      <Step n={3} title="Where are you?">
        <label htmlFor={`${ids}-area`} className="mb-1.5 block font-medium">
          Area
        </label>
        <select {...aria("area")} className="field" value={form.area} onChange={(e) => set("area", e.target.value)}>
          <option value="">Choose your area…</option>
          {options.areas.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
              {options.showTravelFees ? ` (${a.fee ? `+${rand(a.fee)} travel` : "no travel fee"})` : ""}
            </option>
          ))}
          <option value={OTHER_AREA}>{OTHER_AREA}</option>
        </select>
        {err("area")}
        <label htmlFor={`${ids}-suburb`} className="mb-1.5 mt-5 block font-medium">
          Suburb or nearby landmark <span className="font-normal text-muted">(optional)</span>
        </label>
        <input {...aria("suburb")} className="field" value={form.suburb} onChange={(e) => set("suburb", e.target.value)} autoComplete="address-level3" />
        <p className="mt-2 text-sm text-muted">No street address needed yet — I’ll ask for it on WhatsApp once your booking is confirmed.</p>
      </Step>

      <Step n={4} title="Your design">
        {chosenDesign ? (
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3">
            <img src={chosenDesign.thumb} alt="" width={64} height={80} className="h-20 w-16 rounded-lg object-cover" style={{ backgroundImage: chosenDesign.blur ? `url(${chosenDesign.blur})` : undefined, backgroundSize: "cover" }} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted">Selected set</p>
              <p className="truncate font-medium">{chosenDesign.caption}</p>
            </div>
            <button type="button" className="link shrink-0 text-sm" onClick={() => set("design", "")}>
              Remove
            </button>
          </div>
        ) : (
          options.designs.length > 0 && (
            <button type="button" className="btn btn-secondary w-full sm:w-auto" aria-expanded={pickingDesign} onClick={() => setPickingDesign((p) => !p)}>
              {pickingDesign ? "Hide gallery" : "Choose a set from my gallery"}
            </button>
          )
        )}
        {pickingDesign && !chosenDesign && (
          <ul className="mt-4 grid max-h-96 grid-cols-3 gap-2 overflow-y-auto rounded-2xl sm:grid-cols-4">
            {options.designs.map((d) => (
              <li key={d.slug}>
                <button
                  type="button"
                  className="block w-full overflow-hidden rounded-xl"
                  onClick={() => {
                    set("design", d.slug);
                    setPickingDesign(false);
                  }}
                >
                  <img src={d.thumb} alt={d.caption} width={160} height={200} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <label htmlFor={`${ids}-notes`} className="mb-1.5 mt-6 block font-medium">
          Notes <span className="font-normal text-muted">(colour, shape, length, anything else)</span>
        </label>
        <textarea {...aria("notes")} rows={4} className="field" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. Short almond, nude base with gold detail. I have an old gel set to remove." />
        {err("notes")}
        <p className="mt-2 text-sm text-muted">Got inspo photos? You can attach them in the WhatsApp chat after sending this.</p>
      </Step>

      <Step n={5} title="Your details">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ids}-name`} className="mb-1.5 block font-medium">
              Name
            </label>
            <input {...aria("name")} className="field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="given-name" />
            {err("name")}
          </div>
          <div>
            <label htmlFor={`${ids}-whatsapp`} className="mb-1.5 block font-medium">
              WhatsApp number
            </label>
            <input
              {...aria("whatsapp")}
              type="tel"
              inputMode="tel"
              className="field"
              placeholder="082 123 4567"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              autoComplete="tel"
            />
            {err("whatsapp")}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${ids}-email`} className="mb-1.5 block font-medium">
              Email <span className="font-normal text-muted">(optional)</span>
            </label>
            <input {...aria("email")} type="email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
            {err("email")}
          </div>
        </div>

        {/* Honeypot: hidden from people, irresistible to spam bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Company
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            {...aria("consent")}
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-accent-strong)]"
            checked={form.consent === true}
            onChange={(e) => set("consent", e.target.checked as true)}
          />
          <span className="text-[0.95rem]">
            I agree to Chloe using these details to arrange my appointment. See the{" "}
            <Link href="/privacy/" className="link">
              privacy notice
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </Step>

      <button type="submit" className="btn btn-primary w-full text-lg" disabled={submitting}>
        {submitting ? "Preparing your request…" : "Send booking request"}
      </button>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="relative">
      <legend className="mb-4 flex items-center gap-3 font-serif text-3xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tint font-sans text-base font-semibold text-accent-strong">{n}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Success({ done, responseTime }: { done: { message: string; link: string | null }; responseTime: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card p-7 text-center md:p-10" role="status">
      <p className="text-5xl" aria-hidden>
        💅
      </p>
      <h2 className="mt-4 text-4xl">Almost done!</h2>
      {done.link ? (
        <>
          <p className="mx-auto mt-3 max-w-md text-lg text-muted">
            Tap below to send your request to me on WhatsApp — it’s all filled in for you. I’ll confirm within {responseTime}.
          </p>
          <a href={done.link} className="btn btn-whatsapp mt-8 w-full text-lg sm:w-auto" data-track="whatsapp-click-booking" rel="noopener">
            <WhatsAppIcon width={22} height={22} /> Send on WhatsApp
          </a>
          <p className="mt-4 text-sm text-muted">Your booking is confirmed once I reply.</p>
        </>
      ) : (
        <p className="mx-auto mt-3 max-w-md text-lg text-muted">
          WhatsApp booking isn’t switched on yet. Please copy your request below and send it to me using the details on the{" "}
          <Link href="/contact/" className="link">
            contact page
          </Link>
          .
        </p>
      )}
      <details className="mx-auto mt-8 max-w-md text-left">
        <summary className="cursor-pointer text-sm font-medium">See / copy your request</summary>
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-tint/60 p-4 font-sans text-sm">{done.message}</pre>
        <button
          type="button"
          className="btn btn-secondary mt-3 min-h-11 py-2 text-sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(done.message);
              setCopied(true);
            } catch {
              /* clipboard blocked */
            }
          }}
        >
          {copied ? "Copied!" : "Copy text"}
        </button>
      </details>
    </div>
  );
}
