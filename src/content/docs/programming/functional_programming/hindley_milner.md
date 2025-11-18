---
title: Hindley-Milner
---

Hindley–Milner is a type system for the λ-calculus with **parametric polymorphism**. It has two key properties:

1. It can infer types **without annotations**.
2. It computes a **principal type**: the most general type from which all other valid types follow by specialization. ([Wikipedia][^1])

## HM Types

We distinguish:

### Monotypes (τ)

Monotypes (simple types) are built from:

- **Type constants**: `Int`, `Bool`, `String`, …
- **Type variables**: `α`, `β`, `γ`, …
- **Type constructors**: function, lists, pairs, etc.

Typical grammar:

```text
τ ::= α
    | Int | Bool | ...
    | τ -> τ
    | List τ
    | τ × τ         -- pairs, etc.
```

### Polytypes / type schemes (σ)

Polytypes (type schemes) allow **universal quantification** over type variables:

```text
σ ::= τ
    | ∀α. σ      -- usually written ∀α₁…αₙ. τ
```

Example:

- `∀α. α -> α` is the type of the polymorphic identity function.
- `Int -> Int` is a monomorphic specialization of that scheme.

In the environment Γ, variables map to **schemes** (polytypes), not bare monotypes. ([Wikipedia][^1])

## Type Variables

### During inference: Unknowns

When you don’t yet know the type of something, you introduce a fresh type variable:

- For `λx. x`:
  - Give `x` a fresh type `α`.
  - The body `x` also has type `α`.
  - The function has type `α -> α`.

At this stage, `α` is an **inference variable**: a placeholder to be solved later.

### After Generalization: Parameters of a scheme

At a `let`, HM generalizes a monotype into a **scheme** by quantifying over its free type variables that aren’t pinned down by the environment:

```text
Gen(Γ, τ) = ∀α₁…αₙ. τ
  where {αᵢ} = free(τ) \ free(Γ)
```

Example:

```text
let id = λx. x in ...
```

- Infer `id : α -> α`.
- Generalization yields `id : ∀α. α -> α`.

Now `α` is a **bound** type variable in the scheme, exactly like a λ-bound term variable: it has scope within the body of the type.

When you **use** `id`, you:

- Instantiate `∀α. α -> α` to, say, `β -> β` with a fresh `β`.
- Later unification may force `β = Int`, `β = Bool`, etc.

So:

- Inference variables: "unknowns we’re solving for".
- Quantified variables: "parameters of a polymorphic function".

## Constraints and "Bounds" on Type Variables

### Bound v. Free

A type variable is **bound** if it appears under a `∀`:

- In `∀α. α -> α`, `α` is bound.
- In `∀α. α -> β`, `α` is bound, `β` is free.

Generalization at `let` takes free inference variables and turns them into **bound** quantified parameters.

This is purely syntactic, like "bound vs free variables" in λ-calculus.

### Semantic Bounds: restricted instantiations (constrained HM)

Basic HM only has **equality constraints** between types (unification). But real languages often add an extra layer: **constrained polymorphism**, which you can think of as "bounds on type variables".

Type schemes become:

```text
∀α₁…αₙ. C ⇒ τ
```

where `C` is a set of *constraints* on the type variables—e.g. `Eq α`, `Num α`. This is the HM(X) framework: HM plus a parametric constraint system X that’s solved alongside unification. ([Tufts Computer Science][^2])

Example (Haskell style):

```haskell
show :: Show a => a -> String
```

Read as:

```text
∀a. Show a ⇒ a -> String
```

Here `a` is:

- Bound by `∀a`.
- Semantically **bounded** by the predicate `Show a`: you can only instantiate `a` with types that satisfy the `Show` constraint.

So:

- **Plain HM**:

  - Constraints are *equations between types*: `τ₁ ~ τ₂`.
  - Bounds = "is this variable under a ∀?". Unification just figures out equalities.

- **Constrained HM / HM(X)**:

  - Constraints are *logical predicates* over types (`Eq α`, `Num α`, record rows, effects, etc.).
  - Bounds = "α must satisfy constraint C when instantiated".

For your own LSP/typechecker, this is where you decide if you want:

- A pure Damas–Milner ([EECS Berkeley][^3]) core (just unification constraints), or
- A constrained layer (e.g. traits/typeclasses/effects) integrated via HM(X)-style rules.

## Typing Rules

You can present HM via a judgment:

```text
Γ ⊢ e : τ
```

with Γ mapping variables to schemes. The important rules (up to `let`) are:

1. **Var**:
   If `x : σ ∈ Γ`, then

   - instantiate `σ` to monotype `τ`,
   - conclude `Γ ⊢ x : τ`.

2. **Abs (λ)**:
   For `λx. e`:

   - give `x` a fresh type `α`,
   - infer `Γ, x:α ⊢ e : τ`,
   - result type is `α -> τ`.

3. **App (application)**:
   For `e₁ e₂`:

   - infer `Γ ⊢ e₁ : τ₁`, `Γ ⊢ e₂ : τ₂`,
   - assert `τ₁` must be `τ₂ -> β` for fresh `β`,
   - unify `τ₁` with `τ₂ -> β`, giving substitution `S`,
   - result type is `S β`.

4. **Let**:
   For `let x = e₁ in e₂`:

   - infer `Γ ⊢ e₁ : τ₁`,
   - generalize `τ₁` to `σ = Gen(Γ, τ₁)`,
   - infer `Γ, x:σ ⊢ e₂ : τ₂`,
   - result type is `τ₂`.

## Algorithm W

See [Algorithm W](/garden/programming/functional_programming/algo-w)

## Further Reading

1. Bernstein, Max. “Damas-Hindley-Milner Inference Two Ways.” Max Bernstein, 15 Oct. 2024, <https://bernsteinbear.com/blog/type-inference/>.
2. Diehl, Stephen. "Hindley-Milner Inference" Write You a Haskell. <https://smunix.github.io/dev.stephendiehl.com/fun/006_hindley_milner.html>.
3. Tuhola, Henri. Hindley-Milner Type System/Algorithm W Study. <https://boxbase.org//entries/2018/mar/5/hindley-milner>.
4. Hazelden, Phil. A Reckless Introduction to Hindley-Milner Type Inference. <https://reasonableapproximation.net/2019/05/05/hindley-milner.html>.

[^1]: <https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system> "Hindley–Milner type system"
[^2]: <https://www.cs.tufts.edu/~nr/cs257/archive/martin-odersky/hmx.pdf> "Type Inference with Constrained Types"
[^3]: <https://people.eecs.berkeley.edu/~necula/Papers/DamasMilnerAlgoW.pdf> "Principal type-schemes for functional programs"
