import type { AstroIntegration } from "astro";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function ogImageIntegration(): AstroIntegration {
  return {
    name: "garden-og-image",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        injectRoute({ pattern: "/og.png", entrypoint: join(__dirname, "endpoint.ts"), prerender: true });
      },
    },
  };
}
