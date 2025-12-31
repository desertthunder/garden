---
title: AT Protocol
---

The **Authenticated Transfer Protocol (AT Protocol)** is an open, decentralized protocol for social networking.
It is the foundation of **Bluesky** and designed to give users ownership of their data and identity.

## Core Principles

1. **Account Portability**: Users can move their data between service providers without losing their identity, followers, or content.
2. **Algorithmic Choice**: Users can choose custom feeds and algorithms, not locked to one provider's choices.
3. **Interoperability**: Open standards enable a federated ecosystem where services can communicate.
4. **Performance at Scale**: Designed to handle billions of users with a hybrid federated/indexed architecture.

## Architecture

The AT Protocol uses a layered architecture:

```text
┌─────────────────────────────────────────────────┐
│                   App Views                     │  (Bluesky, custom apps)
├─────────────────────────────────────────────────┤
│                   Lexicons                      │  (Schema definitions)
├─────────────────────────────────────────────────┤
│          Personal Data Repositories             │  (User data storage)
├─────────────────────────────────────────────────┤
│          Identity Layer (DIDs + Handles)        │  (Decentralized identity)
└─────────────────────────────────────────────────┘
```

### Identity

- **DIDs (Decentralized Identifiers)**: Persistent identifiers (e.g., `did:plc:abc123`) that remain stable across server migrations.
- **Handles**: Human-readable names (e.g., `@alice.bsky.social`) that resolve to DIDs via DNS or HTTP.

### Personal Data Servers (PDS)

Every user's data lives in a **Personal Data Server**.

A PDS:

- Stores the user's repository (a signed, Merkle-tree-based data structure).
- Handles authentication and authorization.
- Syncs data to relays and indexers.

### Relay (BGS)

Relays aggregate data from many PDSs into a unified firehose, enabling:

- Efficient indexing for search and discovery.
- Feed generators to access content across the network.

### App View

An **App View** consumes the firehose and provides application-specific APIs. For example, the Bluesky app view provides the social networking experience.

## Data Model

### Repositories

A **repository** is a user's complete data store, structured as a [Merkle Search Tree (MST)](/garden/engineering/atproto/mst).

- **Records**: Individual data items (posts, likes, follows) stored as [DAG-CBOR](/garden/engineering/atproto/cbor).
- **Collections**: Namespaced groups of records (e.g., `app.bsky.feed.post`).
- **Commits**: Signed snapshots of the repository state.

### Lexicons

**Lexicons** are JSON schemas that define:

- Record types and their fields.
- XRPC methods (HTTP-like RPC calls).
- Subscriptions for real-time data.

Example Lexicon ID: `app.bsky.feed.post`

### AT-URIs

Records are addressed using **AT-URIs**:

```sh
at://did:plc:abc123/app.bsky.feed.post/3jqw2f7
```

Format: `at://<authority>/<collection>/<rkey>`

## Key Technologies

| Component                                    | Purpose                                         |
| -------------------------------------------- | ----------------------------------------------- |
| [DAG-CBOR](/garden/engineering/atproto/cbor) | Canonical binary serialization format           |
| [MST](/garden/engineering/atproto/mst)       | Content-addressed, verifiable key-value storage |
| [CAR](/garden/engineering/atproto/car)       | Archive format for repository export/sync       |
| CIDs                                         | Content identifiers linking to any data block   |
| XRPC                                         | HTTP-based RPC protocol for API calls           |

## Sync & Federation

### Repo Sync

Repositories are synchronized using:

1. **`com.atproto.sync.getRepo`**: Full repository export as a [CAR file](/garden/engineering/atproto/car).
2. **`com.atproto.sync.subscribeRepos`**: Real-time firehose of commits across the network.

### Event Stream

The firehose emits events:

- **Commit**: New or updated records.
- **Handle**: Handle changes.
- **Identity**: DID document updates.
- **Tombstone**: Account deletions.

## References

- Official protocol specifications covering identity, data, and networking layers.
  [AT Protocol Specification](https://atproto.com/specs)
- Developer documentation for building on Bluesky/AT Protocol.
  [Bluesky Documentation](https://docs.bsky.app)
- Reference implementation in TypeScript.
  [Protocol GitHub Repository](https://github.com/bluesky-social/atproto)
