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

// 2. Build Output config — filesystem first, then SPA fallback to /index.html.
const config = {
  version: 3,
  routes: [
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/index.html" },
  ],
};
writeFileSync(join(outDir, "config.json"), JSON.stringify(config, null, 2));

// 3. Safety mirror for Vercel projects whose dashboard still has Output Directory = "output".
// Vercel normally consumes .vercel/output via the Build Output API, but creating this
// directory prevents the persistent "No Output Directory named output" failure.
copyClientBuild(distClient, legacyOutputDir);

const requiredOutputs = [
  outDir,
  staticDir,
  join(outDir, "config.json"),
  legacyOutputDir,
  join(staticDir, "index.html"),
  join(legacyOutputDir, "index.html"),
];
const missingOutputs = requiredOutputs.filter((path) => !existsSync(path));
if (missingOutputs.length > 0) {
  console.error(`[build-vercel-output] missing generated output:\n${missingOutputs.join("\n")}`);
  process.exit(1);
}

// Report
const staticCount = readdirSync(staticDir).length;
console.log(`[build-vercel-output] wrote .vercel/output/static (${staticCount} entries)`);
console.log(`[build-vercel-output] wrote .vercel/output/config.json (static SPA fallback -> /index.html)`);
console.log(`[build-vercel-output] wrote output/ fallback mirror for Vercel dashboard outputDirectory overrides`);
