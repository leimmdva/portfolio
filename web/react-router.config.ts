import type { Config } from "@react-router/dev/config";

import { getSiteContent } from "./app/content/load";

// The public site is fully static: every page is pre-rendered at build time
// and served from Vercel. Content comes from the API during the build only.
export default {
  ssr: false,
  // Load the content before pre-rendering starts; see getSiteContent for why.
  async prerender() {
    await getSiteContent();
    // /404 renders the catch-all route; scripts/vercel-output.mjs serves it for unknown paths.
    return ["/", "/404"];
  },
} satisfies Config;
