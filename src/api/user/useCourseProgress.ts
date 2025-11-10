/**
 * Hook: useCourseProgress
 *
 * Lấy tiến trình học của user cho một khóa học
 * Track video hiện tại, thời gian, và các video đã hoàn thành
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getCourseProgress } from "@/services/api.client";
import { CourseType, GetProgressResponse } from "@/types/api";

/**
 * Query key factory cho course progress
 */
export const courseProgressKeys = {
    all: ["courseProgress"] as const,
    progresses: () => [...courseProgressKeys.all, "progress"] as const,
    progress: (type: CourseType, groupId: string) =>
        [...courseProgressKeys.progresses(), type, groupId] as const,
};

export function useCourseProgress(
    type: CourseType,
    groupId: string,
    onError?: () => void,
    options?: Omit<
        UseQueryOptions<GetProgressResponse, Error, GetProgressResponse>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: courseProgressKeys.progress(type, groupId),
        queryFn: () => getCourseProgress(type, groupId),
        enabled: !!groupId, // Chỉ fetch khi có groupId
        retry: (failureCount, error) => {
            console.log("retry", failureCount, error);

            // Không retry nếu là 404 error
            if (error?.message?.includes("404") || error?.message?.includes("Progress not found")) {
                if (typeof onError === "function") {
                    onError?.();
                }
                return false;
            }
            // Retry tối đa 3 lần cho các lỗi khác
            return failureCount < 3;
        },
        ...options,
    });
}
