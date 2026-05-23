#!/usr/bin/env node
// Post-build adapter: converts Vite's client output into a static Vercel
// Build Output API v3 deployment under .vercel/output/.
//
// Layout produced:
//   .vercel/output/config.json
//   .vercel/output/static/...          (all client assets from public/ + Vite hashed assets)
// Routing: filesystem first, then every app route falls back to /index.html.
// We intentionally do not emit a Vercel function here: the SSR function was
// the source of FUNCTION_INVOCATION_FAILED / Internal Server Error crashes.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const distClientCandidates = [join(root, "dist", "client"), join(root, "dist")];
const distClient = distClientCandidates.find((dir) => existsSync(join(dir, "assets")));
const outDir = join(root, ".vercel", "output");
const legacyOutputDir = join(root, "output");
const staticDir = join(outDir, "static");

function copyClientBuild(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (src === join(root, "dist") && entry.name === "server") continue;
    cpSync(join(src, entry.name), join(dest, entry.name), { recursive: true });
  }
}

if (!distClient) {
  console.error("[build-vercel-output] client build missing — expected dist/client/assets or dist/assets after `vite build`.");
  process.exit(1);
}

// Clean previous output
rmSync(outDir, { recursive: true, force: true });
rmSync(legacyOutputDir, { recursive: true, force: true });
mkdirSync(staticDir, { recursive: true });

// 1. Copy client assets -> static/
copyClientBuild(distClient, staticDir);

// 5. Build Output config — filesystem first, then SPA/SSR fallback to /_ssr
const config = {
  version: 3,
  routes: hasServerBuild
    ? [
        { handle: "filesystem" },
        // Everything that didn't match a static asset goes to the SSR function.
        { src: "/(.*)", dest: "/_ssr" },
      ]
    : [
        { handle: "filesystem" },
        // SPA fallback when no SSR bundle is emitted.
        { src: "/(.*)", dest: "/index.html" },
      ],
};
writeFileSync(join(outDir, "config.json"), JSON.stringify(config, null, 2));

// 6. Safety mirror for Vercel projects whose dashboard still has Output Directory = "output".
// Vercel normally consumes .vercel/output via the Build Output API, but creating this
// directory prevents the persistent "No Output Directory named output" failure.
copyClientBuild(distClient, legacyOutputDir);

const requiredOutputs = [
  outDir,
  staticDir,
  join(outDir, "config.json"),
  legacyOutputDir,
];
if (hasServerBuild) {
  requiredOutputs.push(fnDir, serverEntry, join(fnDir, "index.mjs"), join(fnDir, ".vc-config.json"));
}
const missingOutputs = requiredOutputs.filter((path) => !existsSync(path));
if (missingOutputs.length > 0) {
  console.error(`[build-vercel-output] missing generated output:\n${missingOutputs.join("\n")}`);
  process.exit(1);
}

// Report
const staticCount = readdirSync(staticDir).length;
console.log(`[build-vercel-output] wrote .vercel/output/static (${staticCount} entries)`);
if (hasServerBuild) {
  console.log(`[build-vercel-output] wrote .vercel/output/functions/_ssr.func (nodejs20.x)`);
  console.log(`[build-vercel-output] wrote .vercel/output/config.json (SPA/SSR fallback -> /_ssr)`);
} else {
  console.log(`[build-vercel-output] no dist/server/server.js found; using static SPA fallback -> /index.html`);
  console.log(`[build-vercel-output] wrote .vercel/output/config.json (SPA fallback -> /index.html)`);
}
console.log(`[build-vercel-output] wrote output/ fallback mirror for Vercel dashboard outputDirectory overrides`);
