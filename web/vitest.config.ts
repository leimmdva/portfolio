import { defineConfig } from "vitest/config";

// Tests render components directly, so they skip the React Router Vite plugin.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
  },
});
