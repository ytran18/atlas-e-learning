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
    stat: (type: CourseType, groupId: string, pageSize?: number) =>
        [...studentStatsKeys.stats(), type, groupId, pageSize] as const,
};

/**
 * Hook lấy thống kê học viên cho một trang (không infinite)
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param groupId - ID của khóa học
 * @param pageSize - Số lượng học viên mỗi trang (default: 20)
 * @param cursor - Cursor cho trang hiện tại (nếu có)
 * @param options - React Query options
 * @returns Query result với data theo dạng GetStatsResponse
 *
 * @example
 * const { data, isLoading } = useStudentStats("atld", "group_001", 20);
 */
export function useStudentStats(
    type: CourseType,
    groupId: string,
    page: number,
    pageSize: number = 20,
    cursor?: string,
    options?: Omit<
        UseQueryOptions<GetStatsResponse, Error>,
        "queryKey" | "queryFn" // omit these because we set them below
    >
) {
    return useQuery({
        queryKey: studentStatsKeys.stat(type, groupId, pageSize),
        queryFn: () => getStudentStats(type, groupId, page, pageSize, cursor),
        enabled: !!groupId,
        ...options,
    });
}
