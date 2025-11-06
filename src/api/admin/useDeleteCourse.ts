/**
 * Hook: useDeleteCourse (Admin)
 *
 * Xóa khóa học
 * Chỉ dành cho admin
 */
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCourse } from "@/services/api.client";
import { CourseType, DeleteCourseResponse } from "@/types/api";

import { courseListKeys } from "../user/useCourseList";
import { coursePreviewKeys } from "../user/useCoursePreview";

// Query keys cho course detail
const courseDetailKeys = {
    all: ["courseDetail"] as const,
    details: () => ["courseDetail", "detail"] as const,
    detail: (type: CourseType, groupId: string) =>
        ["courseDetail", "detail", type, groupId] as const,
};

/**
 * Interface cho mutation variables
 */
interface DeleteCourseVariables {
    groupId: string;
}

export function useDeleteCourse(
    type: CourseType,
    options?: Omit<
        UseMutationOptions<DeleteCourseResponse, Error, DeleteCourseVariables, unknown>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId }: DeleteCourseVariables) => deleteCourse(type, groupId),
        onSuccess: (data, variables, context, mutation) => {
            // Invalidate course list
            void queryClient.invalidateQueries({
                queryKey: courseListKeys.list(type),
            });

            // Remove cache cho khóa học đã xóa
            queryClient.removeQueries({
                queryKey: coursePreviewKeys.preview(type, variables.groupId),
            });
            queryClient.removeQueries({
                queryKey: courseDetailKeys.detail(type, variables.groupId),
            });

            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
