---
title: OAuth Identity and Discovery
---

Identity is the part of AT Protocol OAuth that differs most from familiar "Sign in with X" systems. A client is not only asking whether a login succeeded. It is asking whether a specific authorization server is allowed to speak for a specific AT Protocol account.

Use handles for input and display. Use DIDs for account state. Use issuer URLs for authorization-server identity.

## DID, Handle, PDS

Three identifiers appear in the flow:

| Identifier | Example                   | Stability                    | Use                                            |
| ---------- | ------------------------- | ---------------------------- | ---------------------------------------------- |
| DID        | `did:plc:...`             | Stable account identifier    | Store this as the account ID.                  |
| Handle     | `alice.example.com`       | Can change                   | Show it to humans and accept it as input.      |
| PDS URL    | `https://pds.example.com` | Can change through migration | Route API requests and discover authorization. |

A handle is not enough for authentication. The client must resolve it to a DID and verify the relationship in both directions: the handle resolves to the DID, and the DID document claims the handle.

## Discovery Path

When the user starts with a handle or DID, the client follows this path:

```text
handle or DID
   -> DID document
   -> PDS service endpoint
   -> protected-resource metadata
   -> authorization-server metadata
```

The PDS publishes protected-resource metadata at:

```text
https://pds.example.com/.well-known/oauth-protected-resource
```

That metadata names the authorization server for the PDS.[^rfc9728]

The authorization server publishes metadata at:

```text
https://auth.example.com/.well-known/oauth-authorization-server
```

This metadata names the `issuer`, authorization endpoint, token endpoint, PAR endpoint, supported scopes, supported PKCE methods, DPoP algorithms, and client metadata support.[^rfc8414]

## Starting With a Server

Sometimes the user supplies a hosting provider instead of a handle. This can happen when the user remembers the PDS or entryway but not the account handle, or when the handle is broken.

In that case, the client discovers the authorization server first and lets the user authenticate there. The token response later supplies `sub`, which is the account DID. The client must then resolve that DID and verify that its current PDS leads back to the same authorization-server issuer.

Until that check succeeds, the client has a login event but not an authenticated AT Protocol account.

## The `sub` Check

The token response includes `sub`. In AT Protocol OAuth, `sub` is the account DID.

If the flow began with a handle or DID, the client compares `sub` to the DID resolved at the beginning. If the values differ, the session is rejected.

If the flow began with a server, the client verifies the reverse relationship:

1. read the DID from `sub`;
2. resolve the DID document;
3. find the DID's current PDS;
4. fetch that PDS's protected-resource metadata;
5. confirm that it points to the authorization-server issuer used in the flow.

Without the `sub` and issuer checks, a malicious authorization server could claim to authenticate a DID it does not control. The browser redirect alone does not prove account identity.

## OAuth Authn and Authz

OAuth 2.0 is mostly about authorization: granting a client access to resources. OpenID Connect usually adds authentication for centralized identity-provider use cases.[^oidc-core]

AT Protocol cannot simply use ordinary OIDC as the whole answer because authority over an account is discovered through the DID document and PDS relationship. The OAuth flow has to be checked against AT Protocol identity resolution.

This is why `sub` is not just a convenient user ID. It is the value that ties OAuth back to the AT Protocol account model.

## Caching

Identity resolution affects security. Auth-flow caches should be short-lived; the AT Protocol OAuth specification recommends less than ten minutes.[^atproto-oauth]

Browser clients may need help resolving handles because DNS TXT lookups are not available through ordinary browser APIs. DNS-over-HTTPS or a small resolver backend can work, but the client still needs the same bidirectional handle verification.

## References

[^atproto-oauth]: Bluesky/AT Protocol. ["OAuth"](https://atproto.com/specs/oauth).

[^oidc-core]: OpenID Foundation. [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html).

[^rfc8414]: Jones, Michael, Nat Sakimura, and John Bradley. [RFC 8414: OAuth 2.0 Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414).

[^rfc9728]: Parecki, Aaron, et al. [RFC 9728: OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728).
