import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { isDev } from "./scripts/build_utils";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: isDev,
      },
    }),
    tailwindcss(),
  ],
  build: {
    sourcemap: isDev ? "inline" : false,
    minify: !isDev,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: (chunk) => {
          return `${chunk.name}.js`;
        },
      },
    },
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  logLevel: isDev ? "info" : "warn",
});
