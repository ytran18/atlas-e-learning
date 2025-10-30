/**
 * Hook: useStartCourse
 *
 * Bắt đầu học một khóa học
 * Tạo progress record mới trong database
 */
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { startCourse } from "@/services/api.client";
import { CourseType, StartCourseRequest, StartCourseResponse } from "@/types/api";

// Import query keys để invalidate cache
const courseProgressKeys = {
    all: ["courseProgress"] as const,
    progresses: () => ["courseProgress", "progress"] as const,
    progress: (type: CourseType, groupId: string) =>
        ["courseProgress", "progress", type, groupId] as const,
};

/**
 * Hook để bắt đầu học khóa học
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param options - React Query mutation options
 * @returns Mutation result với mutate function
 *
 * @example
 * const { mutate, isPending } = useStartCourse("atld", {
 *   onSuccess: (data) => {
 *     console.log("Course started:", data);
 *     router.push(`/atld/${data.groupId}/learn`);
 *   },
 *   onError: (error) => {
 *     console.error("Failed to start:", error);
 *   },
 * });
 *
 * // Sử dụng
 * mutate({
 *   groupId: "group_001",
 *   portraitUrl: "https://...",
 * });
 */
export function useStartCourse(
    type: CourseType,
    options?: Omit<
        UseMutationOptions<StartCourseResponse, Error, StartCourseRequest, unknown>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: StartCourseRequest) => startCourse(type, data),
        onSuccess: (data, variables, context, mutation) => {
            // Invalidate progress query để fetch lại data mới
            void queryClient.invalidateQueries({
                queryKey: courseProgressKeys.progress(type, variables.groupId),
            });

            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
