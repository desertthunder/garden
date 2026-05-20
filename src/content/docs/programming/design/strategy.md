---
title: Strategy Pattern
---

- Behavioral design patterns deal with communication and responsibility between
  objects.
- A strategy[^1] is an object that wraps one variant of an algorithm so it can
  be swapped with another at runtime.
    - Example: Sorting by price, rating, or distance
    - Extracts conditional logic into separate classes with a shared interface
- The context stores a reference to a strategy object.
- Concrete strategies implement different versions of the same algorithm.
- The client chooses which strategy the context should use.
- When to use?
    1. A class has a large conditional that switches between variants of the
       same behavior.
    2. Several similar classes only differ in how they perform one operation.
    3. An algorithm needs to be selected or replaced at runtime.
- Implementation
    1. Identify the behavior that changes often.
    2. Create a strategy interface for that behavior.
    3. Move each algorithm variant into its own concrete strategy.
    4. Give the context a reference to the strategy and delegate the behavior to it.
- Follows Single Responsibility Principle and Open/Closed Principle.
- *However*, it adds extra classes and indirection. If there are only one or two
stable variants, a simple conditional may be easier to understand.

[^1]: *Strategy*. <https://refactoring.guru/design-patterns/strategy>. Accessed 20 May 2026.
