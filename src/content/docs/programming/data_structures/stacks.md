---
title: More on Stacks
---

## What is a stack?

- A one-ended linear data structure that models a real stack.[^1]
- Two operations, push (to top), pop (off the top)
    - We can only act on top of the stack
- Last In, First Out (LIFO)

## Example Problems

- Brackets (validate that brackets are closed).
    - ex. `[[{}]()]`
        - **Steps**:
            - Push `[`: `[`
            - Push `[`: `[[`
            - Push `{`: `[[{`
            - Pop `{` (we hit `}`): `[[`
            - Pop `[`: `[`
            - Push `(`: `[(`
            - Pop `(`: `[`
            - Pop `[`: `...`
            - Since the stack is now empty, the bracket sequence is valid
- Tower of Hanoi Game
    - Three pegs are stacks.
    - No disk can be placed on smaller disk
    - Move disks from one end to the other

## Stack Implementation

- Usually implemented with linked lists or arrays.

### Singly Linked List

- Start with null node.
- Create new heads with pointer to newest node (push)
- Move head pointer to next node, and dereference old head (pop)

### Source Code

- `java.util` has a LinkedList
- implements the iterable interface (has a generic)

### Questions

- What is a concurrent modification error?

[^1]: WilliamFiset. Queue Implementation. 2017. YouTube,
<https://www.youtube.com/watch?v=EoisnPvUkOA>.
