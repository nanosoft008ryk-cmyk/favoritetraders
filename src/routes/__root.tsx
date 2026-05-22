import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ShopProvider } from "@/context/ShopContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-3xl p-10">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6"><Link to="/" className="btn-luxury">Go Home</Link></div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-3xl p-10">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-luxury">Try again</button>
          <a href="/" className="btn-ghost-luxury">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Favorite Trading INC — Luxury Denim & Leather Outerwear · Brooklyn NYC" },
      { name: "description", content: "Hand-finished luxury denim and leather jackets, designed and crafted in Brooklyn. Shop the Favorite Trading INC collection." },
      { property: "og:title", content: "Favorite Trading INC — Luxury Denim & Leather Outerwear · Brooklyn NYC" },
      { property: "og:description", content: "Hand-finished luxury denim and leather jackets, designed and crafted in Brooklyn. Shop the Favorite Trading INC collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Favorite Trading INC — Luxury Denim & Leather Outerwear · Brooklyn NYC" },
      { name: "twitter:description", content: "Hand-finished luxury denim and leather jackets, designed and crafted in Brooklyn. Shop the Favorite Trading INC collection." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/l2ararfC6eXGxLKqtaDDYs4PG6x1/social-images/social-1779464710047-Screenshot_2026-05-22_204215.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/l2ararfC6eXGxLKqtaDDYs4PG6x1/social-images/social-1779464710047-Screenshot_2026-05-22_204215.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
      { rel: "icon", href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='40' y2='40'%3E%3Cstop offset='0%25' stop-color='%237fb6e0'/%3E%3Cstop offset='100%25' stop-color='%231a3a72'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M20 2L36 12V28L20 38L4 28V12Z' fill='url(%23g)'/%3E%3Ctext x='20' y='27' text-anchor='middle' font-family='Georgia,serif' font-size='20' font-weight='700' fill='white'%3EF%3C/text%3E%3C/svg%3E" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <Header />
        <main className="min-h-[60vh]"><Outlet /></main>
        <Footer />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </ShopProvider>
    </QueryClientProvider>
  );
}
