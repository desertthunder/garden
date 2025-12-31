---
title: DAG-CBOR
---

DAG-CBOR is the canonical data serialization format for the AT Protocol.
It is a strict subset of CBOR (RFC 8949) with specific rules for determinism and linking.

## Canonicalization Rules

To ensure consistent Content IDs (CIDs) for the same data, specific canonicalization rules must be followed during encoding.

### Map Key Sorting

Maps must be sorted by keys. The sorting order is **NOT** standard lexicographical order.

1. **Length**: Shorter keys come first.
2. **Bytes**: keys of the same length are sorted lexicographically by their UTF-8 byte representation.

**Example:**

- `"a"` (len 1) comes before `"aa"` (len 2).
- `"b"` (len 1) comes before `"aa"` (len 2).
- `"a"` comes before `"b"`.

### Integer Encoding

Integers must be encoded using the smallest possible representation.

`System.Formats.Cbor` (in Strict mode) generally handles this, but care must be taken to treat `int`, `int64`, and `uint64` consistently.

## Content Addressing (CIDs)

Links to other nodes (CIDs) are encoded using **CBOR Tag 42**.

### Format

1. **Tag**: `42` (Major type 6, value 42).
2. **Payload**: A byte string containing:
    - The `0x00` byte (Multibase identity prefix, required by IPLD specs for binary CID inclusion).
    - The raw bytes of the CID.

## Known Gotchas

- **Float vs Int**:
  AT Protocol generally discourages floats where integers suffice.
- **String Encoding**:
  Must be UTF-8. Indefinite length strings are prohibited in DAG-CBOR.
