import type { Config } from "@react-router/dev/config";

// The public site is fully static: every page is pre-rendered at build time
// and served from Vercel. Content comes from the API during the build only.
export default {
  ssr: false,
  prerender: ["/"],
} satisfies Config;
