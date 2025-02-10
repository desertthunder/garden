---
title: Ownership
---

- Memory is managed in Rust through a system of ownership with a set of rules that the compiler checks[^1].
- Stack
    - The stack stores values in the order it gets them and removes the values in
    the opposite order
    - All data stored on the stack must have a known, fixed size.
- Pushing to the stack is faster than allocating on the heap because the
allocator never has to search for a place to store new data; that location is
always at the top of the stack.
- Heap
    - The memory allocator finds an empty spot in the heap that is big enough, marks it as being in use, and returns a pointer
    - See [slices](#slices)

## Owners

- In most languages without a GC, we must identify when memory is no longer being
used and to call code to explicitly free it
- Each value in Rust has an owner.
    - There can only be one owner at a time. When the owner goes out of scope, the value will be dropped.
- Memory is automatically returned once the variable that owns it goes out of scope
- RAII (Resource Acquisition Is Initialization)
    - In C++, this pattern of deallocating resources at the end of an item’s lifetime

## Copying

- In terms shallow and deep copying while working with, the concept of copying the pointer, length, and capacity without copying the data probably sounds like making a shallow copy
- Rust will never automatically create “deep” copies of your data.
    - Any automatic copying can be assumed to be inexpensive in terms of runtime
    performance.

## References

- A reference is like a pointer[^1] in that it’s an address we can follow to access
the data stored at that address; that data is owned by some other variable.
Unlike a pointer, a reference is guaranteed to point to a valid value of a
particular type for the life of that reference.
- The opposite of referencing by using & is dereferencing, which is
accomplished with the dereference operator, *
- When functions have references as parameters instead of the actual values,
the values don't need to be returned in order to give back ownership, because the
inner scope never had ownership.
- We call the action of creating a reference borrowing.
- Just as variables are immutable by default, so are references.
- If you have a mutable reference to a value, you can have no other references to that value.
- A data race happens when these three behaviors occur:
    - Two or more pointers access the same data at the same time.
    - At least one of the pointers is being used to write to the data.
    - There’s no mechanism being used to synchronize access to the data."
- We also cannot have a mutable reference while we have an immutable one
to the same value.
- Dangling References
    - The compiler guarantees that references will never be dangling
    - If you have a reference to some data, the compiler will ensure that the data will not go out of scope before the reference to the data does

## Slices

- A slice is a kind of reference, so it does not have ownership.
- With the `String` type, in order to support a mutable, growable piece of text,
we need to allocate an amount of memory on the heap, unknown at compile time, to
hold the contents.
- String slice range indices must occur at valid UTF-8 character boundaries.
    - If you attempt to create a string slice in the middle of a multibyte character, your program will exit with an error.

[^1]: Klabnik, Steve. The Rust Programming Language. No Starch Press, Inc, 2018.
