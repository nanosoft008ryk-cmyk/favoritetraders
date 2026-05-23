#!/usr/bin/env node
// Post-build adapter: converts Vite's dist/{client,server} output into the
// Vercel Build Output API v3 format under .vercel/output/.
//
// Layout produced:
//   .vercel/output/config.json
//   .vercel/output/static/...          (all client assets from public/ + Vite hashed assets)
//   .vercel/output/functions/_ssr.func/
//       .vc-config.json                (Node.js serverless function)
//       index.mjs                      (adapter: IncomingMessage -> Request -> server.fetch -> ServerResponse)
//       server.js                      (TanStack SSR bundle, copied)
//       assets/                        (SSR chunks)
//
// Routing: filesystem first (serves static assets), then catch-all -> /_ssr
// This is the SPA/SSR fallback that prevents 404s on every route.

import { builtinModules } from "node:module";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const distClientCandidates = [join(root, "dist", "client"), join(root, "dist")];
const distClient = distClientCandidates.find((dir) => existsSync(join(dir, "assets")));
const distServer = join(root, "dist", "server");
const outDir = join(root, ".vercel", "output");
const legacyOutputDir = join(root, "output");
const staticDir = join(outDir, "static");
const fnDir = join(outDir, "functions", "_ssr.func");
const serverEntry = join(fnDir, "server.js");

function copyClientBuild(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (src === join(root, "dist") && entry.name === "server") continue;
    cpSync(join(src, entry.name), join(dest, entry.name), { recursive: true });
  }
}

const nodeBuiltins = new Set([...builtinModules, ...builtinModules.map((name) => `node:${name}`)]);

function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(path, files);
    else if (/\.[cm]?js$/.test(entry.name)) files.push(path);
  }
  return files;
}

function assertNoBareRuntimeImports(dir) {
  const unresolved = new Map();
  const importPattern = /(?:\bimport\s+(?:[^"'();]+?\s+from\s+)?|\bexport\s+[^"']*?\s+from\s+|\bimport\s*\()(["'])([^"']+)\1/g;

  for (const file of collectFiles(dir)) {
    const code = readFileSync(file, "utf8");
    for (const match of code.matchAll(importPattern)) {
      const specifier = match[2];
      const isRelative = specifier.startsWith(".") || specifier.startsWith("/");
      const isUrl = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(specifier) && !specifier.startsWith("node:");
      if (isRelative || isUrl || nodeBuiltins.has(specifier)) continue;
      if (!unresolved.has(specifier)) unresolved.set(specifier, []);
      unresolved.get(specifier).push(file.replace(`${root}/`, ""));
    }
  }

  if (unresolved.size > 0) {
    const details = [...unresolved]
      .map(([specifier, files]) => `  - ${specifier} in ${[...new Set(files)].slice(0, 3).join(", ")}`)
      .join("\n");
    console.error(`[build-vercel-output] server bundle still contains bare package imports. These are not packaged into .vercel/output/functions/_ssr.func and will crash at runtime. Configure Vite SSR bundling before deploying:\n${details}`);
    process.exit(1);
  }
}

if (!distClient) {
  console.error("[build-vercel-output] client build missing — expected dist/client/assets or dist/assets after `vite build`.");
  process.exit(1);
}
const hasServerBuild = existsSync(join(distServer, "server.js"));

// Clean previous output
rmSync(outDir, { recursive: true, force: true });
rmSync(legacyOutputDir, { recursive: true, force: true });
mkdirSync(staticDir, { recursive: true });
if (hasServerBuild) {
  mkdirSync(fnDir, { recursive: true });
}

// 1. Copy client assets -> static/
copyClientBuild(distClient, staticDir);

// 2. Copy SSR bundle into the function directory when Vite emitted one.
if (hasServerBuild) {
  cpSync(distServer, fnDir, { recursive: true });
  assertNoBareRuntimeImports(fnDir);
}

// 3. Adapter entry: converts Node req/res <-> Web Request/Response and calls the TanStack handler.
if (hasServerBuild) {
  const adapter = String.raw`import { Readable } from "node:stream";

let serverEntryPromise;

function formatError(error) {
  if (error instanceof Error) return error.stack || error.message;
  try { return JSON.stringify(error); } catch { return String(error); }
}

async function loadServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("./server.js").then((mod) => {
      const candidate = mod.default ?? mod;
      if (typeof candidate === "function") return candidate;
      if (candidate && typeof candidate.fetch === "function") return (request) => candidate.fetch(request);
      const keys = Object.keys(mod).join(", ") || "<none>";
      throw new Error("TanStack server bundle did not export a request handler. Export keys: " + keys);
    }).catch((error) => {
      console.error("[ssr-adapter] failed to import ./server.js", formatError(error));
      serverEntryPromise = undefined;
      throw error;
    });
  }
  return serverEntryPromise;
}

async function nodeReqToWebRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url || "/", \`\${proto}://\${host}\`);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) { for (const vv of v) headers.append(k, vv); }
    else headers.set(k, String(v));
  }
  const hasBody = req.method && !["GET", "HEAD"].includes(req.method.toUpperCase());
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    // @ts-ignore — duplex required for streaming bodies
    duplex: hasBody ? "half" : undefined,
  });
}

async function writeWebResponse(webRes, res) {
  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => { res.setHeader(key, value); });
  if (!webRes.body) { res.end(); return; }
  const reader = webRes.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}

export default async function handler(req, res) {
  try {
    const handleRequest = await loadServerEntry();
    const request = await nodeReqToWebRequest(req);
    const response = await handleRequest(request);
    if (!(response instanceof Response)) {
      throw new Error("TanStack server handler returned " + Object.prototype.toString.call(response) + " instead of a Web Response");
    }
    await writeWebResponse(response, res);
  } catch (err) {
    console.error("[ssr-adapter] function invocation failed", formatError(err));
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
}
`;
  writeFileSync(join(fnDir, "index.mjs"), adapter);

  // 4. Function config
  writeFileSync(
    join(fnDir, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: "nodejs20.x",
        handler: "index.mjs",
        launcherType: "Nodejs",
        shouldAddHelpers: false,
        supportsResponseStreaming: true,
      },
      null,
      2,
    ),
  );
}

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
