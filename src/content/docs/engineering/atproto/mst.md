---
title: Merkle Search Tree (MST)
---

The Merkle Search Tree (MST) is a probabilistic, balanced search tree used by the AT Protocol to store repository records.

## Overview

MSTs combine properties of B-trees and Merkle trees to ensure:

1. **Determinism**: The tree structure is determined by the keys (and their hashes), not insertion order.
2. **Verifiability**: Every node is content-addressed (CID), allowing the entire state to be verified via a single root hash.
3. **Efficiency**: Efficient key-value lookups and delta-based sync (subtrees that haven't changed share the same CIDs).

## Core Concepts

### Layering (Probabilistic Balance)

MSTs do not use rotation for balancing. Instead, they assign every key a "layer" based on its hash.

- **Formula**:
  `Layer(key) = countLeadingZeros(SHA256(key)) / 2`.
- **Fanout**:
  The divisor `2` implies a fanout of roughly 4 (2 bits per layer increment).
- Keys with higher layers appear higher in the tree, splitting the range of keys below them.

### Data Structure (`MstNode`)

An MST node consists of:

- **Left Child (`l`)**: Use to traverse to keys lexicographically smaller than the first entry in this node.
- **Entries (`e`)**: A sorted list of entries. Each entry contains:
    - **Prefix Length (`p`)**: Length of the shared prefix with the *previous* key in the node (or the split key).
    - **Key Suffix (`k`)**: The remaining bytes of the key.
    - **Value (`v`)**: The CID of the record data.
    - **Tree (`t`)**: (Optional) CID of the subtree containing keys between this entry and the next.

**Serialization**: The node is serialized as a DAG-CBOR array: `[l, [e1, e2, ...]]`.

## Algorithms

### Insertion (`Put`)

Insertion relies on the "Layer" property:

1. Calculate `Layer(newKey)`.
2. Traverse the tree from the root.
3. **Split Condition**: If `Layer(newKey)` is **greater** than the layer of the current node, the new key belongs *above* this node.
    - The current node is **split** into two children (Left and Right) based on the `newKey`.
    - The `newKey` becomes a new node pointing to these two children.
4. **Recurse**: If `Layer(newKey)` is **less** than the current node, find the correct child subtree (based on key comparison) and recurse.
5. **Same Layer**: If `Layer(newKey)` equals the current node's layer:
    - Insert perfectly into the sorted entries list.
    - Any existing child pointer at that position must be split and redistributed if necessary (though spec usually implies layers are unique enough or handled by standard BST insert at that level).

### Deletion

1. Locate the key.
2. Remove the entry.
3. **Merge**:
   Since the key acted as a separator for two subtrees (its "Left" previous child and its "Tree" child), removing it requires merging these two adjacent subtrees into a single valid MST node to preserve the tree's density and structure.

### Determinism & Prefix Compression

- **Canonical Order**: Keys must always be sorted.
- **Prefix Compression**:
  Crucial for space saving.
  The prefix length `p` is calculated relative to the *immediately preceding key* in the node.
- **Issues**:
  Insertion order *should not* matter (commutativity).
  However, implementations must be careful with `Split` and `Merge` operations to ensure exactly the same node boundaries are created regardless of history.
