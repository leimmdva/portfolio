import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteContent, loadSiteContent, resetSiteContent } from "../load";
import { site } from "../site";

const apiSite = { ...site, name: "From the API" };
const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

describe("loadSiteContent", () => {
  it("uses site.ts when no API URL is set", async () => {
    const fetchImpl = vi.fn();
    expect(await loadSiteContent({ apiUrl: "", fetchImpl })).toBe(site);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns the API content", async () => {
    const fetchImpl = vi.fn(() => json(apiSite));
    const result = await loadSiteContent({ apiUrl: "https://api.example.com/", fetchImpl, log: () => {} });

    expect(result.name).toBe("From the API");
    expect(fetchImpl).toHaveBeenCalledWith("https://api.example.com/api/public/site", expect.anything());
  });

  it.each([
    ["an error status", () => json({ title: "Not found" }, 404)],
    ["a network error", () => Promise.reject(new TypeError("fetch failed"))],
    ["an unexpected shape", () => json({ name: "x" })],
  ])("falls back to site.ts on %s and says why", async (_, response) => {
    const log = vi.fn();
    const result = await loadSiteContent({ apiUrl: "https://api.example.com", fetchImpl: vi.fn(response), log });

    expect(result).toBe(site);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Using site.ts"));
  });

  it("gives up after the timeout", async () => {
    const hang: typeof fetch = (_, init) =>
      new Promise((_, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal?.reason)));
    const result = await loadSiteContent({ apiUrl: "https://api.example.com", fetchImpl: hang, timeoutMs: 20, log: () => {} });

    expect(result).toBe(site);
  });

  describe("when strict (Vercel builds)", () => {
    it("fails instead of using site.ts when the API fails", async () => {
      const fetchImpl = vi.fn(() => json({ title: "Unavailable" }, 503));
      await expect(
        loadSiteContent({ apiUrl: "https://api.example.com", fetchImpl, strict: true }),
      ).rejects.toThrow("could not load https://api.example.com/api/public/site (HTTP 503)");
    });

    it("fails when no API URL is set", async () => {
      await expect(loadSiteContent({ apiUrl: "", strict: true })).rejects.toThrow("CONTENT_API_URL is not set");
    });

    it("still returns the API content", async () => {
      const fetchImpl = vi.fn(() => json(apiSite));
      const result = await loadSiteContent({ apiUrl: "https://api.example.com", fetchImpl, strict: true });
      expect(result.name).toBe("From the API");
    });
  });
});

describe("getSiteContent", () => {
  afterEach(resetSiteContent);

  it("fetches once and shares the result across calls", async () => {
    const fetchImpl = vi.fn(() => json(apiSite));
    const options = { apiUrl: "https://api.example.com", fetchImpl, log: () => {} };

    const first = await getSiteContent(options);
    const second = await getSiteContent();

    expect(second).toBe(first);
    expect(first.name).toBe("From the API");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
