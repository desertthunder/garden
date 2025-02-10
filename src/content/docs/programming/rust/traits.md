---
title: Traits
---

- Trait
    - A trait defines the functionality a particular type has and can share with
    other types[^1]
    - Limitations
        - You can’t implement external traits on external types.
        - A trait can be implemented on a type only if either the trait or the type, or both, are local to our crate
- Traits in Rust are interfaces (shared behavior). However, unlike in other
languages (like Golang) default implementations can be defined.
    - Can use generic type parameters to reduce duplication (DRY) but also enforce behavior.
- Traits can be conditionally implemented for any type that implements another trait.
- Blanket Implementations
    - Implementations of a trait on any type that satisfies the trait bounds
    - Used extensively in the Rust standard library
    - Done by using a trait bound with an impl block that uses generics

> The ability to specify a return type only by the trait it implements is
> especially useful in the context of closures and iterators.

- Downsides of too many trait bounds
    - Each generic has its own trait bounds, so functions with multiple generic
    type parameters can contain lots of trait bound information between the
    function’s name and its parameter list.
        - Can be remedied with a `where` clause
    - We can also specify more than one trait bound.
- The impl Trait syntax is actually syntactic sugar for a trait bound.
- Instead of a concrete type for the item parameter, we specify the impl keyword
and the trait name

[^1]: Klabnik, Steve. The Rust Programming Language. No Starch Press, Inc, 2018.
