export type DocumentType = "file" | "video";
export type DocumentCategory = "atld" | "hoc-nghe";

export interface DocumentPayload {
    title: string;
    description: string;
    url: string;
    type: DocumentType;
    category: DocumentCategory;
    sortNo?: number;
}

export interface DocumentResponse {
    id: string;
    title: string;
    description: string;
    url: string;
    type: DocumentType;
    category: DocumentCategory;
    sortNo: number;
    createdAt: number;
}

export interface CreateDocumentResponse {
    message: string;
}

/**
 * FIRESTORE INDEX REQUIREMENT:
 *
 * To support querying documents by both 'type' and 'category' with ordering by 'sortNo',
 * you need to create a composite index in Firestore.
 *
 * Collection: documents
 * Fields:
 *   - type (Ascending)
 *   - category (Ascending)
 *   - sortNo (Descending)
 *
 * You can create this index either:
 * 1. Via Firebase Console: Firestore Database -> Indexes -> Create Index
 * 2. Via the error message link when the query first fails in production
 */
