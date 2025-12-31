---
title: CAR Format
---

The **Content Addressable aRchives (CAR)** format is used to store content-addressable objects (IPLD blocks)[^1] as a sequence of bytes.
It is the standard format for repository export (`sync.getRepo`) and block transfer (`sync.getBlocks`) in the AT Protocol.

## Format Overview (v1)

A CAR file consists of a **Header** followed by a sequence of **Data** sections.

```text
|--------- Header --------| |--------------- Data Section 1 ---------------| |--------------- Data Section 2 ---------------| ...
[ varint | DAG-CBOR block ] [ varint | CID bytes | Block Data bytes ] [ varint | CID bytes | Block Data bytes ] ...
```

### LEB128 Varints

All length prefixes in CAR are encoded as **unsigned LEB128 (UVarint)** integers.

- Used to prefix the Header block.
- Used to prefix each Data section.

## Header

The header is a single DAG-CBOR encoded block describing the archive.

**Encoding:**

1. Construct the CBOR map: `{ "version": 1, "roots": [<cid>, ...] }`.
2. Encode as DAG-CBOR bytes.
3. Prefix with the length of those bytes (as UVarint).

## Data Sections

Following the header, the file contains a concatenated sequence of data sections. Each section represents one IPLD block.

```text
[ Section Length (UVarint) ] [ CID (raw bytes) ] [ Binary Data ]
```

- **Section Length**: The total length of the *CID bytes* + *Binary Data*.
- **CID**: The raw binary representation of the block's CID (usually CIDv1 + DAG-CBOR + SHA2-256).
- **Binary Data**: The actual content of the block.

The Section Length *includes* the length of the CID.

This is slightly different from some other framing formats where length might only cover the payload.

[^1]: [IPLD CARv1 Specification](https://ipld.io/specs/transport/car/carv1/)
