import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const UPLOAD_DOCUMENT_PROCEDURE =
	'/katara.content_uploader.v1alpha1.ContentUploaderService/UploadDocument';

export async function kataraUploadDocument(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
	body: IDataObject,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}${UPLOAD_DOCUMENT_PROCEDURE}`,
		headers: {
			'Content-Type': 'application/json',
			'Connect-Protocol-Version': '1',
		},
		body,
		json: true,
	};

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'kataraOAuth2Api',
			options,
		);

		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
	}
}
