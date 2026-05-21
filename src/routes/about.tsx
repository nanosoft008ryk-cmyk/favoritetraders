import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "About — Favorite Trading INC" }, { name: "description", content: "The story behind Favorite Trading INC — luxury outerwear hand-finished in Brooklyn." }] }),
});

function About() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Our Story</div>
          <h1 className="text-5xl md:text-7xl mt-3">Born on Manhattan Avenue.</h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-lg">A luxury outerwear house founded in June 2026 in a second-floor studio in Greenpoint, Brooklyn.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 space-y-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <img src="https://images.unsplash.com/photo-1604644401890-0bd678c83788?auto=format&fit=crop&w=900&q=80" alt="Atelier" className="rounded-3xl shadow-luxury w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl">A house, not a label.</h2>
            <p className="text-muted-foreground leading-relaxed">Favorite Trading INC was founded by a small team of pattern-makers, leather artisans, and denim specialists who believed that outerwear deserved the same reverence as couture. We chose Brooklyn because the borough's energy — restless, generous, defiantly creative — became the soul of every collection.</p>
            <p className="text-muted-foreground leading-relaxed">Our sub-labels — Manhattan Ave Atelier, Williamsburg Mill, DUMBO Collective, Bushwick Reserve, Cobble Hill Couture, Park Slope Studio, Greenpoint Standard, Red Hook Workshop, Brooklyn Heights, and Prospect Atelier — are small love letters to the neighborhoods that raised us.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { t: "Crafted in NYC", d: "Every piece is cut, sewn, and hand-finished at our 750 Manhattan Avenue studio." },
            { t: "Built to Outlive Trends", d: "Italian lamb-nappa leather and Cone Mills selvedge denim, chosen to last a generation." },
            { t: "Made-to-Last Promise", d: "We offer lifetime repairs on every jacket. Bring it home, then bring it back when it needs love." },
          ].map((v) => (
            <div key={v.t} className="glass rounded-3xl p-6 reveal">
              <h3 className="text-xl mb-2">{v.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link to="/shop" className="btn-luxury">Shop the Collection</Link>
        </div>
      </section>
    </>
  );
}
