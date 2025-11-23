import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { deleteUserProgress } from "@/services";

export function useDeleteUserProgress(
    options?: Omit<
        UseMutationOptions<boolean, Error, { userId: string; groupId: string }, unknown>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
            deleteUserProgress(userId, groupId),
        ...options,
    });
}
