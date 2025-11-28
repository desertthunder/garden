---
title: Starlight Plugins
description: Building custom plugins for Astro Starlight
---

Starlight plugins extend documentation sites with custom functionality through a hook-based system.

## Plugin Structure

A Starlight plugin exports a function that returns a `StarlightPlugin` object:

```ts
export default function myPlugin(config?: PluginConfig): StarlightPlugin {
  return {
    name: "my-plugin",
    hooks: {
      setup({ addIntegration, logger }) {
        // Plugin initialization
      },
    },
  };
}
```

## Core Concepts

- Plugins use the `setup` hook to add Astro integrations
- Access to `addIntegration` allows injecting routes and updating config
- Use `injectRoute` to add custom pages with `.astro` components
- Routes require absolute file paths via `new URL('./route.astro', import.meta.url).pathname`

## Adding Routes

```ts
addIntegration({
  name: "my-integration",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      injectRoute({
        pattern: "custom-page",
        entrypoint: new URL("./route.astro", import.meta.url).pathname,
        prerender: true,
      });
    },
  },
});
```

## Configuration

Register plugins in `astro.config.mjs`:

```javascript
starlight({
  plugins: [myPlugin({ option: "value" })],
});
```

## References

- [Starlight Plugins Documentation](https://starlight.astro.build/reference/plugins/)
- [Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/)
