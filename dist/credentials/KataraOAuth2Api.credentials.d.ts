import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class KataraOAuth2Api implements ICredentialType {
    name: string;
    extends: string[];
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    properties: INodeProperties[];
}
