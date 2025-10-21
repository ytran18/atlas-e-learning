/**
 * Hook: useStudentStats (Admin)
 *
 * Lấy thống kê học viên cho một khóa học
 * Hỗ trợ pagination với cursor-based
 */
import { UseInfiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { getStudentStats } from "@/services/api.client";
import { CourseType, GetStatsResponse } from "@/types/api";

/**
 * Query key factory cho student stats
 */
export const studentStatsKeys = {
    all: ["studentStats"] as const,
    stats: () => [...studentStatsKeys.all, "stats"] as const,
    stat: (type: CourseType, groupId: string, pageSize?: number) =>
        [...studentStatsKeys.stats(), type, groupId, pageSize] as const,
};

/**
 * Hook lấy thống kê học viên với infinite scroll/pagination
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param groupId - ID của khóa học
 * @param pageSize - Số lượng học viên mỗi trang (default: 20)
 * @param options - React Query options
 * @returns Infinite query result với data phân trang
 *
 * @example
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * } = useStudentStats("atld", "group_001", 20);
 *
 * // Render data
 * const allStudents = data?.pages.flatMap(page => page.data) || [];
 *
 * // Load more
 * <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
 *   {isFetchingNextPage ? "Loading..." : "Load More"}
 * </button>
 */
export function useStudentStats(
    type: CourseType,
    groupId: string,
    pageSize: number = 20,
    options?: Omit<
        UseInfiniteQueryOptions<GetStatsResponse, Error>,
        "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
    >
) {
    return useInfiniteQuery({
        queryKey: studentStatsKeys.stat(type, groupId, pageSize),
        queryFn: ({ pageParam }) =>
            getStudentStats(type, groupId, pageSize, pageParam as string | undefined),
        getNextPageParam: (lastPage) => {
            // Trả về cursor cho trang tiếp theo nếu có
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        initialPageParam: undefined,
        enabled: !!groupId, // Chỉ fetch khi có groupId
        ...options,
    });
}
