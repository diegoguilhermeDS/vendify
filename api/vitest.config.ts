import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    sequence: {
      shuffle: true,
    },
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/"],
    },
    testTimeout: 10000,
    reporters: ["verbose"],
  },
});
