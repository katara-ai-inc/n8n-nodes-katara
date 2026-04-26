import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class KataraOAuth2Api implements ICredentialType {
	name = 'kataraOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Katara OAuth2 API';

	icon: Icon = { light: 'file:../icons/katara.svg', dark: 'file:../icons/katara.dark.svg' };

	documentationUrl = 'https://github.com/katara-ai-inc/katara-n8n?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://api.example.com',
			description: 'The public base URL of the Katara API',
		},
		{
			displayName: 'Auth0 Domain',
			name: 'auth0Domain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'katara-dev.us.auth0.com',
			description: 'The Auth0 tenant domain that issues Katara user tokens',
		},
		{
			displayName: 'Auth0 Custom Domain',
			name: 'auth0CustomDomain',
			type: 'string',
			default: '',
			placeholder: 'login.example.com',
			description: 'Optional custom Auth0 domain used for the interactive OAuth flow',
		},
		{
			displayName: 'Audience',
			name: 'audience',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://api.example.com',
			description: 'The Katara API audience configured in Auth0',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: '',
			placeholder: 'openid profile email offline_access',
			description: 'Optional OAuth scopes to request during authorization',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default:
				'={{((($credentials.auth0CustomDomain || $credentials.auth0Domain || "").trim().replace(/^https?:\\/\\//, "").replace(/\\/.*$/, "")).match(/^[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+$/)) ? "https://" + (($credentials.auth0CustomDomain || $credentials.auth0Domain || "").trim().replace(/^https?:\\/\\//, "").replace(/\\/.*$/, "")) + "/authorize" : ""}}',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default:
				'={{((($credentials.auth0CustomDomain || $credentials.auth0Domain || "").trim().replace(/^https?:\\/\\//, "").replace(/\\/.*$/, "")).match(/^[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+$/)) ? "https://" + (($credentials.auth0CustomDomain || $credentials.auth0Domain || "").trim().replace(/^https?:\\/\\//, "").replace(/\\/.*$/, "")) + "/oauth/token" : ""}}',
			required: true,
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '={{$credentials.audience ? "audience=" + $credentials.audience : ""}}',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
