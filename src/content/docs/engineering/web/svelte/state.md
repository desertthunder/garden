---
title: State Management
---

SvelteKit state management is mostly about where state should live in an app that spans server and client. Its rule of thumb[^kit-state] is to keep server state request-scoped and avoid shared module state for per-user data. For Svelte 5 component reactivity, see [Runes](/engineering/web/svelte/runes/).

## SvelteKit state rules

### Do not put user state in server module globals

A browser is stateful, but a server process can be long-lived and shared by many users.
A top-level variable in a server module is shared by everyone who hits that server process,
and can also disappear when the process restarts. SvelteKit's state management docs use this
as the core warning: do not store per-user data in shared server variables.[^kit-state]

Do this instead:

- authenticate users with cookies
- persist durable user data in a database
- return request-specific data from `load`
- pass that data through props, context, or `$app/state`

### Keep `load` pure

Do not write to stores, globals, or other shared state inside `load`.

Return data from `load` and let SvelteKit pass it to the page.

This keeps SSR safe and makes the app easier to reason about.[^kit-state]

```ts
export async function load({ fetch }) {
  const response = await fetch("/api/user");

  return { user: await response.json() };
}
```

### Use context for app-level state

SvelteKit's own app state uses Svelte context on the server so that state is
attached to the component tree instead of a process-global singleton. You can
use the same pattern for your own state. Pass a function through context to
preserve reactivity across boundaries:[^kit-state]

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { setContext } from 'svelte';

  let { data } = $props();

  setContext('user', () => data.user);
</script>
```

```svelte
<!-- src/routes/user/+page.svelte -->
<script>
  import { getContext } from 'svelte';

  const user = getContext('user');
</script>

<p>Welcome {user().name}</p>
```

Prefer passing state down. During SSR, updating context state from a deeper
component cannot change markup that a parent has already rendered;
on the client, the parent can react to the new value, which can cause hydration
flashes.[^kit-state]

### Page and layout components are reused

SvelteKit preserves layout and page component instances across navigation.

That means setup code in a component does not rerun just because `data` changed,
and `onMount`/`onDestroy` do not rerun on every route change.

Values derived from `data` must be reactive:[^kit-state]

```svelte
<script>
  let { data } = $props();

  let wordCount = $derived(data.content.split(' ').length);
  let estimatedReadingTime = $derived(wordCount / 250);
</script>
```

If a component must be destroyed and recreated on navigation, key it by URL:

```svelte
<script>
  import { page } from '$app/state';
</script>

{#key page.url.pathname}
  <BlogPost title={data.title} content={data.content} />
{/key}
```

### Put durable navigation state in the URL

If state should survive reloads or affect SSR, put it in the URL.
Filters, sorting, tabs, and pagination often belong in search params like
`?sort=price&order=ascending`.

Read them in `load` through the `url` parameter or in components through `page.url.searchParams`.[^kit-state]

For disposable UI state that should survive back/forward navigation without
becoming URL or database state, use SvelteKit snapshots.[^kit-state]

## Choosing where state belongs

| State kind                        | Put it here                           |
| --------------------------------- | ------------------------------------- |
| Durable user data                 | database, keyed by authenticated user |
| Request-specific server data      | `load` return values                  |
| App tree state during SSR         | Svelte context or `$app/state`        |
| URL-affecting state               | URL search params                     |
| Disposable history-entry UI state | SvelteKit snapshots                   |

For component-local state, derived values, component props, and browser effects,
use Svelte 5 runes like `$state`, `$derived`, `$props`, and `$effect`;
see [Runes](/engineering/web/svelte/runes/).

For small interactive widgets inside Astro pages, see [Svelte Islands in Astro](/engineering/web/svelte/islands/).

[^kit-state]: SvelteKit, “State management”, SvelteKit documentation, <https://svelte.dev/docs/kit/state-management/>
