import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, resolveItem, itemKey, updateQty, removeFromCart, cartSubtotal } = useShop();
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[440px] glass border-l border-white/40 flex flex-col" style={{ animation: "slide-in-right 0.3s ease-out" }}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-xl flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Your Bag</h3>
          <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-hero opacity-60" />
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-luxury">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {cart.map((item) => {
                const p = resolveItem(item);
                if (!p) return null;
                const k = itemKey(item);
                return (
                  <div key={k} className="flex gap-3 p-3 rounded-2xl glass">
                    <Link to="/product/$id" params={{ id: p.id }} onClick={() => setCartOpen(false)} className="w-20 h-24 rounded-xl overflow-hidden shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.brand}</div>
                      <Link to="/product/$id" params={{ id: p.id }} onClick={() => setCartOpen(false)} className="block font-medium leading-tight truncate hover:text-primary">{p.name}</Link>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-white/70 rounded-full">
                          <button onClick={() => updateQty(k, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(k, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-semibold text-gradient">${(p.price * item.quantity).toFixed(0)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(k)} className="self-start text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
            </div>
            <div className="p-5 border-t border-border space-y-4">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">${cartSubtotal.toFixed(2)}</span></div>
              <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-ghost-luxury">View Bag</Link>
                <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-luxury">Checkout</Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
