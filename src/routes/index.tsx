import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Award, Scissors } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const trending = products.filter((p) => p.trending).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Animated zoom background (cinematic) */}
        <div className="absolute inset-0">
          <img
            src="/generated-jackets/ft-011-1.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-zoom-bg"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, oklch(0.92 0.05 220 / 0.85), oklch(0.78 0.11 220 / 0.6) 45%, oklch(0.25 0.09 250 / 0.65))" }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { l: "10%", t: "20%", s: 200, d: "0s" },
            { l: "80%", t: "30%", s: 280, d: "2s" },
            { l: "60%", t: "70%", s: 220, d: "4s" },
            { l: "20%", t: "80%", s: 180, d: "1s" },
          ].map((b, i) => (
            <div key={i} className="absolute rounded-full blur-3xl opacity-40 animate-float" style={{ left: b.l, top: b.t, width: b.s, height: b.s, background: "radial-gradient(circle, oklch(0.78 0.11 220 / 0.7), transparent 70%)", animationDelay: b.d }} />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 py-20 items-center">
          <div className="space-y-7 reveal">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Autumn / Winter 2026
            </div>
            <h1 className="text-5xl md:text-7xl leading-[1.05] text-foreground">
              The art of <em className="text-gradient not-italic">Brooklyn</em><br />
              outerwear.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Hand-finished denim and leather jackets, designed at 750 Manhattan Avenue and worn around the world. Pieces built to outlive trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-luxury">Shop Now <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/shop" search={{ cat: "womens-leather" } as any} className="btn-ghost-luxury">Explore Collection</Link>
            </div>
            <div className="flex gap-8 pt-6 text-sm text-muted-foreground">
              <div><div className="text-2xl text-gradient font-semibold">20+</div>Signature pieces</div>
              <div><div className="text-2xl text-gradient font-semibold">100%</div>NYC crafted</div>
              <div><div className="text-2xl text-gradient font-semibold">4.8★</div>Customer rating</div>
            </div>
          </div>
          <div className="hidden lg:block relative h-[560px] reveal" style={{ animationDelay: "200ms" }}>
            <div className="absolute top-0 right-0 w-72 h-96 rounded-3xl overflow-hidden shadow-luxury animate-float">
              <img src="/generated-jackets/ft-001-1.svg" alt="Men's denim jacket" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-80 rounded-3xl overflow-hidden shadow-luxury animate-float-slow" style={{ animationDelay: "1s" }}>
              <img src="/generated-jackets/ft-016-1.svg" alt="Women's leather jacket" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-32 left-8 glass rounded-2xl p-4 w-48 animate-float" style={{ animationDelay: "2s" }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">New drop</div>
              <div className="font-medium mt-1">Manhattan Avenue</div>
              <div className="text-xs text-muted-foreground mt-1">Italian lamb-nappa, hand finished.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Truck, t: "Complimentary Shipping", s: "On orders over $250" },
            { Icon: ShieldCheck, t: "Lifetime Repairs", s: "We stand by every stitch" },
            { Icon: Award, t: "Crafted in NYC", s: "Hand-finished in Brooklyn" },
            { Icon: Scissors, t: "Made-to-Last", s: "Italian leather & Cone Mills denim" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="glass rounded-2xl p-5 text-center reveal">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-ocean text-white flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
              <div className="font-medium">{t}</div>
              <div className="text-xs text-muted-foreground mt-1">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY BANNERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SectionHead eyebrow="Collections" title="Four signatures, infinite stories" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {[
            { cat: "mens-denim", title: "Men's Denim Jackets", img: "/generated-jackets/ft-001-2.svg" },
            { cat: "womens-denim", title: "Women's Denim Jackets", img: "/generated-jackets/ft-006-2.svg" },
            { cat: "mens-leather", title: "Men's Leather Jackets", img: "/generated-jackets/ft-011-2.svg" },
            { cat: "womens-leather", title: "Women's Leather Jackets", img: "/generated-jackets/ft-016-2.svg" },
          ].map((c) => (
            <Link key={c.cat} to="/shop" search={{ cat: c.cat } as any} className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-luxury">
              <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">Shop the line</div>
                <div className="text-2xl mt-1">{c.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm">Discover <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHead eyebrow="Featured" title="The Favorite editor's selection" cta={{ to: "/shop", label: "Shop all" }} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury reveal">
            <img src="/generated-jackets/ft-008-3.svg" alt="Embellished denim jacket" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 glass-dark rounded-2xl p-4">
              <div className="text-xs uppercase tracking-widest text-white/70">Est. June 2026</div>
              <div className="text-white">750 Manhattan Ave · Brooklyn</div>
            </div>
          </div>
          <div className="reveal space-y-5">
            <div className="text-xs uppercase tracking-[0.25em] text-primary">Our story</div>
            <h2 className="text-4xl md:text-5xl text-foreground">A house built on Manhattan Avenue.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Favorite Trading INC was founded in June 2026 in a second-floor studio at the heart of Greenpoint. We design outerwear the old way — patterns drafted by hand, Italian leather sourced from family tanneries, denim woven on Cone Mills looms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Each piece carries a Brooklyn sub-label — Manhattan Ave Atelier, Williamsburg Mill, DUMBO Collective — a small love letter to the neighborhood that raised us.
            </p>
            <Link to="/about" className="btn-ghost-luxury">Read the full story <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHead eyebrow="Just landed" title="New arrivals" cta={{ to: "/shop", label: "View all" }} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHead eyebrow="Trending now" title="Worn by the city" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* QUOTE BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-ocean p-10 lg:p-20 text-white text-center">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 animate-float" style={{ background: "radial-gradient(circle, oklch(0.92 0.05 220), transparent 70%)" }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-30 animate-float-slow" style={{ background: "radial-gradient(circle, oklch(0.78 0.11 220), transparent 70%)" }} />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-4">Favorite Trading · Brooklyn NYC</div>
            <h2 className="text-3xl md:text-5xl leading-tight max-w-3xl mx-auto">"Luxury isn't loud. It's the soft thud of a perfect zipper, the weight of cloth that remembers your shape."</h2>
            <div className="mt-6 text-white/70">— The Favorite Trading Manifesto</div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, cta }: { eyebrow: string; title: string; cta?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-6 reveal">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
        <h2 className="text-3xl md:text-4xl mt-2 text-foreground">{title}</h2>
      </div>
      {cta && <Link to={cta.to as any} className="hidden md:inline-flex items-center gap-1 text-sm text-primary hover:underline">{cta.label} <ArrowRight className="w-4 h-4" /></Link>}
    </div>
  );
}
