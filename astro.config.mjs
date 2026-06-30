// @ts-check
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { defineConfig, passthroughImageService } from "astro/config";
import process from "node:process";
import { fileURLToPath } from "node:url";
import rehypeMathjaxChtml from "rehype-mathjax/chtml";
import remarkMath from "remark-math";
import { ogImageIntegration } from "./src/integrations/og-image/index.ts";
import search from "./src/integrations/search/index.ts";
import changelog from "./src/plugins/changelog/index.ts";

const deploymentUrl = new URL(process.env.SITE_URL ?? "https://garden.desertthunder.dev");
const deploymentBase = deploymentUrl.pathname.replace(/\/$/, "") || "/";
const sourceBase = "/garden";

/** @type {import('astro').AstroConfig['markdown']['shikiConfig']['theme']} */
const eldritchShikiTheme = {
  name: "eldritch",
  type: /** @type {"dark"} */ ("dark"),
  colors: {
    "editor.background": "#212337",
    "editor.foreground": "#ebfafa",
    "editor.lineHighlightBackground": "#292e42",
    "editor.selectionBackground": "#76639e",
  },
  settings: [
    { settings: { background: "#212337", foreground: "#ebfafa" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#7081d0", fontStyle: "italic" } },
    { scope: ["string", "markup.inline.raw", "markup.fenced_code"], settings: { foreground: "#f1fc79" } },
    { scope: ["constant", "constant.numeric", "constant.language.boolean"], settings: { foreground: "#f16c75" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#f265b5" } },
    { scope: ["keyword", "storage.type", "storage.modifier"], settings: { foreground: "#37f499" } },
    { scope: ["keyword.control", "keyword.operator.expression"], settings: { foreground: "#a48cf2" } },
    {
      scope: ["keyword.operator", "punctuation.separator", "punctuation.terminator"],
      settings: { foreground: "#04d1f9" },
    },
    { scope: ["entity.name.type", "support.type", "support.class"], settings: { foreground: "#04d1f9" } },
    {
      scope: ["variable", "entity.name.variable", "support.variable", "meta.object-literal.key"],
      settings: { foreground: "#a48cf2" },
    },
    { scope: ["variable.parameter"], settings: { foreground: "#a48cf2" } },
    { scope: ["variable.language", "support.constant"], settings: { foreground: "#f16c75" } },
    { scope: ["entity.name.tag", "punctuation.definition.tag"], settings: { foreground: "#f16c75" } },
    { scope: ["entity.other.attribute-name", "entity.name.label"], settings: { foreground: "#a48cf2" } },
    { scope: ["string.regexp", "constant.character.escape"], settings: { foreground: "#04d1f9" } },
    { scope: ["markup.heading", "entity.name.section"], settings: { foreground: "#04d1f9", fontStyle: "bold" } },
    { scope: ["markup.bold"], settings: { foreground: "#ebfafa", fontStyle: "bold" } },
    { scope: ["markup.italic"], settings: { foreground: "#ebfafa", fontStyle: "italic" } },
    { scope: ["markup.inserted"], settings: { foreground: "#37f499" } },
    { scope: ["markup.deleted"], settings: { foreground: "#f16c75" } },
    { scope: ["invalid", "invalid.illegal"], settings: { foreground: "#f16c75" } },
    { scope: ["punctuation", "meta.brace", "meta.delimiter"], settings: { foreground: "#ABB4DA" } },
  ],
};

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
    shikiConfig: { theme: eldritchShikiTheme },
    processor: unified({
      remarkPlugins: [remarkDeploymentBaseLinks, remarkMath],
      rehypePlugins: [
        [
          rehypeMathjaxChtml,
          { chtml: { fontURL: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2" } },
        ],
      ],
    }),
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
