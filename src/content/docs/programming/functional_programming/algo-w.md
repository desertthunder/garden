---
title: Algorithm W
tags:
  - functional-programming
  - programming
  - type-systems
---

Algorithm W is a **syntax-directed** way to *construct* proofs of these judgments and compute principal types. ([Wikipedia][^1])

Algorithm W takes an environment and an expression and returns:

```text
W(Γ, e) = (S, τ)
```

meaning: under substitution `S`, `e` has monotype `τ` in environment `SΓ`.

Core machinery:

- **Fresh type variables**: `newvar()`.
- **Substitutions** `S`: finite maps from type variables to types; applied everywhere.
- **Instantiation**: `inst(∀α₁…αₙ. τ)` replaces each `αᵢ` with a fresh type variable.
- **Generalization**: `Gen(Γ, τ)`, as above.
- **Unification**: `mgu(τ₁, τ₂)` gives the **most general unifier** substitution that makes `τ₁` and `τ₂` equal, or fails with a type error. ([Wikipedia][^1])

## Variable

```text
W(Γ, x):
  let σ = Γ(x)
      τ = inst(σ)
  in  (Id, τ)
```

- Look up `x`’s scheme, instantiate to a monotype.

### Abstraction `λx. e`

```text
W(Γ, λx. e):
  let α      = newvar()
      (S, τ) = W(Γ[x ↦ α], e)
  in  (S, S α -> τ)
```

- `x` starts out monomorphic with type `α`.
- Body may refine `α` via `S`.
- Final function type uses `S α`.

## Application `e1 e2`

```text
W(Γ, e1 e2):
  let (S1, τ1) = W(Γ, e1)
      (S2, τ2) = W(S1 Γ, e2)
      β        = newvar()
      S3       = mgu(S2 τ1, τ2 -> β)
  in  (S3 ∘ S2 ∘ S1, S3 β)
```

- Infer function and argument types.
- Force `τ1` to be "a function from `τ2` to β".
- Unification (`mgu`) emits the equality constraints and solves them.

## Let-binding `let x = e1 in e2`

```text
W(Γ, let x = e1 in e2):
  let (S1, τ1) = W(Γ, e1)
      σ        = Gen(S1 Γ, τ1)
      (S2, τ2) = W(S1 Γ [x ↦ σ], e2)
  in  (S2 ∘ S1, τ2)
```

- Infer the binding’s type.
- Generalize to a scheme (binds the free type vars of `τ1`).
- Use that scheme when inferring the body.

This explicit threading of substitutions is what distinguishes W from Milner’s earlier "Algorithm J"; W is designed to be easier to reason about formally. ([Wikipedia][^1])

## Example: `let id = λx. x in (id 3, id True)`

This showcases:

- Type variables as unknowns,
- Generalization and binding,
- Re-instantiation,
- Unification.

### `let` structure

Expression:

```text
e = let id = λx. x in (id 3, id True)
```

We start from an environment where literals have known types:

```text
Γ0 = { 3 : Int, True : Bool }
```

We compute `W(Γ0, e)` via the `let` rule:

1. `(S1, τ1) = W(Γ0, λx. x)`
2. `σ = Gen(S1 Γ0, τ1)`
3. `(S2, τ2) = W(S1 Γ0 [id ↦ σ], (id 3, id True))`
4. Result: `(S2 ∘ S1, τ2)`

### `W(Γ0, λx. x)`

Abstraction case:

1. Fresh `α` for `x`.

2. Extend `Γ0` to `Γ1 = Γ0[x ↦ α]`.

3. Infer the body `x`:

   - `W(Γ1, x)`:

     - `Γ1(x) = α` (monotype; think scheme `∀. α`).
     - `inst(α) = α`.
     - So `(Id, α)`.

4. For the lambda:

   - `(S = Id, τ_body = α)`
   - Function type = `α -> α`

So:

```text
W(Γ0, λx. x) = (Id, α -> α)
```

Thus `S1 = Id`, `τ1 = α -> α`.

### generalize `id`

Generalize `τ1` against `S1 Γ0` (still `Γ0`):

- `free(τ1) = {α}`
- `free(Γ0) = ∅`
- So `Gen(Γ0, α -> α) = ∀α. α -> α`

Set:

```text
σ_id = ∀α. α -> α
Γ'   = Γ0[id ↦ σ_id]
```

This is exactly where `α` becomes **bound** in the type scheme.

### infer `(id 3, id True)`

We treat `(e1, e2)` as an expression whose type is `τ1 × τ2`:

1. Compute `W(Γ', id 3)` → `(S_left, τ_left)`
2. Compute `W(S_left Γ', id True)` → `(S_right, τ_right)`
3. Pair type is `S_right τ_left × τ_right`.

### `W(Γ', id 3)`

Application:

- First, `W(Γ', id)`:

  - `Γ'(id) = ∀α. α -> α`
  - Instantiate: `β -> β` with fresh `β`.
  - `(Id, β -> β)`

- Then, `W(Γ', 3)`:

  - Literal: `(Id, Int)`

- Application:

  - Fresh `γ` for result.
  - Unify `β -> β` with `Int -> γ`:

    - Domain: `β ~ Int`
    - Codomain: `β ~ γ`
  - So substitution `S3 = { β ↦ Int, γ ↦ Int }`.

The type of `id 3` is `Int`, with substitution `S_left = S3`.

### `W(S_left Γ', id True)`

The generalized scheme for `id` is *still* `∀α. α -> α` (schemes aren’t rewritten by substitutions; they’re re-instantiated).

- `W(S_left Γ', id)`:

  - Instantiation again, but with fresh `δ`: `δ -> δ`.

- `W(S_left Γ', True)`:

  - Literal: `(Id, Bool)`.

- Application:

  - Fresh `ε` for result.
  - Unify `δ -> δ` with `Bool -> ε`:

    - `δ ~ Bool`
    - `δ ~ ε`
  - Substitution `S' = { δ ↦ Bool, ε ↦ Bool } = S_right`.

So `id True` has type `Bool`.

### Pair type

Combine substitutions (`S_pair = S_right ∘ S_left`) and types:

- Left: `Int`
- Right: `Bool`

So the whole expression has type:

```text
(Int, Bool)
```

That’s the **principal type** inferred by Algorithm W.

## Where Algorithm W says "no": λx. x x

As a quick sanity check: `λx. x x` should **not** be typable in HM.

Sketch:

1. Give `x` type `α`.
2. In body `x x`:

   - `x` as function ⇒ type `α`.
   - `x` as argument ⇒ type `α`.
   - Application asks to unify `α` with `α -> β` (for some β).
3. This triggers an **occurs check**: `α` appears inside `α -> β`. Unifying would yield an infinite type `α = α -> β`, which HM forbids.

So Algorithm W rejects `λx. x x` with a type error during unification.

[^1]: <https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system> "Hindley–Milner type system"
