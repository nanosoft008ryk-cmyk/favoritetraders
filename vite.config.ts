// Vercel-only build. Lovable's Cloudflare Publish will not work with this config.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
  // Serve assets and routes from the site root so images under /public and
  // hashed assets under /_build resolve correctly on Vercel.
  base: "/",
  publicDir: "public",
  tanstackStart: {
    target: "vercel",
  },
});
