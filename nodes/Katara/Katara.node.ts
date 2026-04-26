import type {
	IBinaryData,
	ICredentialDataDecryptedObject,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import {
	ApplicationError,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { kataraUploadDocument } from './shared/transport';

type KataraCredentials = ICredentialDataDecryptedObject & {
	baseUrl?: string;
};

type KataraAdditionalFields = {
	contentType?: string;
	fileName?: string;
	language?: string;
	publishedAt?: string;
	tagIds?: string;
};

function normalizeBaseUrl(rawBaseUrl: string | undefined): string {
	const baseUrl = rawBaseUrl?.trim();

	if (!baseUrl) {
		throw new ApplicationError('Katara Base URL is required in the credential');
	}

	let parsedUrl: URL;

	try {
		parsedUrl = new URL(baseUrl);
	} catch {
		throw new ApplicationError(`Katara Base URL must be a valid absolute URL: ${baseUrl}`);
	}

	if (parsedUrl.protocol !== 'https:') {
		throw new ApplicationError('Katara Base URL must use HTTPS');
	}

	if (parsedUrl.username || parsedUrl.password) {
		throw new ApplicationError('Katara Base URL must not include embedded credentials');
	}

	const hostname = parsedUrl.hostname.toLowerCase();
	const blockedHostnames = new Set(['localhost', '127.0.0.1', '::1', '169.254.169.254']);
	if (blockedHostnames.has(hostname)) {
		throw new ApplicationError('Katara Base URL must not target localhost or link-local addresses');
	}

	if (
		hostname.startsWith('10.') ||
		hostname.startsWith('127.') ||
		hostname.startsWith('192.168.') ||
		hostname.startsWith('169.254.') ||
		hostname === '::1' ||
		hostname.startsWith('fc') ||
		hostname.startsWith('fd') ||
		hostname.startsWith('fe80:')
	) {
		throw new ApplicationError('Katara Base URL must not target private or local network addresses');
	}

	if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) {
		throw new ApplicationError('Katara Base URL must not target private network addresses');
	}

	return baseUrl.replace(/\/+$/, '');
}

function normalizeOptionalString(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function getFileName(binaryData: IBinaryData, binaryPropertyName: string, override?: string): string {
	return normalizeOptionalString(override) ?? binaryData.fileName ?? `${binaryPropertyName}.bin`;
}

function getContentType(binaryData: IBinaryData, override?: string): string | undefined {
	return normalizeOptionalString(override) ?? normalizeOptionalString(binaryData.mimeType);
}

function parseTagIds(rawTagIds: string | undefined): string[] | undefined {
	const value = normalizeOptionalString(rawTagIds);
	if (!value) {
		return undefined;
	}

	const tagIds = value
		.split(',')
		.map((tagId) => tagId.trim())
		.filter((tagId) => tagId.length > 0);

	return tagIds.length > 0 ? tagIds : undefined;
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return 'Unknown error';
}

const uploadDocumentFields: INodeProperties[] = [
	{
		displayName: 'Organization ID',
		name: 'orgId',
		type: 'string',
		default: '',
		required: true,
		description: 'The Katara organization ID that owns the uploaded document',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		default: '',
		required: true,
		description: 'The Katara content uploader agent ID that should process the file',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Source ID',
		name: 'sourceId',
		type: 'string',
		default: '',
		required: true,
		description: 'The Katara source ID to associate with the uploaded document',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'The name of the input binary field that contains the file to upload',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'string',
				default: '',
					description:
						'Override the content type sent to Katara. By default the node uses the input binary MIME type.',
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
					description:
						'Override the filename sent to Katara. By default the node uses the input binary filename.',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Optional language hint for the uploaded document',
			},
			{
				displayName: 'Published At',
				name: 'publishedAt',
				type: 'dateTime',
				default: '',
				description: 'Optional publication timestamp for the uploaded document',
			},
			{
				displayName: 'Tag IDs',
				name: 'tagIds',
				type: 'string',
				default: '',
				placeholder: 'tag-1, tag-2',
				description: 'Comma-separated Katara tag IDs to attach to the uploaded document',
			},
		],
	},
];

export class Katara implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Katara',
		name: 'katara',
		icon: { light: 'file:../../icons/katara.svg', dark: 'file:../../icons/katara.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Upload documents to the Katara API',
		defaults: {
			name: 'Katara',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'kataraOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'document',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload a document to Katara',
						action: 'Upload a document',
					},
				],
				default: 'upload',
			},
			...uploadDocumentFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = (await this.getCredentials('kataraOAuth2Api')) as KataraCredentials;

		let baseUrl: string;

		try {
			baseUrl = normalizeBaseUrl(credentials.baseUrl);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), getErrorMessage(error));
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				if (resource !== 'document' || operation !== 'upload') {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported Katara operation: ${resource}.${operation}`,
						{ itemIndex },
					);
				}

				const orgId = this.getNodeParameter('orgId', itemIndex) as string;
				const agentId = this.getNodeParameter('agentId', itemIndex) as string;
				const sourceId = this.getNodeParameter('sourceId', itemIndex) as string;
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
				const additionalFields = this.getNodeParameter(
					'additionalFields',
					itemIndex,
					{},
				) as KataraAdditionalFields;
				const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
				const fileBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryData);

				const file: IDataObject = {
					filename: getFileName(binaryData, binaryPropertyName, additionalFields.fileName),
					data: fileBuffer.toString('base64'),
				};

				const contentType = getContentType(binaryData, additionalFields.contentType);
				if (contentType) {
					file.contentType = contentType;
				}

				const body: IDataObject = {
					orgId,
					agentId,
					sourceId,
					file,
				};

				const language = normalizeOptionalString(additionalFields.language);
				if (language) {
					body.language = language;
				}

				const publishedAt = normalizeOptionalString(additionalFields.publishedAt);
				if (publishedAt) {
					body.published_at = publishedAt;
				}

				const tagIds = parseTagIds(additionalFields.tagIds);
				if (tagIds) {
					body.tagIds = tagIds;
				}

				const responseData = await kataraUploadDocument.call(this, itemIndex, baseUrl, body);

				returnData.push({
					json: responseData,
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: getErrorMessage(error),
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeApiError || error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}
