import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ShopProvider } from "@/context/ShopContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

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
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
