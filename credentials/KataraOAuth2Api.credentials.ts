import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class KataraOAuth2Api implements ICredentialType {
	name = 'kataraOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Katara OAuth2 API';

	icon: Icon = { light: 'file:../icons/katara.svg', dark: 'file:../icons/katara.dark.svg' };

	documentationUrl = 'https://github.com/katara-ai-inc/katara-n8n?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Use Dynamic Client Registration',
			name: 'useDynamicClientRegistration',
			type: 'boolean',
			default: true,
			description:
				'Automatically register an OAuth client with the authorization server before starting the OAuth flow',
		},
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
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '={{$credentials.audience ? "audience=" + $credentials.audience : ""}}',
		},
	];
}
