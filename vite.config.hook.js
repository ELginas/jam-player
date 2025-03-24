import { defineConfig } from "vite";
import path from "path";
import { isDev } from "./scripts/build_utils";

export default defineConfig({
  build: {
    sourcemap: isDev ? "inline" : false,
    minify: !isDev,
    lib: {
      entry: path.resolve(__dirname, "src/hook.js"),
      name: "hook.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "hook.js",
      },
    },
    emptyOutDir: false,
  },
  logLevel: isDev ? "info" : "warn",
});
