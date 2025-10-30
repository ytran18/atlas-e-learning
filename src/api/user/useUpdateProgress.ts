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

/**
 * Hook để cập nhật tiến trình học
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param options - React Query mutation options
 * @returns Mutation result với mutate function
 *
 * @example
 * const { mutate, isPending } = useUpdateProgress("atld", {
 *   onSuccess: () => {
 *     console.log("Progress updated");
 *   },
 * });
 *
 * // Cập nhật thời gian video hiện tại
 * mutate({
 *   groupId: "group_001",
 *   section: "theory",
 *   videoIndex: 0,
 *   currentTime: 120, // 2 phút
 * });
 *
 * // Đánh dấu video đã hoàn thành
 * mutate({
 *   groupId: "group_001",
 *   section: "theory",
 *   videoIndex: 0,
 *   currentTime: 0,
 *   completedVideo: {
 *     section: "theory",
 *     index: 0,
 *   },
 * });
 */
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
