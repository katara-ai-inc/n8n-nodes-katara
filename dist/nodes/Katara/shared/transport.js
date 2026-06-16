"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kataraUploadDocument = kataraUploadDocument;
const n8n_workflow_1 = require("n8n-workflow");
const UPLOAD_DOCUMENT_ASYNC_PROCEDURE = '/katara.content_uploader.v1alpha1.ContentUploaderService/UploadDocumentAsync';
async function kataraUploadDocument(itemIndex, baseUrl, body) {
    const options = {
        method: 'POST',
        url: `${baseUrl}${UPLOAD_DOCUMENT_ASYNC_PROCEDURE}`,
        headers: {
            'Content-Type': 'application/json',
            'Connect-Protocol-Version': '1',
        },
        body,
        json: true,
    };
    try {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'kataraApi', options);
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex });
    }
}
//# sourceMappingURL=transport.js.map