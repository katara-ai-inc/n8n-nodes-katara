"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KataraApi = void 0;
class KataraApi {
    constructor() {
        this.name = 'kataraApi';
        this.displayName = 'Katara API';
        this.icon = { light: 'file:../icons/katara.svg', dark: 'file:../icons/katara.dark.svg' };
        this.documentationUrl = 'https://github.com/katara-ai-inc/katara-n8n?tab=readme-ov-file#credentials';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiToken}}',
                },
            },
        };
        this.test = {
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
}
exports.KataraApi = KataraApi;
//# sourceMappingURL=KataraApi.credentials.js.map