import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type ShopSearch = { cat?: string; q?: string; sort?: string };
const categoryIds = new Set(categories.map((c) => c.id));

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
  component: Shop,
  head: () => ({ meta: [{ title: "Shop — Favorite Trading INC" }, { name: "description", content: "Browse our luxury denim and leather jacket collections." }] }),
});

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const cat = search.cat && categoryIds.has(search.cat) ? search.cat : "all";
  const q = search.q ?? "";
  const sort = search.sort ?? "featured";
  const [priceMax, setPriceMax] = useState<number>(1200);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setShopSearch = (next: Partial<ShopSearch>) => {
    navigate({
      search: (prev: ShopSearch) => ({
        ...prev,
        ...next,
      }),
    });
  };

  const allTags = Array.from(new Set(products.flatMap((p) => p.tags)));

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(qq) || p.brand.toLowerCase().includes(qq) || p.tags.some((t) => t.toLowerCase().includes(qq)));
    }
    list = list.filter((p) => p.price <= priceMax);
    if (tagFilter.length) list = list.filter((p) => tagFilter.every((t) => p.tags.includes(t)));
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival)); break;
      default: list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [cat, q, sort, priceMax, tagFilter]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">The Boutique</div>
          <h1 className="text-4xl md:text-6xl mt-2">Shop the collection</h1>
          <p className="mt-4 text-muted-foreground max-w-xl">{filtered.length} hand-finished pieces from our Brooklyn atelier.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setShopSearch({ cat: c.id === "all" ? undefined : c.id })} className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cat === c.id ? "bg-gradient-ocean text-white shadow-luxury" : "glass hover:scale-105"}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Sort/Search bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 glass rounded-2xl p-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <SearchIcon className="w-4 h-4 text-muted-foreground ml-2" />
            <input value={q} onChange={(e) => setShopSearch({ q: e.target.value || undefined })} placeholder="Search products…" className="flex-1 bg-transparent px-2 py-2 focus:outline-none text-sm" />
          </div>
          <select value={sort} onChange={(e) => setShopSearch({ sort: e.target.value })} className="bg-white/60 rounded-full px-4 py-2 text-sm border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price · Low to High</option>
            <option value="price-desc">Price · High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button onClick={() => setFiltersOpen((v) => !v)} className="lg:hidden btn-ghost-luxury !py-2 !px-4 text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters */}
          <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
            <div className="glass rounded-3xl p-6 sticky top-28 space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-widest mb-3">Price · max ${priceMax}</h3>
                <input type="range" min={100} max={1200} step={10} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} className="w-full accent-primary" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((t) => {
                    const active = tagFilter.includes(t);
                    return (
                      <button key={t} onClick={() => setTagFilter((prev) => active ? prev.filter((x) => x !== t) : [...prev, t])} className={`px-3 py-1 rounded-full text-xs border transition ${active ? "bg-primary text-white border-primary" : "bg-white/50 border-border hover:border-primary"}`}>{t}</button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { navigate({ search: {} }); setPriceMax(1200); setTagFilter([]); }} className="text-xs text-primary hover:underline">Reset filters</button>
            </div>
          </aside>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="glass rounded-3xl p-16 text-center">
                <h3 className="text-xl">No pieces match your filters.</h3>
                <p className="text-muted-foreground mt-2">Try widening your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
