// Turns the pre-rendered site in build/client into Vercel's Build Output API format
// (https://vercel.com/docs/build-output-api). The site is served as static files only,
// with security headers and a Content-Security-Policy that allows exactly the inline
// scripts React Router wrote into the pages, by hash.
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

/** CSP source expressions for every inline script in the given HTML documents. */
export function inlineScriptHashes(documents) {
  const hashes = new Set();
  for (const html of documents) {
    for (const [, body] of html.matchAll(INLINE_SCRIPT)) {
      hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
    }
  }
  return [...hashes].sort();
}

export function contentSecurityPolicy(scriptHashes) {
  return [
    "default-src 'none'",
    `script-src 'self' ${scriptHashes.join(" ")}`.trim(),
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function securityHeaders(scriptHashes) {
  return {
    "Content-Security-Policy": contentSecurityPolicy(scriptHashes),
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  };
}

export function outputConfig(scriptHashes) {
  return {
    version: 3,
    routes: [
      {
        src: "/assets/(.*)",
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
        continue: true,
      },
      { src: "/(.*)", headers: securityHeaders(scriptHashes), continue: true },
      { handle: "filesystem" },
      // The site has a single page; anything else gets the pre-rendered 404 page.
      { src: "/(.*)", status: 404, dest: "/404.html" },
    ],
  };
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const client = path.join(root, "build", "client");
  const output = path.join(root, ".vercel", "output");
  const staticDir = path.join(output, "static");

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(client, staticDir, { recursive: true });
  // The catch-all route pre-rendered at /404 is the page for every unknown path.
  await cp(path.join(staticDir, "404", "index.html"), path.join(staticDir, "404.html"));
  // Not needed: every path is either pre-rendered or the 404 page.
  await rm(path.join(staticDir, "__spa-fallback.html"));

  const documents = await Promise.all((await htmlFiles(staticDir)).map((file) => readFile(file, "utf8")));
  const hashes = inlineScriptHashes(documents);
  await writeFile(path.join(output, "config.json"), `${JSON.stringify(outputConfig(hashes), null, 2)}\n`);
  console.log(`[vercel-output] static site with ${hashes.length} inline script hashes in the CSP`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
