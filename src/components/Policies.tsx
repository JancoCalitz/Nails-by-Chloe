import type { Policy } from "@/lib/schema";
import { RichText } from "./RichText";

export function PolicyList({ policies, compact = false }: { policies: Policy[]; compact?: boolean }) {
  return (
    <dl className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
      {policies.map((p) => (
        <div key={p.key} className="card p-5">
          <dt className="font-semibold">{p.title}</dt>
          <dd className="mt-1.5 text-[0.95rem] text-muted">
            <RichText text={p.body} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
