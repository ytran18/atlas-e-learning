import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import {
    CreateDocumentResponse,
    DocumentPayload,
    DocumentResponse,
    DocumentType,
} from "@/types/documents";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiSuccessResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const error = data as ApiErrorResponse;
        throw new Error(error.error || "API request failed");
    }

    return data as ApiSuccessResponse<T>;
}

export async function createDocument(payload: DocumentPayload): Promise<CreateDocumentResponse> {
    const endpoint = "/api/v1/docs/create";

    const reponse = await apiFetch<CreateDocumentResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return reponse.data;
}

export async function getDocumentLists(type: DocumentType): Promise<DocumentResponse[]> {
    const endpoint = `/api/v1/docs/list?type=${type}`;

    const response = await apiFetch<DocumentResponse[]>(endpoint);

    return response.data;
}

export async function updateDocument(
    id: string,
    payload: DocumentPayload
): Promise<CreateDocumentResponse> {
    const endpoint = "/api/v1/docs/update";

    const reponse = await apiFetch<CreateDocumentResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify({ ...payload, id }),
    });

    return reponse.data;
}

export async function deleteDocument(id: string): Promise<CreateDocumentResponse> {
    const endpoint = "/api/v1/docs/delete";

    const reponse = await apiFetch<CreateDocumentResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify({ id }),
    });

    return reponse.data;
}
