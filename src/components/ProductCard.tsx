import { Link } from "@tanstack/react-router";
import { Heart, Eye, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { QuickView } from "./QuickView";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { toggleWishlist, inWishlist } = useShop();
  const [quick, setQuick] = useState(false);
  const wished = inWishlist(product.id);

  return (
    <>
      <div className="card-product reveal" style={{ animationDelay: `${(index % 8) * 60}ms` }}>
        <Link to="/product/$id" params={{ id: product.id }} className="block relative aspect-[4/5] overflow-hidden rounded-t-3xl group">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
          />
          <img
            src={product.images[1] ?? product.images[0]}
            alt={`${product.name} alternate`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
          />
          {product.compareAt && (
            <div className="absolute top-3 left-3 bg-gradient-ocean text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
              −{Math.round((1 - product.price / product.compareAt) * 100)}%
            </div>
          )}
          {product.newArrival && (
            <div className="absolute top-3 right-3 glass text-foreground text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">New</div>
          )}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={`w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition ${wished ? "text-destructive" : ""}`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQuick(true); }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </Link>
        <div className="p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{product.brand}</div>
          <Link to="/product/$id" params={{ id: product.id }} className="block">
            <h3 className="text-lg font-medium text-foreground hover:text-primary transition leading-snug">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-aqua text-aqua" />
            <span>{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gradient">${product.price}</span>
              {product.compareAt && <span className="text-sm text-muted-foreground line-through">${product.compareAt}</span>}
            </div>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((c) => (
                <span key={c.name} className="w-3.5 h-3.5 rounded-full border border-white/60 shadow" style={{ background: c.hex }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {quick && <QuickView product={product} onClose={() => setQuick(false)} />}
    </>
  );
}
