---
title: OAuth Clients and Metadata
---

AT Protocol replaces central app registration with published client metadata. A client identifies itself with a `client_id`, and that `client_id` is a URL.

```text
https://app.example.com/oauth-client-metadata.json
```

The authorization server fetches this document during the authorization flow. This is what lets a new client work across many PDS and entryway implementations without first registering in each provider's dashboard.[^client-id-metadata]

## What Metadata Is For

Client metadata answers operational questions:

- Which redirect URIs may this client use?
- Which scopes might it request?
- Is it a web or native client?
- Does it use DPoP-bound access tokens?
- If it is confidential, which public keys verify its client assertions?

The metadata endpoint must return HTTP 200 and JSON. The `client_id` field in the JSON must exactly match the URL used to fetch the document.

A minimal mental model:

| Metadata field             | What the server learns                                             |
| -------------------------- | ------------------------------------------------------------------ |
| `redirect_uris`            | Where the user can be sent after approval.                         |
| `scope`                    | The maximum set of scopes this client may request.                 |
| `grant_types`              | Whether the client can use authorization codes and refresh tokens. |
| `application_type`         | Whether web or native-client redirect rules apply.                 |
| `dpop_bound_access_tokens` | Whether issued access tokens must be DPoP-bound.                   |
| `jwks` or `jwks_uri`       | Which keys identify a confidential client.                         |

A metadata file can claim a nice app name and display a logo. That does not prove the app is the one a user thinks it is. Authorization servers should show friendly branding only for trusted `client_id` values. Unknown clients should be shown by their full `client_id` URL.

## Public Clients

A public client cannot keep a client-wide secret. Browser apps, mobile apps, and desktop apps normally fit this category.

This is not a defect. It is a constraint the protocol has to respect. A secret compiled into an app or stored in browser JavaScript is not secret. AT Protocol instead relies on redirect URI checks, PKCE, DPoP, `state`, issuer checks, and DID verification.

The important lesson is that public clients can participate safely, but only if the server and client avoid pretending that a shared secret exists.

## Confidential Clients

A confidential client can protect a private key, usually because it has a backend service. It authenticates to the authorization server with `private_key_jwt`, using the JWT bearer profile for OAuth client authentication.[^rfc7523]

The client publishes public keys in `jwks` or `jwks_uri`. The authorization server can bind sessions to the key used at authorization time. If the key later disappears from the advertised key set, the server can reject refresh attempts tied to that key.

That key lifecycle is the main advantage of confidential clients. A leaked key can be removed, and sessions tied to it can be cut off.

## Two Different Keys

DPoP and confidential-client authentication are easy to confuse.

| Key                     | Scope                      | Purpose                                                               |
| ----------------------- | -------------------------- | --------------------------------------------------------------------- |
| Confidential-client key | Client software or backend | Proves the request came from the registered confidential client.      |
| DPoP key                | One session or device      | Proves the token is being used by the same instance that received it. |

A public browser client has no confidential-client key, but still has a DPoP key. A backend-for-frontend design may use both.

## Redirect URIs

Web clients use HTTPS redirect URIs listed in metadata.

Native clients may use custom URI schemes. The scheme has to correspond to the `client_id` hostname in reverse-domain order:

```text
client_id:    https://app.example.com/oauth-client-metadata.json
redirect_uri: com.example.app:/callback
```

Native clients may also use HTTPS callbacks such as universal links when the origin matches the `client_id` origin.

## Localhost Development

Development clients can use a special `client_id` origin:

```text
http://localhost
```

The hostname must be exactly `localhost`, with no port. Loopback redirect URIs such as `http://127.0.0.1/` and `http://[::1]/` are allowed, with relaxed port matching.

This is a development exception for public clients. It is not the production model.

## References

[^client-id-metadata]: Parecki, Aaron. ["OAuth Client ID Metadata Document"](https://datatracker.ietf.org/doc/draft-parecki-oauth-client-id-metadata-document/).

[^rfc7523]: Campbell, Brian, Chuck Mortimore, and Michael Jones. [RFC 7523: JSON Web Token Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/html/rfc7523).
