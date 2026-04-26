"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KataraOAuth2Api = void 0;
class KataraOAuth2Api {
    constructor() {
        this.name = 'kataraOAuth2Api';
        this.extends = ['oAuth2Api'];
        this.displayName = 'Katara OAuth2 API';
        this.icon = { light: 'file:../icons/katara.svg', dark: 'file:../icons/katara.dark.svg' };
        this.documentationUrl = 'https://github.com/katara-ai-inc/katara-n8n?tab=readme-ov-file#credentials';
        this.properties = [
            {
                displayName: 'Use Dynamic Client Registration',
                name: 'useDynamicClientRegistration',
                type: 'boolean',
                default: true,
                description: 'Automatically register an OAuth client with the authorization server before starting the OAuth flow',
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
}
exports.KataraOAuth2Api = KataraOAuth2Api;
//# sourceMappingURL=KataraOAuth2Api.credentials.js.map