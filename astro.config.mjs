// @ts-check
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { defineConfig, passthroughImageService } from "astro/config";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import starlightLinksValidator from "starlight-links-validator";
import starlightThemeRapide from "starlight-theme-rapide";
import { ogImageIntegration } from "./src/integrations/og-image/index.ts";
import starlightChangelog from "./src/plugins/starlight-changelog/index.ts";

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
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Welcome", slug: "" },
            { label: "Books", slug: "books" },
            { label: "Recent Updates", link: "changelog" },
          ],
        },
        { label: "Writing", collapsed: true, autogenerate: { directory: "writing" } },
        { label: "Philosophy", collapsed: true, autogenerate: { directory: "philosophy" } },
        { label: "Psychology", collapsed: true, autogenerate: { directory: "psychology" } },
        { label: "Sociology", collapsed: true, autogenerate: { directory: "sociology" } },
        {
          label: "Culture",
          collapsed: true,
          items: [
            { slug: "culture" },
            { label: "Internet", collapsed: true, autogenerate: { directory: "culture/internet" } },
            { label: "Baseball", collapsed: true, autogenerate: { directory: "culture/baseball" } },
          ],
        },
        { label: "Unix", collapsed: true, autogenerate: { directory: "unix" } },
        {
          label: "Engineering",
          collapsed: true,
          items: [
            { slug: "engineering" },
            { label: "General", collapsed: true, autogenerate: { directory: "engineering/general" } },
            { label: "Git", collapsed: true, autogenerate: { directory: "engineering/git" } },
            { label: "Architecture", collapsed: true, autogenerate: { directory: "engineering/architecture" } },
            { label: "Databases", collapsed: true, autogenerate: { directory: "engineering/databases" } },
            { label: "Web", collapsed: true, autogenerate: { directory: "engineering/web" } },
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
            { label: "Flutter", collapsed: true, autogenerate: { directory: "engineering/flutter" } },
          ],
        },
        { label: "UX", collapsed: true, autogenerate: { directory: "ux" } },
        {
          label: "Programming",
          collapsed: true,
          items: [
            { slug: "programming" },
            { label: "General", collapsed: true, autogenerate: { directory: "programming/general" } },
            { label: "Design", collapsed: true, autogenerate: { directory: "programming/design" } },
            { label: "Data Structures", collapsed: true, autogenerate: { directory: "programming/data_structures" } },
            { label: "Algorithms", collapsed: true, autogenerate: { directory: "programming/algorithms" } },
            {
              label: "Functional Programming",
              collapsed: true,
              autogenerate: { directory: "programming/functional_programming" },
            },
            { label: "BEAM", collapsed: true, autogenerate: { directory: "programming/beam" } },
            { label: "Creative Coding", collapsed: true, autogenerate: { directory: "programming/creative" } },
            { label: "C & C++", collapsed: true, autogenerate: { directory: "programming/c_cpp" } },
            { label: "Golang", collapsed: true, autogenerate: { directory: "programming/golang" } },
            { label: "Python", collapsed: true, autogenerate: { directory: "programming/python" } },
            { label: "Rust", collapsed: true, autogenerate: { directory: "programming/rust" } },
          ],
        },
      ],
    }),
    ogImageIntegration(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["math"] },
    remarkPlugins: [remarkDeploymentBaseLinks, remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
});
