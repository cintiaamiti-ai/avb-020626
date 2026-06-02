import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// vite.config.ts — AVB v2 (020626)
// Versão limpa sem plugins Manus (para deploy GitHub Pages / Vercel)

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },

  root: path.resolve(import.meta.dirname, "client"),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    target: "es2020",
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-ui": ["lucide-react", "sonner"],
          "vendor-router": ["wouter"],
          "vendor-charts": ["recharts"],
        },
      },
    },
  },

  server: {
    port: 5173,
    host: true,
  },
});
