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

The credential requires:

1. **Base URL**: The public base URL of the Katara API.
2. **Auth0 Domain**: The Auth0 tenant domain that validates Katara user access tokens.
3. **Auth0 Custom Domain**: Optional. Use this if your Auth0 tenant exposes a custom login domain for interactive OAuth.
4. **Audience**: The Katara API audience configured in Auth0.
5. **Scope**: Optional. Supply scopes required by your Auth0 application, such as `openid profile email offline_access`, if applicable.

When configuring Auth0, copy the OAuth redirect URL shown by n8n into your Auth0 application's allowed callback URLs.

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

Compatible with n8n@1.60.0 or later.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Katara API repository](https://github.com/katara-ai-inc/katara)
