// Vercel-only build. Lovable's Cloudflare Publish will not work with this config.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `base: "/"` and `publicDir: "public"` are Vite defaults; we rely on them so
// /public assets and hashed build assets resolve correctly on Vercel.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    target: "vercel",
  },
});
