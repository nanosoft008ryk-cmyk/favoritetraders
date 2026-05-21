import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
  head: () => ({ meta: [{ title: "Wishlist — Favorite Trading INC" }] }),
});

function Wishlist() {
  const { wishlist } = useShop();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-2"><Heart className="w-7 h-7 text-primary" /><h1 className="text-4xl md:text-5xl">Your Wishlist</h1></div>
      <p className="text-muted-foreground mb-10">{items.length} piece{items.length === 1 ? "" : "s"} saved.</p>
      {items.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <p className="text-muted-foreground mb-6">Nothing saved yet. Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="btn-luxury">Browse Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}
