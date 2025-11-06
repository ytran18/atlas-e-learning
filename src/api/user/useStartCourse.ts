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
