// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  test: {
    // ─── Ambiente ─────────────────────────────────────────────────────────────
    environment: "jsdom",

    // ─── Setup global ─────────────────────────────────────────────────────────
    setupFiles: ["./src/test/setup.ts"],

    // ─── Globals (describe, it, expect sem import) ────────────────────────────
    globals: true,

    // ─── Cobertura ────────────────────────────────────────────────────────────
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },

    // ─── Padrão de arquivos de teste ──────────────────────────────────────────
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.{test,spec}.{ts,tsx}"],

    // ─── Timeout ─────────────────────────────────────────────────────────────
    testTimeout: 10000,
    hookTimeout: 10000,
  },

  // ─── Resolver aliases (espelha vite.config.ts) ───────────────────────────────
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
