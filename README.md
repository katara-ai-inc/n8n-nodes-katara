# n8n-nodes-katara

This is an n8n community node for Katara. It currently provides a single programmatic node that uploads documents to Katara's Buf Connect API with OAuth2.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- Document
  - Upload

## Credentials

Use the **Katara OAuth2 API** credential.

Dynamic client registration is enabled by default, so users only need to register and approve the client during the OAuth flow instead of creating client credentials manually.

When **Use Dynamic Client Registration** is enabled, the credential requires:

1. **Base URL**: The public base URL of the Katara API.
2. **Server URL**: The authorization server base URL used for OAuth discovery and dynamic client registration. This field is provided by n8n's base OAuth2 credential when dynamic client registration is enabled. For Auth0, use your tenant or custom domain URL, such as `https://katara-dev.us.auth0.com`.
3. **Audience**: The Katara API audience configured in Auth0.
4. **Scope**: Optional. Supply scopes required by your Auth0 application, such as `openid profile email offline_access`, if applicable. In dynamic client registration mode, n8n may replace the requested scope with the server's discovered `scopes_supported` metadata.

The authorization server must expose standard OAuth discovery metadata and a dynamic client registration endpoint. Auth0 tenants must have dynamic client registration enabled for this flow to work.

If you disable dynamic client registration, n8n falls back to the standard OAuth2 credential fields and you must provide the client configuration manually.

When configuring Auth0, allow the OAuth redirect URL shown by n8n as a callback URL for the registered client.

## Usage

The Katara node uploads one document per input item.

Required node fields:

1. **Organization ID**
2. **Agent ID**
3. **Source ID**
4. **Input Binary Field**

The node reads the selected input binary property, base64-encodes the file contents using the protobuf JSON mapping expected by Connect, and sends a unary request to Katara's `UploadDocument` RPC.

Optional fields let you override the uploaded filename and content type, and send `language`, `publishedAt`, and comma-separated `tagIds`.

## Compatibility

Compatible with n8n versions that support OAuth2 dynamic client registration for `oAuth2Api` credentials.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Katara API repository](https://github.com/katara-ai-inc/katara)
