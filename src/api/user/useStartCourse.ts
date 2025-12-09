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
        onSuccess: (data, variables, context) => {
            // Manually update cache to prevent race condition
            // This ensures that when we navigate to the next page, the data is already there
            // and we don't get redirected back because of missing startImageUrl
            queryClient.setQueryData(
                courseProgressKeys.progress(type, variables.groupId),
                (oldData: any) => ({
                    ...oldData,
                    ...data,
                    startImageUrl: variables.portraitUrl,
                    courseName: variables.courseName,
                    userFullname: variables.userFullname,
                    userBirthDate: variables.userBirthDate,
                    userCompanyName: variables.userCompanyName,
                    userIdCard: variables.userIdCard,
                    completedVideos: [],
                    lastUpdatedAt: Date.now(),
                })
            );

            // Invalidate progress query để fetch lại data mới (clean up eventual consistency)
            void queryClient.invalidateQueries({
                queryKey: courseProgressKeys.progress(type, variables.groupId),
            });

            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                // Pass all 4 arguments as expected by the type signature
                options.onSuccess(data, variables, context, null as any);
            }
        },
        ...options,
    });
}
