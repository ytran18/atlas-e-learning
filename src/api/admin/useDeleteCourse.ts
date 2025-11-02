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

/**
 * Hook để xóa khóa học
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param options - React Query mutation options
 * @returns Mutation result với mutate function
 *
 * @example
 * const { mutate, isPending } = useDeleteCourse("atld", {
 *   onSuccess: (data) => {
 *     console.log("Deleted course:", data.deleted);
 *     toast.success("Xóa khóa học thành công");
 *     router.push("/admin/courses");
 *   },
 *   onError: (error) => {
 *     toast.error("Không thể xóa khóa học");
 *   },
 * });
 *
 * // Xóa khóa học
 * mutate({ groupId: "group_001" });
 *
 * // Với confirmation
 * const handleDelete = () => {
 *   if (confirm("Bạn có chắc muốn xóa khóa học này?")) {
 *     mutate({ groupId: courseId });
 *   }
 * };
 */
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
