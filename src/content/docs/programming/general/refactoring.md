---
title: Refactoring
description: aphorisms on refactoring
---

## Write Everything Twice (WET)

Let an idea live in two places before you collapse it into an abstraction. Writing the logic twice forces you to confront how the use cases diverge and whether the duplication is even problematic.
If the second copy already feels strained, that is a signal your abstraction will calcify too quickly. If both copies stay simple, duplicate until the duplication hurts—future refactors will have better constraints to work with.

## Don't Repeat Yourself (DRY)

When duplication starts hiding bugs or blocking change, extract the shared concern. DRY works best after you have examples that prove the similarity; otherwise you risk building a brittle generic that no real caller needs.
Prefer removing duplication in behavior rather than in code tokens—two snippets can look different yet be logically identical, and that is what matters.

## Keep It Simple, Stupid (KISS)

Favor refactorings that reduce moving parts and cognitive overhead. Simplicity is not a synonym for minimal lines of code[^1]; it means the next reader can predict the flow without consulting a mental decoder ring.
Watch for unnecessary indirection, speculative hooks, or clever metaprogramming that hides intent. Each refactor should trade a complex shape for a plainer one with fewer surprising edge cases.

## Rule of Three

The first implementation proves the concept, the second confirms the pattern, and the third justifies building a proper abstraction.
Use the first two copies as experiments that teach you what really varies. On the third, refactor aggressively: extract the shared seams, write tests around the emergent contract, and delete the original duplicates. Until then, optimize for speed of iteration rather than tidiness.

## AHA (Avoid Hasty Abstractions)

You shouldn't be dogmatic about when you start writing abstractions but instead write the abstraction when it feels right and don't be afraid to duplicate code until you get there[^2].

## References

[^1]: Carlo, Nicolas. “Don’t Make Clean Code Harder to Maintain, Use the Rule of Three - Change Messy Software Without Breaking It.” Understand Legacy Code, <https://understandlegacycode.com//blog/refactoring-rule-of-three>. Accessed 17 Nov. 2025.

[^2]: Dodds, Kent C. "AHA Programming 💡". Kent C. Dods, <https://kentcdodds.com/blog/aha-programming>. Accessed 17 Nov. 2025.
