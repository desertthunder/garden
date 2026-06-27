---
title: Svelte Islands in Astro
description: Use Svelte for small interactive regions inside mostly static Astro pages.
tags:
  - astro
  - frontend
  - islands
  - svelte
---

Svelte works well as an Astro island when a page is mostly static but one region
needs local browser state. Astro can build the page and pass plain data down.
Svelte can handle the interaction.

A file explorer is a good example:

- Astro builds the tree
- Svelte stores the open folders
- folder and note links remain normal anchors

## Props

Svelte 5 reads component inputs with `$props`.[^props]

```svelte
<script lang="ts">
  type Props = {
    currentPath: string;
    nodes: SidebarNode[];
  };

  let { currentPath, nodes }: Props = $props();
</script>
```

Keep island props serializable. If a component needs a smaller view model,
prepare it before hydration or derive it inside the component.

## State

Use `$state` for state the browser owns, such as expanded folders.[^state]

```svelte
<script lang="ts">
  let openPaths = $state<string[]>([]);

  function toggle(path: string) {
    openPaths = openPaths.includes(path)
      ? openPaths.filter((item) => item !== path)
      : [...openPaths, path];
  }
</script>
```

For `Set` and `Map`, use the reactive built-ins from `svelte/reactivity` or
reassign a new collection after each change.[^state]

## Derived Values

Use `$derived` when a value comes from props or state.[^derived]

```svelte
<script lang="ts">
  let { currentPath, nodes }: Props = $props();
  let activeBranches = $derived(nodes.filter((node) => currentPath.startsWith(node.path)));
</script>
```

Use `$effect` for browser effects: DOM measurement, timers, subscriptions, or
third-party libraries.[^effect] Do not use it to copy one piece of state into
another if a derived value would work.

## Recursive Components

Svelte 5 deprecates `<svelte:self>`. Import the component and render it by name.

```svelte
<script lang="ts">
  import SidebarTree from "$components/SidebarTree.svelte";
</script>

{#if node.kind === "folder"}
  <SidebarTree nodes={node.children} currentPath={currentPath} />
{/if}
```

That pattern works for file explorers, nested comments, outlines, and menus.

## Related

- [Astro Islands](/engineering/web/astro-islands/)
- [Svelte Runes](/engineering/web/svelte/runes/)
- [Svelte State Management](/engineering/web/svelte/state/)

[^props]: Svelte, "\$props", Svelte documentation, <https://svelte.dev/docs/svelte/$props>

[^state]: Svelte, "\$state", Svelte documentation, <https://svelte.dev/docs/svelte/$state>

[^derived]: Svelte, "\$derived", Svelte documentation, <https://svelte.dev/docs/svelte/$derived>

[^effect]: Svelte, "\$effect", Svelte documentation, <https://svelte.dev/docs/svelte/$effect>
