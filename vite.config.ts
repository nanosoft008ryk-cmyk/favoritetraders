// Vercel-only build. Lovable's Cloudflare Publish will not work with this config.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// We intentionally do NOT set tanstackStart.target = "vercel" — that target
// makes the plugin emit directly into .vercel/output and skips dist/, which
// breaks our post-build adapter that reads from dist/{client,server}.
export default defineConfig({
  cloudflare: false,
  vite: {
    ssr: {
      noExternal: true,
    },
  },
});
