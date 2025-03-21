import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";
console.log(`isDev: ${isDev}`);

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
        background: path.resolve(__dirname, "src/background.ts"),
        content: path.resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          return `${chunk.name}.js`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  logLevel: isDev ? "info" : "warn",
});
