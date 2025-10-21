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
export const courseDetailKeys = {
    all: ["courseDetail"] as const,
    details: () => [...courseDetailKeys.all, "detail"] as const,
    detail: (type: CourseType, groupId: string) =>
        [...courseDetailKeys.details(), type, groupId] as const,
};

/**
 * Hook lấy chi tiết đầy đủ khóa học (admin only)
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param groupId - ID của khóa học
 * @param options - React Query options
 * @returns Query result với data chi tiết đầy đủ
 *
 * @example
 * const { data, isLoading } = useCourseDetail("atld", "group_001");
 *
 * // Chỉ fetch khi ở trang edit
 * const { data } = useCourseDetail("atld", groupId, {
 *   enabled: isEditMode && !!groupId,
 * });
 *
 * // Access data
 * if (data) {
 *   console.log(data.theory);
 *   console.log(data.practice);
 *   console.log(data.exam.questions); // Bao gồm cả answers
 * }
 */
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
