import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { deleteDocument } from "@/services/documents.client";
import { CreateDocumentResponse } from "@/types/documents";

export function useDeleteDoc(
    options?: Omit<UseMutationOptions<CreateDocumentResponse, Error, string, unknown>, "mutationFn">
) {
    return useMutation({
        mutationFn: (id: string) => deleteDocument(id),
        onSuccess: (data, variables, context, mutation) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
