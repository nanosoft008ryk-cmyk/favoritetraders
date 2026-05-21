import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useShop } from "@/context/ShopContext";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop?cat=mens-denim", label: "Men" },
  { to: "/shop?cat=womens-denim", label: "Women" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { cartCount, setCartOpen, wishlist } = useShop();
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
              <Link
                key={n.label}
                to={n.to as any}
                className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition relative group"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-aqua to-primary group-hover:w-full transition-all duration-300" />
              </Link>
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
                window.location.href = `/shop?q=${encodeURIComponent(q)}`;
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
              <Link key={n.label} to={n.to as any} onClick={() => setOpen(false)} className="py-3 border-b border-border text-foreground hover:text-primary">{n.label}</Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
