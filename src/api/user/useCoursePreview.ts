/**
 * Hook: useCoursePreview
 *
 * Lấy thông tin chi tiết của khóa học trước khi bắt đầu học
 * Hiển thị theory, practice videos và số câu hỏi exam
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getCoursePreview } from "@/services/api.client";
import { CourseType, GetCoursePreviewResponse } from "@/types/api";

/**
 * Query key factory cho course preview
 */
export const coursePreviewKeys = {
    all: ["coursePreview"] as const,
    previews: () => [...coursePreviewKeys.all, "preview"] as const,
    preview: (type: CourseType, groupId: string) =>
        [...coursePreviewKeys.previews(), type, groupId] as const,
};

export function useCoursePreview(
    type: CourseType,
    groupId: string,
    options?: Omit<
        UseQueryOptions<GetCoursePreviewResponse, Error, GetCoursePreviewResponse>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: coursePreviewKeys.preview(type, groupId),
        queryFn: () => getCoursePreview(type, groupId),
        enabled: !!groupId, // Chỉ fetch khi có groupId
        staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
        ...options,
    });
}
