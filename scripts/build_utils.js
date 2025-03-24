import path from "path";
import fs from "fs/promises";

export const isDev = process.env.NODE_ENV !== "production";
export const isFirefox = process.env.PLATFORM === "firefox";
export const isChrome = process.env.PLATFORM === "chrome";

function generateManifest() {
  const manifest = {
    manifest_version: 3,
    name: "Jam Player",
    version: "0.1.2",
    author: "ELginas",
    homepage_url: "https://github.com/ELginas/jam-player",
    description: "Playtest game jam games faster and easier.",
    browser_specific_settings: {
      gecko: {
        id: "jam-player@elginas",
      },
    },
    icons: {
      64: "icons/icon-64.png",
      128: "icons/icon-128.png",
    },
    background: {
      type: "module",
    },
    action: {
      default_popup: "index.html",
    },
    content_scripts: [
      {
        matches: ["https://itch.io/*"],
        js: ["hook.js"],
        run_at: "document_start",
        world: "MAIN",
      },
      {
        matches: ["https://itch.io/*"],
        js: ["content.js"],
      },
    ],
    web_accessible_resources: [
      {
        resources: ["assets/AddToQueue.svg", "assets/RemoveFromQueue.svg"],
        matches: ["https://itch.io/*"],
      },
    ],
    permissions: ["storage", "tabs"],
  };

  if (isFirefox) {
    manifest.background.scripts = ["background.js"];
  } else {
    manifest.background.service_worker = "background.js";
  }

  return manifest;
}

export function manifestPlugin() {
  return {
    name: "manifest-plugin",
    apply: "build",
    async writeBundle(options) {
      const outputDir = options.dir;
      const filePath = path.join(outputDir, "manifest.json");
      const manifest = generateManifest();
      const content = JSON.stringify(manifest, null, 2);
      await fs.writeFile(filePath, content, "utf-8");
    },
  };
}
