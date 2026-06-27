---
title: Astro Islands
description: Hydrate only the interactive parts of an otherwise static Astro page.
tags:
  - astro
  - frontend
  - islands
---

Astro renders HTML by default. A component becomes interactive only when it uses
a `client:*` directive.[^astro-islands] That keeps static pages cheap while still
allowing small pockets of browser state.

Use an island when a component needs state after the page loads:

- a collapsible navigation tree
- a theme switcher
- a search overlay
- a media control

Leave everything else as Astro. Headings, article bodies, metadata, static
lists, and simple links do not need hydration.

```astro
---
import SidebarTree from "$components/SidebarTree.svelte";
---

<SidebarTree nodes={tree} currentPath={currentPath} client:load />
```

## Client directives

`client:load` hydrates as soon as possible. Use it for controls that should work
immediately, such as main navigation.

`client:idle` waits until the browser has idle time. It fits lower-priority
widgets.

`client:visible` waits until the island enters the viewport. It fits components
below the fold.

No directive means no client JavaScript.

## Island boundaries

Pass plain data into an island. Keep server-only objects on the Astro side.

Good island props:

- labels and hrefs
- current path
- small trees or lists
- precomputed preview payloads

Avoid passing:

- raw content collection entries
- rendered Markdown components
- functions
- filesystem paths

The island should receive the smallest shape it needs to render and handle
interaction.

## Related notes

- [Svelte Islands in Astro](/engineering/web/svelte/islands/)
- [Svelte Runes](/engineering/web/svelte/runes/)

[^astro-islands]: Astro, "Islands architecture", Astro documentation, <https://docs.astro.build/en/concepts/islands/>
