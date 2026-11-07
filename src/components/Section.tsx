import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className={Tag === "h1" ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"}>{title}</Tag>
      {intro && <div className="mt-4 text-lg text-muted">{intro}</div>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-tint/50">
      <div className="blob -right-24 -top-24 h-72 w-72 bg-accent/40" aria-hidden />
      <div className="container-page relative z-10 py-14 md:py-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} />
      </div>
    </header>
  );
}
