---
title: Trees
---

*"All roads lead to trees."*
Examples: DOM, Filesystem (hard drive)

## Terminology

- root: topmost parent node
- height: longest path from root the youngest (bottommost) child node
- binary tree: a tree with at most 2 children
- general tree: a tree with more than 0 children
- balanced tree: a tree is perfectly balanced when any node's left and right children have the same height
- branching factor: amount of children a tree has

## Traversal

- Review recursion!
- Visit a node and then recurse is pre-order traversal.
- In languages where you have to clean up memory, you do a post-order traversal.
- preorder root's at beginning, in order root's at the middle, post-order root's at the end.
- All traversals are `O(n)` because for all traversals you visit every node.
- We're implicitly using a stack when we do depth first search. Makes sense because we're leveraging the call stack.

## References

- [ThePrimeagen](https://theprimeagen.github.io/fem-algos/lessons/trees/trees)
