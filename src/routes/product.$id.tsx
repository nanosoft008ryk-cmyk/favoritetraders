import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Star, Truck, Shield, RotateCcw, ChevronRight } from "lucide-react";
import { getProduct, getRelated } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Favorite Trading INC` },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: loaderData.name },
      { property: "og:description", content: loaderData.description },
      { property: "og:image", content: loaderData.images[0] },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <h2 className="text-3xl">Product not found</h2>
      <Link to="/shop" className="btn-luxury mt-6">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"details" | "care" | "reviews">("details");
  const wished = inWishlist(product.id);
  const related = getRelated(product.id, 4);

  const reviews = [
    { name: "Alexandra K.", rating: 5, date: "3 weeks ago", text: "Beyond expectation. The leather is butter-soft and the cut is impeccable. This is wearable architecture." },
    { name: "Marcus D.", rating: 5, date: "1 month ago", text: "Stitching is flawless. Got endless compliments on launch night in SoHo." },
    { name: "Priya S.", rating: 4, date: "2 months ago", text: "Beautifully made. Sizing runs slim — I sized up half and it's perfect." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass group">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150"
              style={{ transformOrigin: "center" }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition ${activeImg === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">{product.brand}</div>
            <h1 className="text-4xl md:text-5xl mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-aqua text-aqua" : "text-muted"}`} />)}</div>
              <span className="text-sm text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-gradient">${product.price}</span>
            {product.compareAt && <span className="text-lg text-muted-foreground line-through">${product.compareAt}</span>}
            {product.compareAt && <span className="text-xs bg-aqua/20 text-primary px-2 py-1 rounded-full">Save ${product.compareAt - product.price}</span>}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((t) => <span key={t} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full glass">{t}</span>)}
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest mb-2">Color · <span className="text-foreground font-medium normal-case tracking-normal">{color}</span></div>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} title={c.name} className={`w-10 h-10 rounded-full border-2 transition ${color === c.name ? "border-primary scale-110" : "border-white shadow"}`} style={{ background: c.hex }} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-[3rem] px-4 py-2.5 rounded-full text-sm border transition ${size === s ? "bg-primary text-white border-primary" : "bg-white/50 border-border hover:border-primary"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center glass rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-11 h-11 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => addToCart({ productId: product.id, size, color, quantity: qty })} className="btn-luxury flex-1">Add to Bag · ${(product.price * qty).toFixed(0)}</button>
            <button onClick={() => toggleWishlist(product.id)} className={`w-12 h-12 rounded-full glass flex items-center justify-center ${wished ? "text-destructive" : ""}`} aria-label="Wishlist">
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4">
            {[{ I: Truck, t: "Free shipping $250+" }, { I: RotateCcw, t: "30-day returns" }, { I: Shield, t: "Lifetime repairs" }].map(({ I, t }) => (
              <div key={t} className="glass rounded-2xl p-3 text-center text-xs">
                <I className="w-4 h-4 mx-auto mb-1 text-primary" />{t}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="pt-6">
            <div className="flex gap-1 border-b border-border">
              {(["details", "care", "reviews"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm capitalize transition border-b-2 ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
            <div className="py-5 text-sm">
              {tab === "details" && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Detail label="Fabric" value={product.fabric} />
                  <Detail label="Fit" value={product.fit} />
                  <Detail label="Style" value={product.style} />
                  <Detail label="Made in" value="Brooklyn, NYC" />
                </dl>
              )}
              {tab === "care" && <p className="text-muted-foreground leading-relaxed">{product.care}. Store on a wide padded hanger. Avoid direct sunlight and humidity to preserve color depth.</p>}
              {tab === "reviews" && (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.name} className="glass rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.name}</div>
                        <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-aqua text-aqua" : "text-muted"}`} />)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                      <p className="mt-2 text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-24">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">You may also love</div>
          <h2 className="text-3xl md:text-4xl mt-2 mb-8">More from {product.categoryLabel}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
