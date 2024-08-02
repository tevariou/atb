import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    !process.env.VITEST
      ? remix({
          ssr: false,
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
          },
          ignoredRouteFiles: ["**/*.css", "**/*.test.*"],
        })
      : react(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    // Additionally, this is to load ".env.test" during vitest
    env: loadEnv("test", process.cwd(), ""),
    setupFiles: "app/setupTests",
    mockReset: true,
  },
});
