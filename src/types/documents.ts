export type DocumentType = "file" | "video";

export interface DocumentPayload {
    title: string;
    description: string;
    url: string;
    type: DocumentType;
    sortNo?: number;
}

export interface DocumentResponse {
    id: string;
    title: string;
    description: string;
    url: string;
    type: DocumentType;
    sortNo: number;
    createdAt: number;
}

export interface CreateDocumentResponse {
    message: string;
}
