/**
 * Hook: useStudentStats (Admin)
 *
 * Lấy thống kê học viên cho một khóa học
 * Không sử dụng infinite query, chỉ trả về dữ liệu một trang (GetStatsResponse)
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getStudentStats } from "@/services/api.client";
import { CourseType, GetStatsResponse } from "@/types/api";

/**
 * Query key factory cho student stats
 */
export const studentStatsKeys = {
    all: ["studentStats"] as const,
    stats: () => [...studentStatsKeys.all, "stats"] as const,
    stat: (
        type: CourseType,
        groupId: string,
        pageSize?: number,
        cursor?: string,
        search?: string
    ) => [...studentStatsKeys.stats(), type, groupId, pageSize, cursor, search] as const,
};

export function useStudentStats(
    type: CourseType,
    groupId: string,
    pageSize: number = 20,
    cursor?: string,
    search?: string,
    options?: Omit<
        UseQueryOptions<GetStatsResponse, Error>,
        "queryKey" | "queryFn" // omit these because we set them below
    >
) {
    return useQuery({
        queryKey: studentStatsKeys.stat(type, groupId, pageSize, cursor, search),
        queryFn: () => getStudentStats(type, groupId, pageSize, cursor, search),
        enabled: !!groupId,
        placeholderData: (previousData) => previousData,
        ...options,
    });
}
