/**
 * Hook: useCourseList
 *
 * Lấy danh sách tất cả khóa học theo loại (ATLD hoặc Học Nghề)
 * Sử dụng useQuery để cache và tự động refetch
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getCourseList } from "@/services/api.client";
import { GetCourseListResponse } from "@/types/api";

import { courseListKeys } from "./useCourseList";

export function useGetAllCourseLists(
    options?: Omit<
        UseQueryOptions<GetCourseListResponse, Error, GetCourseListResponse>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: courseListKeys.list("all"),
        queryFn: () => getCourseList("all"),
        ...options,
    });
}
