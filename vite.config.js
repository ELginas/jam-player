import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { manifestPlugin, isDev } from "./scripts/build_utils";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: isDev,
      },
    }),
    tailwindcss(),
    manifestPlugin(),
  ],
  build: {
    sourcemap: isDev ? "inline" : false,
    minify: !isDev,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
        options: path.resolve(__dirname, "options.html"),
        notification: path.resolve(__dirname, "notification.html"),
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
      $lib: path.resolve("./src/lib"),
    },
  },
  logLevel: isDev ? "info" : "warn",
});
