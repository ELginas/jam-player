import { defineConfig } from "vite";
import path from "path";
import { isDev } from "./scripts/build_utils";

export default defineConfig({
  build: {
    sourcemap: isDev ? "inline" : false,
    minify: !isDev,
    lib: {
      entry: path.resolve(__dirname, "src/background.ts"),
      name: "background.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "background.js",
      },
    },
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  logLevel: isDev ? "info" : "warn",
});
