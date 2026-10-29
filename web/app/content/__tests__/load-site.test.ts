import { afterEach, describe, expect, it, vi } from "vitest";

import { loadSite } from "../load-site.server";
import { site } from "../site";

afterEach(() => vi.unstubAllGlobals());

describe("loadSite", () => {
  it("uses the static content when no API URL is set", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await loadSite("")).toBe(site);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("loads the content from the API", async () => {
    const fromApi = { ...site, availability: "Open to work" };
    const fetch = vi.fn().mockResolvedValue(Response.json(fromApi));
    vi.stubGlobal("fetch", fetch);

    expect(await loadSite("https://api.example.com")).toEqual(fromApi);
    expect(String(fetch.mock.calls[0][0])).toBe("https://api.example.com/api/public/site");
  });

  it("retries while the API wakes up", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValue(Response.json(site));
    vi.stubGlobal("fetch", fetch);

    expect(await loadSite("https://api.example.com")).toEqual(site);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("fails the build instead of falling back when the API keeps failing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("down", { status: 503 })));
    await expect(loadSite("https://api.example.com")).rejects.toThrow(/Could not load site content/);
  });
});
