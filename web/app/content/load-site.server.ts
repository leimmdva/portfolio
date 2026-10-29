import { site as fallbackSite, type SiteContent } from "./site";

// The API on Render sleeps when idle and can take close to a minute to wake up.
const ATTEMPTS = 3;
const TIMEOUT_MS = 60_000;

// Runs at build time only. With SITE_API_URL set (on Vercel), the page is built
// from GET /api/public/site and the build fails if the API can't be reached, so
// the live site keeps its last good version instead of shipping old content.
// Without it (local dev, tests, CI), the static content in site.ts is used.
export async function loadSite(apiUrl = process.env.SITE_API_URL): Promise<SiteContent> {
  if (!apiUrl) return fallbackSite;

  const url = new URL("/api/public/site", apiUrl);
  let lastError: unknown;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) throw new Error(`${url} answered ${response.status}`);
      const content = (await response.json()) as SiteContent;
      if (!content.name || !Array.isArray(content.projects)) {
        throw new Error(`${url} did not return site content`);
      }
      return content;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Could not load site content from ${url}`, { cause: lastError });
}
