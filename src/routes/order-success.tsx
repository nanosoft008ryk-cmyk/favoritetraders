import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Package, Mail } from "lucide-react";

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : "FT-000000" }),
  component: OrderSuccess,
  head: () => ({ meta: [{ title: "Order Confirmed — Favorite Trading INC" }] }),
});

function OrderSuccess() {
  const { id } = useSearch({ from: "/order-success" });
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="glass rounded-3xl p-10 reveal">
        <CheckCircle2 className="w-16 h-16 mx-auto text-primary animate-fade-in" />
        <h1 className="text-4xl md:text-5xl mt-4">Thank you.</h1>
        <p className="text-muted-foreground mt-3">Your order has been received. Our Brooklyn atelier will prepare your piece with care.</p>
        <div className="mt-6 glass rounded-2xl p-5 text-left">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Order Number</div>
          <div className="text-2xl text-gradient font-semibold mt-1">{id}</div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="glass rounded-2xl p-4"><Mail className="w-4 h-4 mx-auto mb-1 text-primary" />Confirmation sent</div>
          <div className="glass rounded-2xl p-4"><Package className="w-4 h-4 mx-auto mb-1 text-primary" />Ships in 1–2 days</div>
        </div>
        <Link to="/shop" className="btn-luxury mt-8 inline-flex">Continue Shopping</Link>
      </div>
    </section>
  );
}
