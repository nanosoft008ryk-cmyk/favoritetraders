import type { ReactNode } from "react";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-primary">Legal</div>
      <h1 className="text-4xl md:text-5xl mt-2">{title}</h1>
      <p className="text-xs text-muted-foreground mt-2">Last updated: {updated}</p>
      <div className="glass rounded-3xl p-8 mt-8 space-y-5 text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:font-medium">
        {children}
      </div>
    </section>
  );
}
