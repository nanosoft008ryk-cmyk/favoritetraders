import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getProduct, type Product } from "@/data/products";

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

type ShopContextValue = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: CartItem) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  discount: number;
  total: number;
  itemKey: (i: CartItem) => string;
  resolveItem: (i: CartItem) => Product | undefined;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const STORAGE = "ft-shop-v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCart(parsed.cart ?? []);
        setWishlist(parsed.wishlist ?? []);
        setCoupon(parsed.coupon ?? null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE, JSON.stringify({ cart, wishlist, coupon }));
  }, [cart, wishlist, coupon]);

  const itemKey = (i: CartItem) => `${i.productId}|${i.size}|${i.color}`;
  const resolveItem = (i: CartItem) => getProduct(i.productId);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const k = itemKey(item);
      const existing = prev.find((p) => itemKey(p) === k);
      if (existing) {
        return prev.map((p) => (itemKey(p) === k ? { ...p, quantity: p.quantity + item.quantity } : p));
      }
      return [...prev, item];
    });
    setCartOpen(true);
    toast.success("Added to bag", { description: getProduct(item.productId)?.name });
  };

  const updateQty = (key: string, qty: number) => {
    if (qty <= 0) return removeFromCart(key);
    setCart((prev) => prev.map((p) => (itemKey(p) === key ? { ...p, quantity: qty } : p)));
  };
  const removeFromCart = (key: string) => setCart((prev) => prev.filter((p) => itemKey(p) !== key));
  const clearCart = () => { setCart([]); setCoupon(null); };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast("Removed from wishlist");
        return prev.filter((id) => id !== productId);
      }
      toast.success("Added to wishlist");
      return [...prev, productId];
    });
  };
  const inWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce((s, i) => {
    const p = resolveItem(i);
    return s + (p ? p.price * i.quantity : 0);
  }, 0);

  const COUPONS: Record<string, number> = { LUXURY10: 0.1, FTNYC20: 0.2, BROOKLYN15: 0.15 };
  const applyCoupon = (code: string) => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) {
      setCoupon(c);
      toast.success(`Coupon ${c} applied — ${Math.round(COUPONS[c] * 100)}% off`);
      return true;
    }
    toast.error("Invalid coupon code");
    return false;
  };
  const discount = coupon ? cartSubtotal * (COUPONS[coupon] ?? 0) : 0;
  const total = Math.max(0, cartSubtotal - discount);

  const value: ShopContextValue = {
    cart, wishlist, addToCart, updateQty, removeFromCart, clearCart,
    toggleWishlist, inWishlist, cartCount, cartSubtotal, cartOpen, setCartOpen,
    coupon, applyCoupon, discount, total, itemKey, resolveItem,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
