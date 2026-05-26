---
title: OAuth Authorization Flow
---

The AT Protocol OAuth flow is the Authorization Code flow with additional discovery and proof steps. The client has to learn which server is authoritative, protect the code exchange, and verify that the result names the intended DID.

## Shape of the Flow

```text
handle or DID
  -> resolve DID and current PDS
  -> discover authorization server
  -> send pushed authorization request
  -> redirect user for login and approval
  -> receive authorization code
  -> exchange code for tokens
  -> verify sub DID and granted scopes
  -> call PDS with access token and DPoP proof
```

This is easier to understand as three phases: discovery, approval, and token use.

## 1. Discovery

The user begins with a handle, DID, PDS hostname, or entryway hostname.

When the user supplies a handle or DID, the client resolves the account to a DID document and finds the current PDS. It then fetches the PDS protected-resource metadata and the authorization-server metadata.

The authorization-server metadata gives the client the endpoints and capabilities needed for the rest of the flow: issuer, authorization endpoint, token endpoint, PAR endpoint, supported scopes, PKCE methods, and DPoP algorithms.

## 2. Local State

Before contacting the authorization server, the client prepares local state:

| Value | Purpose |
| --- | --- |
| `state` | Binds the eventual redirect to this local flow. |
| `code_verifier` | Secret used later to redeem the authorization code. |
| `code_challenge` | Public PKCE value derived from the verifier. |
| DPoP key | Binds future tokens to this client instance. |
| requested scopes | Includes `atproto` and any requested permissions. |
| `login_hint` | Usually the handle or DID the user entered. |

The client should store this state locally and put only an unguessable reference in `state`. It should not pack session data into the `state` parameter.

## 3. Pushed Authorization Request

With PAR, the client sends the authorization request parameters directly to the authorization server before the browser redirect.[^rfc9126]

The server validates the request, fetches the client's metadata from its `client_id`, binds the DPoP key, and returns a `request_uri`.

The browser redirect then carries `client_id` and `request_uri`, not the full authorization request. PAR reduces leakage through browser history, logs, referrers, and URL length limits. It also lets the authorization server reject bad requests before showing a user interface.

## 4. User Login and Approval

The client redirects the user to the authorization endpoint. The authorization server uses `request_uri` to recover the request details, authenticates the user, and shows the requested scopes.

OAuth does not dictate the server's login method. A PDS or entryway might use passwords, passkeys, two-factor authentication, email recovery, or an upstream identity provider.

If `login_hint` was supplied, the server should keep the user on that account. If the server authenticates a different account, the client should reject the result when it checks `sub`.

## 5. Code Return

After approval, the authorization server redirects back to the client's redirect URI with:

- an authorization code;
- the original `state`;
- issuer information.[^rfc9207]

The client rejects the response if `state` is missing, unknown, reused, or tied to a different issuer.

## 6. Token Exchange

The client sends the code to the token endpoint with the original PKCE `code_verifier`. The request also uses DPoP. Confidential clients include a signed client assertion.

The response includes an access token, usually a refresh token, the granted scopes, and `sub`, the account DID.

The client accepts the session only if:

- the granted scopes include `atproto`;
- `sub` matches the expected DID, or resolves back to the issuer when the flow started with a server;
- the issuer matches the authorization server bound earlier.

Authentication-only clients can stop after these checks. Clients that need API access use the access token and a DPoP proof when calling the PDS.

## PKCE

PKCE protects the authorization code.[^rfc7636]
The client sends a `code_challenge` before user approval and later proves possession of the original `code_verifier` during token exchange.

A stolen authorization code is not enough without the verifier. AT Protocol requires PKCE for all clients, including confidential clients. `S256` is required; `plain` is not allowed.

## References

[^rfc7636]: Sakimura, Nat, John Bradley, and Naveen Agarwal. [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636).
[^rfc9126]: Lodderstedt, Torsten, et al. [RFC 9126: OAuth 2.0 Pushed Authorization Requests](https://datatracker.ietf.org/doc/html/rfc9126).
[^rfc9207]: Lodderstedt, Torsten, et al. [RFC 9207: OAuth 2.0 Authorization Server Issuer Identification](https://datatracker.ietf.org/doc/html/rfc9207).
