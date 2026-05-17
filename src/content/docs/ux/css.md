---
title: Structuring CSS
---

The goal, as Julia puts it, boring, legible CSS that stays easy to change[^ref],
powered by semantic HTML and vanilla CSS. Tailwind's useful lesson is structure,
not class names. We still need systems for:

- reset
- tokens
- base styles
- components
- utilities
- spacing

## Files

`app.css` imports stylesheets built from these systems in order (reset,
tokens, base, utilities, components):

```css
@import "./reset.css";
@import "./tokens.css";
@import "./base.css";
@import "./utilities.css";
@import "./components/card.css";
```

## Reset

Keep it small. Reset browser surprises, not design decisions.  If a rule
expresses the app's visual opinion, it belongs in `base.css` or a component.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
input,
textarea,
select {
  font: inherit;
}
```

## Tokens

Put shared values in `tokens.css` with role names.

```css
:root {
  --color-page: #fbfbf7;
  --color-surface: #ffffff;
  --color-text: #1b1b18;
  --color-muted: #686862;
  --color-border: #d9d9cf;
  --color-accent: #176b5d;

  --size-sm: 0.875rem;
  --line-sm: 1.25rem;
  --size-md: 1rem;
  --line-md: 1.5rem;

  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;

  --radius-md: 0.5rem;
}
```

Rules:

- Use tokens for repeated values and add them when a value becomes a project decision.
- Keep one-off measurements local, and avoid one-note palettes.

## Base

Base styles are global app opinions. Keep them few and avoid broad global
selectors like `section`, `article`, or `button` until we know every use wants
the same treatment.

```css
body {
  background: var(--color-page);
  color: var(--color-text);
  font-size: var(--size-md);
  line-height: var(--line-md);
}

a {
  color: var(--color-accent);
}
```

## Components

Most CSS lives in component files, with one root class per component.

```css
.card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);

  & .card__subtitle {
    color: var(--color-muted);
    font-size: var(--size-sm);
    line-height: var(--line-sm);
  }
}
```

Rules:

- Do not override another component's root class.
- Use `component__part` for internals (BEM-style).
- Use state classes on the root: `.card.is-selected`.
- Keep selectors shallow.
- Keep page layout outside repeated components.

Test: editing `X.css` should not change `Y.css`.

## Utilities

Utilities should be rare and stable.  Do not rebuild Tailwind one utility at a
time.

Good:

```css
.sr-only { ... }

.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}
```

## Spacing

Parents own spacing. Prefer:

```css
.cards {
  display: grid;
  gap: var(--space-4);
}
```

Avoid sprinkling margins on every child. Use margins mainly for typography flow
inside a component.

[^ref]: Evans, Julia. “Moving Away from Tailwind, and Learning to Structure My CSS.” Julia Evans, May 15, 2026. <https://jvns.ca/blog/2026/05/15/moving-away-from-tailwind--and-learning-to-structure-my-css-/>.
