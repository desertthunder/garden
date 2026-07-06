import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      $components: fileURLToPath(new URL("./src/components", import.meta.url)),
      $layouts: fileURLToPath(new URL("./src/layouts", import.meta.url)),
      $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/__tests__/**/*.test.ts"],
    watch: false,
    ui: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/__tests__/**", "**/*.config.*"],
    },
  },
});
