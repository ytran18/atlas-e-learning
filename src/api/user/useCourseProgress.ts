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

/**
 * Hook lấy tiến trình học của user
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param groupId - ID của khóa học
 * @param options - React Query options để customize behavior
 * @returns Query result với data tiến trình học
 *
 * @example
 * const { data, isLoading } = useCourseProgress("atld", "group_001");
 *
 * // Với refetch interval để update realtime
 * const { data } = useCourseProgress("atld", groupId, {
 *   refetchInterval: 30000, // Refetch mỗi 30 giây
 *   enabled: !!groupId && isLearning,
 * });
 */
export function useCourseProgress(
    type: CourseType,
    groupId: string,
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
                return false;
            }
            // Retry tối đa 3 lần cho các lỗi khác
            return failureCount < 3;
        },
        ...options,
    });
}
