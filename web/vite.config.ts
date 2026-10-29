import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  build: {
    // Keep every asset a file so the Content-Security-Policy needs no data: sources.
    assetsInlineLimit: 0,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
