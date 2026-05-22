// Configured for Vercel deployment.
// The Lovable wrapper normally includes the Cloudflare Workers plugin — we disable it
// and tell TanStack Start to emit Vercel Build Output API artifacts under .vercel/output.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    target: "vercel",
  },
});
