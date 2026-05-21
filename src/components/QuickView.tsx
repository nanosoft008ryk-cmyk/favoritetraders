import { useState } from "react";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";

export function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useShop();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto grid md:grid-cols-2 gap-0">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition">
          <X className="w-4 h-4" />
        </button>
        <div className="p-4 space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
          </div>
          <div className="flex gap-2">
            {product.images.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{product.brand}</div>
          <h2 className="text-3xl mt-1">{product.name}</h2>
          <div className="mt-3 text-2xl font-semibold text-gradient">${product.price}</div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest mb-2">Color · {color}</div>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} className={`w-8 h-8 rounded-full border-2 transition ${color === c.name ? "border-primary scale-110" : "border-white"}`} style={{ background: c.hex }} title={c.name} />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-widest mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 rounded-full text-sm border transition ${size === s ? "bg-primary text-white border-primary" : "bg-white/50 border-border hover:border-primary"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center glass rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9">−</button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9">+</button>
            </div>
            <button onClick={() => { addToCart({ productId: product.id, size, color, quantity: qty }); onClose(); }} className="btn-luxury flex-1">Add to Bag</button>
          </div>

          <Link to="/product/$id" params={{ id: product.id }} className="mt-4 text-center text-sm text-primary hover:underline">View full details →</Link>
        </div>
      </div>
    </div>
  );
}
