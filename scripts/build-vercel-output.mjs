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

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const distClientCandidates = [join(root, "dist", "client"), join(root, "dist")];
const distClient = distClientCandidates.find((dir) => existsSync(join(dir, "index.html")));
const distServer = join(root, "dist", "server");
const outDir = join(root, ".vercel", "output");
const legacyOutputDir = join(root, "output");
const staticDir = join(outDir, "static");
const fnDir = join(outDir, "functions", "_ssr.func");
const serverEntry = join(fnDir, "server.js");

if (!distClient) {
  console.error("[build-vercel-output] client build missing — expected dist/client/index.html or dist/index.html after `vite build`.");
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
cpSync(distClient, staticDir, { recursive: true });

// 2. Copy SSR bundle into the function directory when Vite emitted one.
if (hasServerBuild) {
  cpSync(distServer, fnDir, { recursive: true });
}

// 3. Adapter entry: converts Node req/res <-> Web Request/Response and calls server.fetch
if (hasServerBuild) {
  const adapter = `import { createServer } from "node:http";
import { Readable } from "node:stream";
import serverEntry from "./server.js";

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
    const request = await nodeReqToWebRequest(req);
    const response = await serverEntry.fetch(request);
    await writeWebResponse(response, res);
  } catch (err) {
    console.error("[ssr-adapter] error:", err);
    res.statusCode = 500;
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
cpSync(distClient, legacyOutputDir, { recursive: true });

const requiredOutputs = [
  outDir,
  staticDir,
  join(staticDir, "index.html"),
  join(outDir, "config.json"),
  legacyOutputDir,
  join(legacyOutputDir, "index.html"),
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
