import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, MapPin, User as UserIcon } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — Favorite Trading INC" }] }),
});

function Checkout() {
  const navigate = useNavigate();
  const { cart, resolveItem, cartSubtotal, discount, total, coupon, clearCart } = useShop();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const tax = total * 0.08;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep((step + 1) as 1 | 2 | 3); window.scrollTo(0, 0); return; }
    const orderId = "FT-" + Math.floor(Math.random() * 900000 + 100000);
    clearCart();
    navigate({ to: "/order-success", search: { id: orderId } as any });
  };

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="text-3xl">Your bag is empty</h1>
        <p className="text-muted-foreground mt-2 mb-6">Add a piece before checking out.</p>
        <button onClick={() => navigate({ to: "/shop" })} className="btn-luxury">Continue Shopping</button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl mb-3">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-10 text-sm">
        {[
          { n: 1, label: "Information" },
          { n: 2, label: "Shipping" },
          { n: 3, label: "Payment" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= s.n ? "bg-gradient-ocean text-white" : "glass text-muted-foreground"}`}>{s.n}</div>
            <span className={step >= s.n ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
            {i < 2 && <div className="w-12 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="glass rounded-3xl p-6 space-y-4 reveal">
              <h2 className="text-2xl flex items-center gap-2"><UserIcon className="w-5 h-5" /> Contact Information</h2>
              <Input label="Email" name="email" type="email" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="First name" name="first" required />
                <Input label="Last name" name="last" required />
              </div>
              <Input label="Phone" name="phone" type="tel" />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="accent-primary" /> Email me with news and offers
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="glass rounded-3xl p-6 space-y-4 reveal">
              <h2 className="text-2xl flex items-center gap-2"><MapPin className="w-5 h-5" /> Shipping Address</h2>
              <Input label="Address" name="addr" required />
              <Input label="Apartment, suite, etc." name="addr2" />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" name="city" required />
                <Input label="State" name="state" required />
                <Input label="ZIP" name="zip" required />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Shipping method</label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: "std", t: "Standard · 5–7 days", p: "Free" },
                    { id: "exp", t: "Express · 2–3 days", p: "$22" },
                    { id: "ovr", t: "NYC Overnight (white glove)", p: "$48" },
                  ].map((m) => (
                    <label key={m.id} className="glass rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-primary border border-transparent">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="ship" defaultChecked={m.id === "std"} className="accent-primary" />
                        <span>{m.t}</span>
                      </div>
                      <span className="font-medium">{m.p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass rounded-3xl p-6 space-y-4 reveal">
              <h2 className="text-2xl flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-2"><Lock className="w-3 h-3" /> All transactions are encrypted end-to-end.</p>
              <Input label="Cardholder name" name="cname" required />
              <Input label="Card number" name="cnum" placeholder="4242 4242 4242 4242" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Expiration (MM/YY)" name="exp" placeholder="12/28" required />
                <Input label="CVC" name="cvc" placeholder="123" required />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <input type="checkbox" defaultChecked className="accent-primary" /> Billing address same as shipping
              </label>
            </div>
          )}

          <div className="flex justify-between items-center">
            {step > 1 ? <button type="button" onClick={() => setStep((step - 1) as 1 | 2 | 3)} className="btn-ghost-luxury">Back</button> : <span />}
            <button type="submit" className="btn-luxury">{step === 3 ? `Place Order · $${(total + tax).toFixed(2)}` : "Continue"}</button>
          </div>
        </form>

        <aside className="glass rounded-3xl p-6 h-fit lg:sticky top-28 space-y-5">
          <h3 className="text-xl">Your order</h3>
          <div className="space-y-3 max-h-72 overflow-auto pr-1">
            {cart.map((i, idx) => {
              const p = resolveItem(i);
              if (!p) return null;
              return (
                <div key={idx} className="flex gap-3 text-sm">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{i.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{i.size} · {i.color}</div>
                  </div>
                  <div className="font-medium">${(p.price * i.quantity).toFixed(0)}</div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
            {coupon && <div className="flex justify-between text-primary"><span>Discount ({coupon})</span><span>−${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg pt-2 border-t border-border"><span>Total</span><span className="font-semibold text-gradient">${(total + tax).toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1.5 w-full rounded-full bg-white/60 border border-border px-5 py-3 focus:outline-none focus:border-primary transition" />
    </label>
  );
}
