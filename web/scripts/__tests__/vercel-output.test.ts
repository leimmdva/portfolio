import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { contentSecurityPolicy, inlineScriptHashes, outputConfig } from "../vercel-output.mjs";

const sha = (body: string) => `'sha256-${createHash("sha256").update(body).digest("base64")}'`;

describe("inlineScriptHashes", () => {
  it("hashes inline scripts only, once each, across documents", () => {
    const a = `<script>one()</script><script type="module" async="">two()</script><script src="/x.js"></script>`;
    const b = `<script>one()</script>`;

    expect(inlineScriptHashes([a, b])).toEqual([sha("one()"), sha("two()")].sort());
  });
});

describe("contentSecurityPolicy", () => {
  const csp = contentSecurityPolicy(["'sha256-abc'"]);

  it("allows only the site's own files and the hashed inline scripts", () => {
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("script-src 'self' 'sha256-abc'");
    expect(csp).not.toMatch(/unsafe-inline|unsafe-eval|data:|\*/);
  });

  it("forbids framing, plugins and base or form hijacking", () => {
    for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'none'", "form-action 'none'"]) {
      expect(csp).toContain(directive);
    }
  });
});

describe("outputConfig", () => {
  const { routes } = outputConfig(["'sha256-abc'"]);

  it("sends the security headers on every path", () => {
    const all = routes.find((r) => "src" in r && r.src === "/(.*)" && r.headers);
    expect(all && "headers" in all ? all.headers : undefined).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Access-Control-Allow-Origin": "https://leylammdva.com",
    });
  });

  it("serves the static 404 page for unknown paths", () => {
    expect(routes.at(-1)).toEqual({ src: "/(.*)", status: 404, dest: "/404.html" });
  });
});
