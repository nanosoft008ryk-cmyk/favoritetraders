import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { useShop } from "@/context/ShopContext";

const nav: { to: string; label: string; hasDropdown?: boolean }[] = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop", hasDropdown: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const shopDropdown = [
  { to: "/shop", search: { cat: "mens-denim" }, label: "Men's Denim Jackets" },
  { to: "/shop", search: { cat: "womens-denim" }, label: "Women's Denim Jackets" },
  { to: "/shop", search: { cat: "mens-leather" }, label: "Men's Leather Jackets" },
  { to: "/shop", search: { cat: "womens-leather" }, label: "Women's Leather Jackets" },
] as const;

export function Header() {
  const { cartCount, setCartOpen, wishlist } = useShop();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <>
      <div className="w-full overflow-hidden bg-gradient-ocean text-white text-xs tracking-[0.25em] uppercase py-2">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 gap-12 px-6">
              <span>Complimentary shipping over $250</span>
              <span>·</span>
              <span>New Brooklyn collection — Autumn drop live</span>
              <span>·</span>
              <span>Hand-finished in NYC</span>
              <span>·</span>
              <span>Use code LUXURY10 for 10% off your first order</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-40 glass border-b border-white/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <button className="lg:hidden p-2" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="hover:opacity-80 transition"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((n) => (
              <div key={n.label} className="relative group">
                <Link
                  to={n.to as any}
                  className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary focus:text-primary transition relative inline-flex items-center gap-1 py-7 outline-none"
                >
                  {n.label}
                  {n.hasDropdown && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                  <span className="absolute bottom-5 left-0 w-0 h-0.5 bg-gradient-to-r from-aqua to-primary group-hover:w-full group-focus-within:w-full transition-all duration-300" />
                </Link>
                {n.hasDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-0.5rem)] pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200 z-50">
                    <div className="glass rounded-2xl border border-white/60 shadow-luxury py-2 min-w-[270px] overflow-hidden">
                      {shopDropdown.map((d) => (
                        <Link
                          key={d.label}
                          to={d.to}
                          search={d.search as any}
                          className="block px-6 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-white/50 focus:bg-white/50 focus:text-primary outline-none transition"
                        >
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen((s) => !s)} className="p-2 hover:text-primary transition" aria-label="Search"><Search className="w-5 h-5" /></button>
            <Link to="/wishlist" className="p-2 hover:text-primary transition relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} className="p-2 hover:text-primary transition relative" aria-label="Bag">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-white/40 bg-white/70 backdrop-blur">
            <form
              className="mx-auto max-w-3xl px-4 py-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/shop", search: { q: q || undefined } });
              }}
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search jackets, collections, brands…"
                className="flex-1 bg-transparent border-b border-primary/40 px-1 py-2 focus:outline-none focus:border-primary"
              />
              <button className="btn-luxury" type="submit">Search</button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 glass border-r p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            {nav.map((n) => (
              <div key={n.label} className="border-b border-border">
                <Link to={n.to as any} onClick={() => setOpen(false)} className="block py-3 text-foreground hover:text-primary">{n.label}</Link>
                {n.hasDropdown && (
                  <div className="pb-3 pl-4 space-y-1">
                    {shopDropdown.map((d) => (
                      <Link key={d.label} to={d.to} search={d.search as any} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
