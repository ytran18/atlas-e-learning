/**
 * Hook: useUpdateProgress
 *
 * Cập nhật tiến trình học của user
 * Track video đang xem, thời gian hiện tại, và đánh dấu video đã hoàn thành
 */
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { updateCourseProgress } from "@/services/api.client";
import { CourseType, UpdateProgressRequest, UpdateProgressResponse } from "@/types/api";

/**
 * Interface cho mutation variables
 */
interface UpdateProgressVariables extends UpdateProgressRequest {
    groupId: string;
}

export function useUpdateProgress(
    type: CourseType,
    options?: Omit<
        UseMutationOptions<UpdateProgressResponse, Error, UpdateProgressVariables, unknown>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: ({ groupId, ...data }: UpdateProgressVariables) =>
            updateCourseProgress(type, groupId, data),
        onSuccess: async (data, variables, context, mutation) => {
            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
