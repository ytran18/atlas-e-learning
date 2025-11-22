import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { retakeCourseExam } from "@/services/api.client";

/**
 * Interface cho mutation variables
 */
interface RetakeCourseExamVariables {
    userId: string;
    groupId: string;
}

export function useRetakeCourseExam(
    options?: Omit<UseMutationOptions<any, Error, RetakeCourseExamVariables, unknown>, "mutationFn">
) {
    return useMutation({
        mutationFn: ({ userId, groupId }: RetakeCourseExamVariables) =>
            retakeCourseExam(userId, groupId),
        onSuccess: async (data, variables, context, mutation) => {
            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
