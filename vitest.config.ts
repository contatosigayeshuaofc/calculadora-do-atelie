import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/e2e/**", "**/test-results/**", "**/playwright-report/**"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 10000,
  },
});
