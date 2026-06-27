// @ts-check
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { defineConfig, passthroughImageService } from "astro/config";
import process from "node:process";
import { fileURLToPath } from "node:url";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import { ogImageIntegration } from "./src/integrations/og-image/index.ts";
import search from "./src/integrations/search/index.ts";
import changelog from "./src/plugins/changelog/index.ts";

const deploymentUrl = new URL(process.env.SITE_URL ?? "https://garden.desertthunder.dev");
const deploymentBase = deploymentUrl.pathname.replace(/\/$/, "") || "/";
const sourceBase = "/garden";

/** @typedef {{ url?: unknown, children?: unknown, definitions?: unknown }} MarkdownNode */

function remarkDeploymentBaseLinks() {
  const basePrefix = deploymentBase === "/" ? "" : deploymentBase;

  /** @param {unknown} tree */
  return (tree) => {
    rewriteNodeUrls(tree, (url) => {
      if (!url.startsWith("/") || url.startsWith("//")) return url;

      const path = url === sourceBase ? "/" : url.startsWith(`${sourceBase}/`) ? url.slice(sourceBase.length) : url;

      return `${basePrefix}${path}`;
    });
  };
}

/**
 * @param {unknown} node
 * @param {(url: string) => string} rewriteUrl
 */
function rewriteNodeUrls(node, rewriteUrl) {
  if (node && typeof node === "object") {
    const markdownNode = /** @type {MarkdownNode} */ (node);

    if (typeof markdownNode.url === "string") {
      markdownNode.url = rewriteUrl(markdownNode.url);
    }

    if (Array.isArray(markdownNode.children)) {
      for (const child of markdownNode.children) {
        rewriteNodeUrls(child, rewriteUrl);
      }
    }

    if (Array.isArray(markdownNode.definitions)) {
      for (const definition of markdownNode.definitions) {
        rewriteNodeUrls(definition, rewriteUrl);
      }
    }
  }
}

export default defineConfig({
  site: deploymentUrl.origin,
  base: deploymentBase,
  image: { service: passthroughImageService() },
  integrations: [
    mdx(),
    changelog({ path: "changelog", contentDir: "src/content/docs", diffLines: 15, historyDays: 90 }),
    ogImageIntegration(),
    search(),
    sitemap(),
    svelte(),
  ],
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["math"] },
    processor: unified({ remarkPlugins: [remarkDeploymentBaseLinks, remarkMath], rehypePlugins: [rehypeMathjax] }),
  },
  vite: {
    resolve: {
      alias: {
        $components: fileURLToPath(new URL("./src/components", import.meta.url)),
        $layouts: fileURLToPath(new URL("./src/layouts", import.meta.url)),
        $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
      },
    },
  },
});
