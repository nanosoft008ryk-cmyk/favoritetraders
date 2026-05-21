import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Bag — Favorite Trading INC" }] }),
});

function CartPage() {
  const { cart, resolveItem, itemKey, updateQty, removeFromCart, cartSubtotal, applyCoupon, coupon, discount, total } = useShop();
  const [code, setCode] = useState("");

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-32 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-hero opacity-70 mb-6" />
        <h1 className="text-4xl mb-3">Your bag is empty</h1>
        <p className="text-muted-foreground mb-8">Discover hand-finished outerwear from our Brooklyn atelier.</p>
        <Link to="/shop" className="btn-luxury">Start Shopping</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl mb-2">Your Bag</h1>
      <p className="text-muted-foreground mb-10">{cart.length} item{cart.length > 1 ? "s" : ""} in your selection</p>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-4">
          {cart.map((item) => {
            const p = resolveItem(item);
            if (!p) return null;
            const k = itemKey(item);
            return (
              <div key={k} className="glass rounded-3xl p-4 flex gap-4 reveal">
                <Link to="/product/$id" params={{ id: p.id }} className="w-28 h-36 rounded-2xl overflow-hidden shrink-0">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.brand}</div>
                  <Link to="/product/$id" params={{ id: p.id }} className="text-lg font-medium hover:text-primary">{p.name}</Link>
                  <div className="text-xs text-muted-foreground mt-1">Size: {item.size} · Color: {item.color}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 glass rounded-full">
                      <button onClick={() => updateQty(k, item.quantity - 1)} className="w-9 h-9"><Minus className="w-3.5 h-3.5 mx-auto" /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(k, item.quantity + 1)} className="w-9 h-9"><Plus className="w-3.5 h-3.5 mx-auto" /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-gradient">${(p.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(k)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4">
            <ArrowLeft className="w-4 h-4" /> Continue shopping
          </Link>
        </div>

        <aside className="glass rounded-3xl p-7 h-fit sticky top-28 space-y-5">
          <h2 className="text-2xl">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
            {coupon && <div className="flex justify-between text-primary"><span>Discount ({coupon})</span><span>−${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-primary">Free</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estimated tax</span><span>${(total * 0.08).toFixed(2)}</span></div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between text-xl">
            <span>Total</span><span className="text-gradient font-semibold">${(total + total * 0.08).toFixed(2)}</span>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Promo code</label>
            <div className="mt-2 flex gap-2">
              <div className="flex items-center flex-1 glass rounded-full px-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="LUXURY10" className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none" />
              </div>
              <button onClick={() => applyCoupon(code)} className="btn-ghost-luxury !py-2 !px-4 text-sm">Apply</button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Try LUXURY10, FTNYC20, or BROOKLYN15</p>
          </div>

          <Link to="/checkout" className="btn-luxury w-full"><ShoppingBag className="w-4 h-4" /> Proceed to Checkout</Link>
          <p className="text-xs text-muted-foreground text-center">Secure checkout · Lifetime repair guarantee</p>
        </aside>
      </div>
    </section>
  );
}
