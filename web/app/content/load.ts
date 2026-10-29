import { site as fallback, type SiteContent } from "./site";

// A sleeping Render free-tier service takes up to ~50 s to answer the first request.
const TIMEOUT_MS = 70_000;

export interface LoadOptions {
  apiUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  log?: (message: string) => void;
  /** Fail instead of falling back, so a deploy never replaces the live site with stale content. */
  strict?: boolean;
}

/**
 * Site content for the pre-rendered page. Reads GET /api/public/site when an API URL is
 * configured; otherwise, or when the API fails, uses the copy in site.ts so a local build never breaks.
 * On Vercel (strict) a missing URL or a failed request stops the build and the last deploy stays live.
 */
export async function loadSiteContent({
  apiUrl = process.env.CONTENT_API_URL,
  fetchImpl = fetch,
  timeoutMs = TIMEOUT_MS,
  log = console.warn,
  strict = Boolean(process.env.VERCEL),
}: LoadOptions = {}): Promise<SiteContent> {
  if (!apiUrl) {
    if (strict) throw new Error("[content] CONTENT_API_URL is not set");
    return fallback;
  }

  const url = `${apiUrl.replace(/\/+$/, "")}/api/public/site`;
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (!looksLikeSite(data)) throw new Error("unexpected response shape");
    return data;
  } catch (error) {
    const reason = `could not load ${url} (${error instanceof Error ? error.message : error})`;
    if (strict) throw new Error(`[content] ${reason}`, { cause: error });
    log(`[content] Using site.ts: ${reason}`);
    return fallback;
  }
}

// A light check so a broken response can't produce an empty page; the API's own tests cover the details.
function looksLikeSite(data: unknown): data is SiteContent {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    typeof d.headline === "object" &&
    d.headline !== null &&
    ["socials", "facts", "projects", "experience", "skills"].every((key) => Array.isArray(d[key]))
  );
}
