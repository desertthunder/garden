---
title: Selection Sort
---

## Memory, Arrays & Linked Lists, Selection Sort

- Arrays contain elements stored contiguously in memory.
Easier to read because you can calculate the address of elements (indexing!)
    - You can access the elements of an array in any order (random access)
    - In contrast, elements in a linked list can be anywhere. Inserts are easier.
    - "Insertions can fail sometimes when there’s no space left in memory.
    But you can always delete an element." (P. 30)
- In selection sort[^1], you have to go through each element in a list and compare
it to the last element in the new list. This is $O(n^2)$.

[^1]: Bhargava, Aditya Y. Grokking Algorithms. Manning Publications, 2016.
