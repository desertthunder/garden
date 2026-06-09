---
title: Runes
---

Svelte 5 uses runes for explicit component reactivity. This page covers the core state-related runes: `$state`, `$derived`, `$props`, and `$effect`. For SvelteKit server/client state placement, see [Svelte State Management](/engineering/web/svelte/state/).

## What runes are

Runes are Svelte 5 syntax that controls the compiler. They begin with `$`, look like function
calls, and do not need imports. They are not normal JavaScript values: you cannot assign them
to variables or pass them as arguments, and the compiler only allows them in valid positions.[^runes]

```svelte
<script>
  let message = $state('hello');
</script>
```

## `$state`

`$state` creates reactive state. The variable behaves like the value itself rather than like a
store object or setter API:[^state]

```svelte
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  clicks: {count}
</button>
```

When `$state` wraps an array or plain object, Svelte creates a deeply reactive proxy.
Mutating a nested property or calling an array method such as `push` triggers granular updates
for the parts of the UI that read that property.[^state]

```svelte
<script>
  let todos = $state([{ done: false, text: 'learn runes' }]);
</script>

<button onclick={() => (todos[0].done = !todos[0].done)}>
  {todos[0].done ? 'done' : 'not done'}
</button>
```

Important details:

- Destructuring a reactive value gives you ordinary JavaScript references, not live reactive references.[^state]
- Class instances are not proxied, but class fields can use `$state`.[^state]
- Use reactive built-ins from `svelte/reactivity` for reactive `Set`, `Map`, `Date`, and `URL`.[^state]
- Use `$state.raw` for large objects or arrays that should only update by reassignment, not deep mutation.[^state]
- Use `$state.snapshot` when passing a non-proxy copy to APIs or libraries.[^state]
- Use `$state.eager` sparingly for immediate visual feedback during synchronized `await` updates.[^state]

## `$derived`

`$derived` creates reactive values from other reactive values. Component setup code runs once, so derived expressions are how you keep calculations in sync with changing state or props.[^derived]

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  {count} doubled is {doubled}
</button>
```

A `$derived` expression should be free of side effects. Svelte disallows state changes such as `count++` inside derived expressions.[^derived]

For multi-line calculations, use `$derived.by`:

```svelte
<script>
  let numbers = $state([1, 2, 3]);

  let total = $derived.by(() => {
    let sum = 0;
    for (const n of numbers) sum += n;
    return sum;
  });
</script>
```

Svelte tracks values read synchronously inside the derived expression or function body. Derived values are recalculated lazily when next read, and downstream updates are skipped if the derived value is referentially unchanged.[^derived]

Deriveds can also be temporarily reassigned, which is useful for optimistic UI:[^derived]

```svelte
<script>
  let { post, like } = $props();
  let likes = $derived(post.likes);

  async function onclick() {
    likes += 1;

    try {
      await like();
    } catch {
      likes -= 1;
    }
  }
</script>

<button {onclick}>🧡 {likes}</button>
```

## `$props`

`$props` reads component inputs. Most components destructure the returned props object:[^props]

```svelte
<script>
  let { adjective = 'happy' } = $props();
</script>

<p>This component is {adjective}</p>
```

Destructuring also supports renaming invalid identifiers, rest props, and TypeScript annotations:[^props]

```svelte
<script lang="ts">
  interface Props {
    adjective: string;
    disabled?: boolean;
  }

  let { adjective, disabled = false }: Props = $props();
</script>
```

Props update when the parent updates. A child can temporarily reassign a prop value for local ephemeral state, but it should not mutate props it does not own unless the prop is explicitly bindable. Mutating a reactive proxy passed from a parent can update the UI but causes an ownership warning.[^props]

For accessible form fields and labels, `$props.id()` creates an ID unique to the component instance and stable across SSR hydration.[^props]

```svelte
<script>
  const uid = $props.id();
</script>

<label for="{uid}-email">Email</label>
<input id="{uid}-email" type="email" />
```

## `$effect`

`$effect` runs side-effecting code when reactive dependencies change. It runs in the browser, not during server-side rendering, after the component has mounted and after DOM updates have been applied.[^effect]

Use it for browser effects: third-party libraries, canvas drawing, analytics, subscriptions, timers, or direct DOM work.

```svelte
<script>
  let size = $state(50);
  let color = $state('#ff3e00');
  let canvas;

  $effect(() => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  });
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Svelte tracks reactive values read synchronously inside the effect and reruns the effect when they change. Values read after an `await`, inside `setTimeout`, or in another asynchronous callback are not tracked.[^effect]

An effect can return a teardown function. The teardown runs before the effect reruns and when the effect is destroyed:[^effect]

```svelte
<script>
  let count = $state(0);
  let milliseconds = $state(1000);

  $effect(() => {
    const interval = setInterval(() => {
      count += 1;
    }, milliseconds);

    return () => clearInterval(interval);
  });
</script>
```

Do not use `$effect` to synchronize state that can be expressed as derived state. Prefer this:[^effect]

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

Advanced variants exist for rarer cases: `$effect.pre` runs before DOM updates,
`$effect.tracking()` reports whether code is running in a tracking context,
`$effect.pending()` reports pending promises in the current boundary, and
`$effect.root` creates a manually controlled effect scope.[^effect]

## Choosing a rune

| Need                             | Use        |
| -------------------------------- | ---------- |
| Component-local mutable state    | `$state`   |
| Calculation from reactive inputs | `$derived` |
| Component inputs                 | `$props`   |
| Browser side effects             | `$effect`  |

[^runes]: Svelte, “What are runes?”, Svelte documentation, https://svelte.dev/docs/svelte/what-are-runes

[^state]: Svelte, “$state”, Svelte documentation LLM text, https://svelte.dev/docs/svelte/$state/llms.txt

[^derived]: Svelte, “$derived”, Svelte documentation LLM text, https://svelte.dev/docs/svelte/$derived/llms.txt

[^props]: Svelte, “$props”, Svelte documentation LLM text, https://svelte.dev/docs/svelte/$props/llms.txt

[^effect]: Svelte, “$effect”, Svelte documentation LLM text, https://svelte.dev/docs/svelte/$effect/llms.txt
