---
title: Testing Svelte Projects
tags:
  - frontend
  - svelte
  - testing
---

This page provides an overview of testing strategies for Svelte applications, covering unit
tests, component tests, browser component tests, server tests, and end-to-end tests. It emphasizes
testing stable behavior and contracts rather than Svelte.

Svelte testing works best as a small pyramid: extract logic into unit tests, mount components
only when behavior needs a DOM, and keep a few end-to-end tests for production-like confidence.
The Svelte FAQ describes the usual split as unit, component, and end-to-end tests, and notes
that you do not need to test implementation details that Svelte itself already covers.[^svelte-faq]

## Unit tests

Use unit tests for business logic, validation, data transformation, state helpers, and edge cases.
If a component is hard to test, first ask whether too much logic lives inside the component.

For Vite and SvelteKit projects, Svelte recommends Vitest. A manual setup starts with:

```sh
pnpm add -D vitest
```

When Vitest runs code that should resolve browser package entry points, configure Vite
like this:[^svelte-testing]

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({ resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined });
```

Svelte 5 runes can be used inside tests if the test filename includes `.svelte`,
such as `counter.svelte.test.ts`. Use `flushSync` when pending state or effects must
be observed synchronously, and wrap effect-based tests in `$effect.root` so they
can be cleaned up.[^svelte-testing]

## Component tests

Component tests are useful when behavior depends on DOM mounting, events, bindings, context,
snippets, lifecycle, or accessibility. For jsdom-based tests, install jsdom and set Vitest's
environment to `jsdom`, or add `// @vitest-environment jsdom` only to files that need
DOM APIs.[^svelte-testing]

For low-level tests, Svelte exposes `mount`, `unmount`, and `flushSync`:[^svelte-testing]

```ts
import { flushSync, mount, unmount } from "svelte";
import { expect, test } from "vitest";
import Counter from "./Counter.svelte";

test("increments", () => {
  const component = mount(Counter, { target: document.body });

  document.body.querySelector("button")?.click();
  flushSync();

  expect(document.body.querySelector("button")).toHaveTextContent("1");
  unmount(component);
});
```

Prefer Testing Library for user-facing behavior:

```ts
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Counter from "./Counter.svelte";

test("increments", async () => {
  const user = userEvent.setup();
  render(Counter);

  const button = screen.getByRole("button");
  await user.click(button);

  expect(button).toHaveTextContent("1");
});
```

When testing two-way bindings, context, or snippet props, make a small wrapper
component for the test and interact with it through the DOM.[^svelte-testing]

## Browser component tests

Use real browser component tests when jsdom is too synthetic: focus behavior, realistic events,
browser APIs, and high-value component flows. Sveltest is a reference project and CLI for
`vitest-browser-svelte` patterns in Svelte 5 and SvelteKit applications.[^sveltest-readme]

Useful Sveltest commands:

```sh
pnpx sveltest list
pnpx sveltest search form
pnpx sveltest get button
```

The Sveltest site describes the project as a collection of testing patterns and examples for
modern Svelte applications, including AI-assistant rules and examples for Vitest and
`vitest-browser-svelte`.[^sveltest-site]

## SvelteKit server, form, and SSR tests

Avoid server tests that pass only because everything is mocked. Sveltest's client-server alignment
strategy recommends shared validation logic, real `FormData` and `Request` objects in server tests,
TypeScript contracts between client and server, and E2E tests as the final safety net.[^sveltest-readme]

Good server tests usually cover:

- successful requests or form actions
- validation failures
- authorization failures
- unexpected failures from external boundaries
- shared client/server contract drift

Mock databases, queues, email, network APIs, auth providers, and other external systems.
Do not mock the format your own client sends to your own server.

## End-to-end tests

End-to-end tests exercise the app through the user's eyes. Svelte's docs use Playwright as the main
example and show a config that builds and previews the app before running tests:[^svelte-testing]

```ts
const config = {
  webServer: { command: "npm run build && npm run preview", port: 4173 },
  testDir: "tests",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
};

export default config;
```

Keep E2E coverage small but meaningful: one critical happy path, one important failure path, and
any flow that would be expensive to catch with isolated tests.

## Checklist

- Test stable behavior and contracts, not Svelte internals.
- Extract logic before reaching for component tests.
- Use accessible queries where possible.
- Await user interactions.
- Use `flushSync` only when synchronous assertions need it.
- Use browser-mode tests when browser reality matters.
- Use real web primitives in server tests.
- Keep at least one E2E test for the core user journey.

[^svelte-faq]: Svelte, “How do I test Svelte apps?”, Svelte FAQ, <https://svelte.dev/docs/svelte/faq#How-do-I-test-Svelte-apps>
[^svelte-testing]: Svelte, “Testing”, Svelte documentation LLM text, <https://svelte.dev/docs/svelte/testing/>
[^sveltest-site]: Scott Spence, “Sveltest - Comprehensive Testing Suite for Svelte”, <https://sveltest.dev/>
[^sveltest-readme]: Scott Spence, “Sveltest”, GitHub repository README, <https://github.com/spences10/sveltest>
