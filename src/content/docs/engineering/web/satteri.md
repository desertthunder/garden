---
title: Sätteri
tags:
  - markdown
  - satteri
  - ast
  - trees
  - plugins
---

Sätteri is a Markdown and MDX processing pipeline with a Rust parser and AST
layer, plus a JavaScript plugin layer.[^prologue]

It sits between the JavaScript Markdown ecosystem and the Rust Markdown
ecosystem: JavaScript has the larger plugin ecosystem, Rust has faster parsers,
and Sätteri tries to combine the useful parts of both.

- The parser and syntax trees live in Rust.
- Transforms are written in TypeScript or JavaScript.
- Markdown transforms run against MDAST.
- HTML transforms run against HAST.
- MDX uses a separate parser entry point with the same plugin model.
- Native binaries are available for common desktop/server platforms, with a WASI
  fallback for browser and edge runtimes.[^prologue]

Sätteri is not a faster `unified` thought its tree shapes are familiar if you know
remark and rehype, but its plugin API is not compatible with existing remark/rehype
plugins.[^prologue]

## Plugins

A plugin is an object with a `name` and one or more visitors. `defineMdastPlugin`
and `defineHastPlugin` wrap those objects for type inference before they are
passed to `markdownToHtml`.[^plugins]

MDAST visitors are keyed by Markdown node type. They receive the node and a
context object used for mutations:

```js
import { defineMdastPlugin, markdownToHtml } from "satteri";

const emojis = defineMdastPlugin({
  name: "emojis",
  text(node, ctx) {
    if (node.value.includes(":wave:")) {
      ctx.setProperty(node, "value", node.value.replaceAll(":wave:", "👋"));
    }
  },
});

const { html } = markdownToHtml("Hi :wave:", { mdastPlugins: [emojis] });
```

HAST visitors use a tag filter. That makes them a better fit for HTML-level
work, such as adding attributes to external links.[^plugins]

## Mutation Context

Plugins mutate through context rather than by treating every node as ordinary
JavaScript-owned data. The context supports common tree work: setting
properties, reading text content, finding parents, finding sibling indexes, and
inserting children.[^plugin-api]

That matters for transforms that touch siblings. A "sectionize headings"
transform, for example, needs to climb to the parent and rewrite the parent's
child list once. The Sätteri docs use a `WeakSet` for that pattern so the first
heading under a parent performs the rewrite and later headings under the same
parent do nothing.[^plugins]

## Options

`CompileOptions` is shared by `markdownToHtml` and `mdxToJs`. The important
fields for plugins are `mdastPlugins`, `hastPlugins`, `features`, `fileURL`, and
`data`.[^options]

`fileURL` must be a `URL`, not a string. When supplied, plugins read it as
`ctx.fileURL`, which makes path-aware transforms possible.[^options]

`data` seeds a document-level data bag. The same object is passed through the
compile and returned as `result.data`, so each compile should receive its own
throwaway object rather than a shared mutable one.[^options]

## Terms

| Term              | Meaning                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| `MDAST`           | Markdown syntax tree before conversion toward HTML.                    |
| `HAST`            | HTML syntax tree after Markdown has been converted toward HTML output. |
| `mdastPlugins`    | Sätteri plugins that visit Markdown-level nodes.                       |
| `hastPlugins`     | Sätteri plugins that visit HTML-level nodes.                           |
| `features`        | Parser extension flags such as GFM, frontmatter, math, and directives. |
| `ctx.fileURL`     | Document URL exposed to plugins when supplied by compile options.      |
| `ctx.setProperty` | Context method for recording a mutation on a node.                     |

## Uses

Sätteri looks useful for heading IDs, image URL rewriting, external link
attributes, section grouping, metadata collection, and document-aware transforms.

It is a poor fit when the main requirement is reusing existing remark or rehype
plugins unchanged. In that case, `unified` remains the simpler choice.

## Questions

- How stable is Sätteri's API across early releases?
- Which host frameworks expose all compile options directly?
- How expensive are JavaScript plugin crossings on large documents with many
  visited nodes?
- When is the Rust parser worth losing direct access to the existing unified
  plugin ecosystem?

[^prologue]:
    Bruits, "Prologue," Sätteri documentation,
    <https://satteri.bruits.org/docs/>. Accessed 6 Jul. 2026.

[^plugins]:
    Bruits, "Plugins," Sätteri documentation,
    <https://satteri.bruits.org/docs/plugins/>. Accessed 6 Jul. 2026.

[^options]:
    Bruits, "Options," Sätteri documentation,
    <https://satteri.bruits.org/docs/options/>. Accessed 6 Jul. 2026.

[^plugin-api]:
    Bruits, "Plugin API," Sätteri documentation,
    <https://satteri.bruits.org/docs/plugin-api/>. Accessed 6 Jul. 2026.
