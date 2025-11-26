import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getDocumentLists } from "@/services/documents.client";
import { DocumentResponse, DocumentType } from "@/types/documents";

export const documentKeys = {
    all: ["docs"] as const,
    list: (type: DocumentType) => [...documentKeys.all, type] as const,
};

export function useGetDocsList(
    type: DocumentType,
    options?: Omit<
        UseQueryOptions<DocumentResponse[], Error, DocumentResponse[]>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: documentKeys.list(type),
        queryFn: () => getDocumentLists(type),
        ...options,
    });
}
