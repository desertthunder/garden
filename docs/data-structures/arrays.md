---
title: Arrays
---

# Arrays & Data Structure Basics

- MIT 6.006 Lecture: <https://www.youtube.com/watch?v=CHhwJjR0mZA>
- Take a look at lecture notes on the website for addl. information.

## Basics

- Interface (API, or Abstract Data Type) tells you what you want to do (specification)
  - What operations do, are supported, and their meaning
- In contrast a data structure tells you how (to store)
  - We're given algorithms to tell us how to support those operations
- In algorithms we care a lot about scalability for very large N.

## Sequences

- Static sequence interface: number of items does not change
(Build, Length, Get, Set, Iteration)

### Arrays

- Memory Allocation Model - you can allocate an array of size N, in O(N)
(it takes linear time)
- The amount of space you use to allocate the array is the amount of time it took.
- Access is constant time - we need to assume that W is at least log(N) to
address all N items in my input.
- W is the machine word size, which is 64 bits on most modern machines.
- We want to be able to insert or delete from the middle of the sequence.
i.e. Insert At or Delete At.
- Inserting or Deleting at the beginning requires you to re-index everything

### Linked Lists

- We store our items in Nodes, in order
- Each item has a Node, and a next field (pointer)
- We need to track the Head Node

### Dynamic Arrays

- aka Python's lists
- Relax the constraint that the size of the array we use equals *N*
- "Roughly" means throw away constant factors when making approximations
- Add to end unless length equals size, we're out of space.
- In a static array, we have to allocate a new array of size N + 1 when
adding one element.
- In contrast, a dynamic array we allocate a new array of the original size plus
some constant. It's approximately the same as a static array because we don't use
constants in approximations.
- Constant **amoritization** analysis averages the running times of operations
in a sequence over that sequence

## Recap

- What's an interface? How does a data structure relate?
- What is the interface for a static sequence?
- What is the Memory Allocation Model?
- Dynamic v. Static array allocation
- What is amoritization?
