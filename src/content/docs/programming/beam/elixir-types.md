---
title: Typing in Elixir
---

Elixir is dynamically typed, but not “untyped.” Values have types at runtime,
and the language gives you several ways to document, constrain, dispatch on,
and check those types.

> Runtime values are typed. Variables are not statically typed. Function
> contracts are usually expressed through pattern matching, guards, structs,
> typespecs, behaviours, and protocols.

Elixir’s official site describes it as a "dynamic, functional language" running
on the Erlang VM (the BEAM).

## Built-in Types

Elixir has several built-in types that you can use to define the type of a value.

```elixir
:ok                   # atom
42                    # integer
3.14                  # float
"hello"               # binary / string
'hello'               # charlist
[1, 2, 3]             # list
{1, 2}                # tuple
%{name: "Owais"}      # map
fn x -> x + 1 end     # function
pid                   # process id
```

### Structs

A struct is a map with a named shape. Under the hood, they have a `__struct__`
field that stores the struct’s name.

## Pattern Matching

You model data with tagged tuples, maps, and structs, then branch by shape,
as Elixir uses shape-based pattern matching.

## Guards

Guards are expressions that are evaluated at runtime to determine if a pattern
matches. They can be used in pattern matching to constrain the values that can be
matched.

Common helpers:

```elixir
is_atom/1
is_binary/1
is_boolean/1
is_float/1
is_function/1
is_integer/1
is_list/1
is_map/1
is_number/1
is_tuple/1
```

## Typespecs

Typespecs are annotations[^typespec] used to specify the type of a function's arguments and return value.
They're not enforced by the compiler, but for documentation and static analysis tools like Dialyzer.

## Behaviour & Protocols

Behaviours are interface-like contracts. They define callback contracts that modules can implement.

Protocols provide type-based polymorphism, by defining behaviors that can vary by data type.

## Gradual Set-Theoretic Types

This is a part of an ongoing effort[^tc] to introduce type-checking to the Elixir compiler.

1. Gradual typing - You can keep writing normal dynamic Elixir. The type system is
   introduced incrementally and does not require rewriting the ecosystem.
2. Set-theoretic typing - A type is treated as a set of possible values. Type operations
   work like set operations: union, intersection, and difference/negation.

[^typespec]: Typespecs Reference — Elixir v1.19.0-Rc.0. https://elixir.hexdocs.pm/1.19.0-rc.0/typespecs.html. Accessed 31 May 2026.

[^tc]: Gradual Set-Theoretic Types — Elixir v1.19.5. https://elixir.hexdocs.pm/gradual-set-theoretic-types.html. Accessed 31 May 2026.
