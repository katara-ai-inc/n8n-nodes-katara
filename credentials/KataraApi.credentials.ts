import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KataraApi implements ICredentialType {
	name = 'kataraApi';

	displayName = 'Katara API';

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
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Katara API token to send as a bearer token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic' as const,
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/grpc.health.v1.Health/Check',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Connect-Protocol-Version': '1',
			},
			body: {
				service: '',
			},
			json: true,
		},
	};
}
