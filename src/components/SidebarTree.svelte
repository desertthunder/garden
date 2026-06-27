<script lang="ts">
  import SidebarTree from "$components/SidebarTree.svelte";
  import { hrefFor } from "$lib/utils/path";
  import { SvelteSet } from "svelte/reactivity";

  type SidebarNode =
    | { kind: "folder"; children: SidebarNode[]; label: string; path: string }
    | { kind: "note"; label: string; path: string };

  type Props = { base: string; currentPath: string; nodes: SidebarNode[] };

  let { base, currentPath, nodes }: Props = $props();
  let openPaths = $state(new SvelteSet<string>());
  let initializedFor = $state("");

  $effect(() => {
    const key = `${currentPath}:${nodes.map((node) => node.path).join("|")}`;
    if (initializedFor === key) return;

    openPaths = new SvelteSet(nodes.flatMap((node) => openAncestorPaths(node, currentPath)));
    initializedFor = key;
  });

  const isActive = (path: string) => currentPath === path.replace(/\/$/, "") || (path === "/" && currentPath === "/");

  const isOpen = (path: string) => openPaths.has(path);

  function toggle(path: string) {
    if (openPaths.has(path)) {
      openPaths.delete(path);
    } else {
      openPaths.add(path);
    }
  }

  function openAncestorPaths(node: SidebarNode, activePath: string): string[] {
    if (node.kind !== "folder") return [];
    const ownPath =
      isAncestorForPath(node.path, activePath) || isActiveForPath(node.path, activePath) ? [node.path] : [];
    return [...ownPath, ...node.children.flatMap((child) => openAncestorPaths(child, activePath))];
  }

  function isActiveForPath(path: string, activePath: string) {
    return activePath === path.replace(/\/$/, "") || (path === "/" && activePath === "/");
  }

  function isAncestorForPath(path: string, activePath: string) {
    const sectionPath = path.replace(/\/$/, "");
    return path !== "/" && activePath !== sectionPath && activePath.startsWith(`${sectionPath}/`);
  }
</script>

<div class="site-tree">
  <ul class="tree-root">
    {#each nodes as node (node.path)}
      <li>
        {#if node.kind === "folder"}
          <div class="folder-row" class:is-active={isActive(node.path)}>
            <button
              aria-expanded={isOpen(node.path)}
              aria-label={`${isOpen(node.path) ? "Collapse" : "Expand"} ${node.label}`}
              class="toggle"
              type="button"
              onclick={() => toggle(node.path)}>
              <span aria-hidden="true">›</span>
            </button>
            <a class="link folder-link" href={hrefFor(base, node.path)}>{node.label}</a>
          </div>

          {#if isOpen(node.path)}
            <SidebarTree {base} {currentPath} nodes={node.children} />
          {/if}
        {:else}
          <a class={["link", "note-link", isActive(node.path) && "is-active"]} href={hrefFor(base, node.path)}>
            {node.label}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .tree-root {
    display: grid;
    gap: 0.08rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .site-tree :global(.tree-root .tree-root) {
    border-left: 1px solid var(--color-border);
    margin: 0.12rem 0 0.25rem 0.62rem;
    padding-left: 0.52rem;
  }

  li {
    min-width: 0;
  }

  .folder-row {
    align-items: center;
    border-radius: 0.35rem;
    display: grid;
    grid-template-columns: 1.35rem minmax(0, 1fr);
  }

  .toggle {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 0.3rem;
    color: var(--color-muted);
    cursor: pointer;
    display: inline-flex;
    height: 1.45rem;
    justify-content: center;
    padding: 0;
    width: 1.25rem;
  }

  .toggle span {
    display: block;
    line-height: 1;
    transition: transform 120ms ease;
  }

  .toggle[aria-expanded="true"] span {
    transform: rotate(90deg);
  }

  .link {
    border-radius: 0.35rem;
    color: var(--color-muted);
    display: block;
    font-size: 0.9rem;
    line-height: 1.3;
    min-width: 0;
    overflow: hidden;
    padding: 0.3rem 0.4rem;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .folder-link {
    color: var(--color-text);
    font-weight: 650;
  }

  .folder-row:hover,
  .folder-row.is-active,
  .link:hover,
  .link:focus-visible,
  .link.is-active {
    background: var(--color-surface);
  }

  .folder-row:hover .toggle,
  .folder-row.is-active .toggle,
  .folder-row:hover .folder-link,
  .folder-row.is-active .folder-link,
  .link:hover,
  .link:focus-visible,
  .link.is-active {
    color: var(--color-accent);
  }

  .toggle:focus-visible,
  .link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>
