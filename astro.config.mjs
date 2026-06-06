// @ts-check
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig, passthroughImageService } from "astro/config";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import starlightLinksValidator from "starlight-links-validator";
import starlightThemeRapide from "starlight-theme-rapide";
import { ogImageIntegration } from "./src/integrations/og-image/index.ts";
import starlightChangelog from "./src/plugins/starlight-changelog/index.ts";
import process from "node:process";

const deploymentUrl = new URL(process.env.SITE_URL ?? "https://desertthunder.github.io/garden");
const deploymentBase = deploymentUrl.pathname.replace(/\/$/, "") || "/";
const sourceBase = "/garden";
const ogImageUrl = new URL(`${deploymentBase === "/" ? "" : deploymentBase}/og.png`, deploymentUrl.origin).toString();

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
    starlight({
      title: "Owais' Places",
      lastUpdated: true,
      head: [
        { tag: "meta", attrs: { property: "og:image", content: ogImageUrl } },
        { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:image", content: ogImageUrl } },
      ],
      plugins: [
        starlightThemeRapide(),
        starlightLinksValidator(),
        starlightChangelog({ path: "changelog", contentDir: "src/content/docs", diffLines: 15, historyDays: 90 }),
      ],
      social: [
        { label: "github", icon: "github", href: "https://github.com/desertthunder/garden" },
        { label: "codeberg", icon: "codeberg", href: "https://codeberg.org/desertthunder" },
        { label: "blueSky", icon: "blueSky", href: "https://bsky.app/profile/desertthunder.dev" },
        { label: "linkedin", icon: "linkedin", href: "https://www.linkedin.com/in/owais-jamil/" },
      ],
      customCss: ["./src/styles/custom.css"],
      components: { Footer: "./src/components/Footer.astro" },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Welcome", slug: "" },
            { label: "Books", slug: "books" },
            { label: "Recent Updates", link: "changelog" },
          ],
        },
        { label: "Writing", collapsed: true, items: [{ autogenerate: { directory: "writing", collapsed: true } }] },
        { label: "Philosophy", collapsed: true, items: [{ autogenerate: { directory: "philosophy", collapsed: true } }] },
        { label: "Psychology", collapsed: true, items: [{ autogenerate: { directory: "psychology", collapsed: true } }] },
        { label: "Sociology", collapsed: true, items: [{ autogenerate: { directory: "sociology", collapsed: true } }] },
        {
          label: "Culture",
          collapsed: true,
          items: [
            { slug: "culture" },
            { label: "Internet", collapsed: true, items: [{ autogenerate: { directory: "culture/internet", collapsed: true } }] },
            { label: "Baseball", collapsed: true, items: [{ autogenerate: { directory: "culture/baseball", collapsed: true } }] },
          ],
        },
        {
          label: "Software Engineering",
          collapsed: true,
          items: [
            { slug: "engineering" },
            { label: "General", collapsed: true, items: [{ autogenerate: { directory: "engineering/general", collapsed: true } }] },
            { label: "Git", collapsed: true, items: [{ autogenerate: { directory: "engineering/git", collapsed: true } }] },
            { label: "Architecture", collapsed: true, items: [{ autogenerate: { directory: "engineering/architecture", collapsed: true } }] },
            { label: "Databases", collapsed: true, items: [{ autogenerate: { directory: "engineering/databases", collapsed: true } }] },
            { label: "Web", collapsed: true, items: [{ autogenerate: { directory: "engineering/web", collapsed: true } }] },
            {
              label: "AT Protocol",
              collapsed: true,
              items: [
                { label: "Overview", slug: "engineering/atproto" },
                { label: "Information Civics", slug: "engineering/atproto/information-civics" },
                { label: "Merkle Search Tree (MST)", slug: "engineering/atproto/mst" },
                { label: "CAR Format", slug: "engineering/atproto/car" },
                { label: "DAG-CBOR", slug: "engineering/atproto/cbor" },
                { label: "Constellation", slug: "engineering/atproto/constellation" },
                {
                  label: "OAuth",
                  collapsed: true,
                  items: [
                    { label: "AT Protocol OAuth", slug: "engineering/atproto/oauth" },
                    { label: "Authorization Flow", slug: "engineering/atproto/oauth/flow" },
                    { label: "Clients and Metadata", slug: "engineering/atproto/oauth/clients" },
                    { label: "Tokens and Security", slug: "engineering/atproto/oauth/tokens" },
                    { label: "Identity and Discovery", slug: "engineering/atproto/oauth/identity" },
                  ],
                },
              ],
            },
            { label: "Flutter", collapsed: true, items: [{ autogenerate: { directory: "engineering/flutter", collapsed: true } }] },
            {
              label: "Programming",
              collapsed: true,
              items: [
                { slug: "programming" },
                { label: "General", collapsed: true, items: [{ autogenerate: { directory: "programming/general", collapsed: true } }] },
                { label: "Design", collapsed: true, items: [{ autogenerate: { directory: "programming/design", collapsed: true } }] },
                {
                  label: "Data Structures",
                  collapsed: true,
                  items: [{ autogenerate: { directory: "programming/data_structures", collapsed: true } }],
                },
                { label: "Algorithms", collapsed: true, items: [{ autogenerate: { directory: "programming/algorithms", collapsed: true } }] },
                {
                  label: "Functional Programming",
                  collapsed: true,
                  items: [{ autogenerate: { directory: "programming/functional_programming", collapsed: true } }],
                },
                { label: "BEAM", collapsed: true, items: [{ autogenerate: { directory: "programming/beam", collapsed: true } }] },
                { label: "Creative Coding", collapsed: true, items: [{ autogenerate: { directory: "programming/creative", collapsed: true } }] },
                { label: "C & C++", collapsed: true, items: [{ autogenerate: { directory: "programming/c_cpp", collapsed: true } }] },
                { label: "Golang", collapsed: true, items: [{ autogenerate: { directory: "programming/golang", collapsed: true } }] },
                { label: "Python", collapsed: true, items: [{ autogenerate: { directory: "programming/python", collapsed: true } }] },
                { label: "Rust", collapsed: true, items: [{ autogenerate: { directory: "programming/rust", collapsed: true } }] },
                { label: "Zig", collapsed: true, items: [{ autogenerate: { directory: "programming/zig", collapsed: true } }] },
              ],
            },
            { label: "Unix", collapsed: true, items: [{ autogenerate: { directory: "unix", collapsed: true } }] },
            { label: "UX", collapsed: true, items: [{ autogenerate: { directory: "ux", collapsed: true } }] },
          ],
        },
      ],
    }),
    ogImageIntegration(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["math"] },
    processor: unified({
      remarkPlugins: [remarkDeploymentBaseLinks, remarkMath],
      rehypePlugins: [rehypeMathjax],
    }),
  },
});
