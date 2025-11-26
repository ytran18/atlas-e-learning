import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { updateDocument } from "@/services/documents.client";
import { CreateDocumentResponse, DocumentPayload } from "@/types/documents";

export function useUpdateDoc(
    options?: Omit<
        UseMutationOptions<
            CreateDocumentResponse,
            Error,
            { id: string; payload: DocumentPayload },
            unknown
        >,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: DocumentPayload }) =>
            updateDocument(id, payload),
        onSuccess: (data, variables, context, mutation) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
