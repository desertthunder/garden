---
title: Constellation
---

Constellation is a Microcosm service that indexes backlinks across AT Protocol records.
It walks records from the firehose, extracts links, and lets clients query which records
point at a DID, AT-URI, or web URL.

This is useful for relationships that are public record links but are not always exposed
by an AppView in the shape an app wants.

- A block record links to the blocked DID.
- A follow record links to the followed DID.
- A list item links to both the member DID and the list URI.

## Link Sources

Constellation queries usually have two important inputs:

- `subject`: the DID, AT-URI, or URL being linked to.
- `source`: the record collection plus the field path that contains the link.

The `source` format is:

```text
<collection>:<path>
```

Examples:

| Relationship               | Subject              | Source                            |
| -------------------------- | -------------------- | --------------------------------- |
| Accounts that block a DID  | blocked account DID  | `app.bsky.graph.block:subject`    |
| Accounts that follow a DID | followed account DID | `app.bsky.graph.follow:subject`   |
| Lists containing a DID     | member DID           | `app.bsky.graph.listitem:subject` |

Older `/links/*` endpoints split this into `collection` and `path`. The XRPC endpoints
use the combined `source` value.

## XRPC Endpoints

The current API is under `/xrpc/blue.microcosm.links.*`.

```text
GET /xrpc/blue.microcosm.links.getBacklinksCount
```

Returns a `total` count for records whose `source` points at `subject`.

```text
GET /xrpc/blue.microcosm.links.getBacklinkDids
```

Returns distinct DIDs that created matching records. This is the endpoint to use when
the client only needs identities, not individual link records.

```text
GET /xrpc/blue.microcosm.links.getBacklinks
```

Returns matching link records. Each record identifies the DID, collection, and rkey of
the source record. A client still has to hydrate anything it wants to display.

```text
GET /xrpc/blue.microcosm.links.getManyToMany
```

Returns records that link to both the primary `subject` and another subject.
The `pathToOther` query parameter names the second link field.

For `app.bsky.graph.listitem`, the primary subject can be the member DID and
`pathToOther=list` returns the list URI.

## Use Cases

Constellation is useful when a client needs relationship data that follows from public records:

- Counting records that point at a DID or AT-URI.
- Finding distinct accounts that created matching records.
- Hydrating backlink records through an AppView or PDS after Constellation identifies
their source DID, collection, and rkey.
- Finding join records, such as list memberships, where one record points at both an
account and another resource.

## Implementation Notes

Use XRPC endpoints for new code. The public docs still show deprecated `/links/*`
routes, but new callers should prefer `/xrpc/blue.microcosm.links.*`.

Send an `Accept: application/json` header. The public docs mention it, and it protects
callers if the service changes browser defaults.

Use a descriptive `User-Agent`. The public instance asks callers to include a project
name and contact when possible.

Counts are indexer counts, not AppView counts. They can differ from Bluesky AppView
state because they depend on firehose ingestion, deletes, account state, and whatever
backfill the instance has completed.

`getBacklinks` returns source records, not fully hydrated users or lists. A client
should hydrate returned records through an AppView or PDS and handle suspended, missing,
or blocked resources.

## Example

```bash
curl -s \
  -H 'Accept: application/json' \
  -H 'User-Agent: example-client contact@example.com' \
  'https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinksCount?subject=did%3Aplc%3Aexample&source=app.bsky.graph.block%3Asubject'
```

## References

- [Microcosm](https://microcosm.blue/)
- [Constellation API docs](https://constellation.microcosm.blue/)
- [Microcosm source](https://tangled.org/microcosm.blue/microcosm-rs)
