/**
 * Hook: useCourseDetail (Admin)
 *
 * Lấy thông tin đầy đủ của khóa học cho admin
 * Bao gồm cả exam questions và timestamps
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getCourseDetail } from "@/services/api.client";
import { CourseType, GetCourseDetailResponse } from "@/types/api";

/**
 * Query key factory cho course detail
 */
const courseDetailKeys = {
    all: ["courseDetail"] as const,
    details: () => [...courseDetailKeys.all, "detail"] as const,
    detail: (type: CourseType, groupId: string) =>
        [...courseDetailKeys.details(), type, groupId] as const,
};

export function useCourseDetail(
    type: CourseType,
    groupId: string,
    options?: Omit<
        UseQueryOptions<GetCourseDetailResponse, Error, GetCourseDetailResponse>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: courseDetailKeys.detail(type, groupId),
        queryFn: () => getCourseDetail(type, groupId),
        enabled: !!groupId, // Chỉ fetch khi có groupId
        ...options,
    });
}
