import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";

const linkCol = [
  {
    title: "Shop",
    links: [
      { to: "/shop?cat=mens-denim", label: "Men's Denim" },
      { to: "/shop?cat=womens-denim", label: "Women's Denim" },
      { to: "/shop?cat=mens-leather", label: "Men's Leather" },
      { to: "/shop?cat=womens-leather", label: "Women's Leather" },
    ],
  },
  {
    title: "Brand",
    links: [
      { to: "/about", label: "Our Story" },
      { to: "/contact", label: "Contact" },
      { to: "/shop", label: "All Collections" },
      { to: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/refund-policy", label: "Refund Policy" },
      { to: "/return-policy", label: "Return Policy" },
      { to: "/shipping-policy", label: "Shipping Policy" },
      { to: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ocean opacity-95" />
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 20% 0%, oklch(0.78 0.11 220 / 0.5), transparent 50%)" }} />
      <div className="relative text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="[&_*]:!text-white">
              <Logo />
            </div>
            <p className="text-white/80 max-w-sm leading-relaxed">
              Hand-finished luxury outerwear, crafted in Brooklyn for the modern world. Each piece tells the story of a city that never stops creating.
            </p>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 750 Manhattan Ave, Unit 2nd Fl, Brooklyn, NY 11222</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@favoritetradinginc.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (718) 555-0142</div>
            </div>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:scale-110 transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {linkCol.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm uppercase tracking-[0.25em] mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to as any} className="text-white/75 hover:text-white text-sm transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="glass-dark rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl text-white mb-2">Join the Favorite list</h3>
              <p className="text-white/70 text-sm">Early access to drops, private events, and Brooklyn dispatches.</p>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); }}
              className="flex w-full lg:w-auto gap-2"
            >
              <input type="email" required placeholder="Your email" className="flex-1 lg:w-72 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white" />
              <button className="btn-luxury">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-white/70">
            © 2026 Favorite Trading INC. All Rights Reserved. | Designed &amp; Developed by{" "}
            <a href="https://naumanellahi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
              Nauman Ellahi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
