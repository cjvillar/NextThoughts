import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@models": path.resolve(__dirname, "models"),
      "@utils": path.resolve(__dirname, "utils"),
      "@components": path.resolve(__dirname, "components"),
    },
  },
});