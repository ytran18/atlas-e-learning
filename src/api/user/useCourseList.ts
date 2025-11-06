/**
 * Hook: useCourseList
 *
 * Lấy danh sách tất cả khóa học theo loại (ATLD hoặc Học Nghề)
 * Sử dụng useQuery để cache và tự động refetch
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getCourseList } from "@/services/api.client";
import { CourseType, GetCourseListResponse } from "@/types/api";

/**
 * Query key factory cho course list
 * Giúp dễ dàng invalidate cache khi cần
 */
export const courseListKeys = {
    all: ["courseList"] as const,
    lists: () => [...courseListKeys.all, "list"] as const,
    list: (type: CourseType | "all") => [...courseListKeys.lists(), type] as const,
};

export function useCourseList(
    type: CourseType,
    options?: Omit<
        UseQueryOptions<GetCourseListResponse, Error, GetCourseListResponse>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: courseListKeys.list(type),
        queryFn: () => getCourseList(type),
        ...options,
    });
}
