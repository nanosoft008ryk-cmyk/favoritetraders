#!/usr/bin/env node
// Verifies that `vite build` produced the expected Vercel Build Output API artifacts.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, ".vercel", "output");

const required = [
  ".vercel/output",
  ".vercel/output/config.json",
  ".vercel/output/static",
  "output",
];

let ok = true;
for (const rel of required) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    console.error(`[verify-vercel-build] MISSING: ${rel}`);
    ok = false;
  } else {
    console.log(`[verify-vercel-build] OK: ${rel}`);
  }
}

// Functions dir is required for SSR
const functionsDir = join(outDir, "functions");
if (!existsSync(functionsDir)) {
  console.error("[verify-vercel-build] MISSING: .vercel/output/functions (no SSR function emitted)");
  ok = false;
} else {
  const fns = readdirSync(functionsDir).filter((f) => f.endsWith(".func"));
  if (fns.length === 0) {
    console.error("[verify-vercel-build] MISSING: no *.func directories under functions/");
    ok = false;
  } else {
    console.log(`[verify-vercel-build] OK: functions (${fns.join(", ")})`);
  }
}

// Static assets sanity check
const staticDir = join(outDir, "static");
if (existsSync(staticDir)) {
  const count = readdirSync(staticDir).length;
  console.log(`[verify-vercel-build] static/ contains ${count} top-level entries`);
}

if (!ok) {
  console.error("\n[verify-vercel-build] FAILED — Vercel output is incomplete. Deployment will 404.");
  process.exit(1);
}
console.log("\n[verify-vercel-build] SUCCESS — .vercel/output is ready for deployment.");
console.log("[verify-vercel-build] SUCCESS — output/ fallback also exists for Vercel outputDirectory overrides.");
