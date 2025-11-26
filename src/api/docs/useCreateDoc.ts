import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { createDocument } from "@/services/documents.client";
import { CreateDocumentResponse, DocumentPayload } from "@/types/documents";

export function useCreateDoc(
    options?: Omit<
        UseMutationOptions<CreateDocumentResponse, Error, DocumentPayload, unknown>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: (data: DocumentPayload) => createDocument(data),
        onSuccess: (data, variables, context, mutation) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
