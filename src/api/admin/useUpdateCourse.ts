/**
 * Hook: useUpdateCourse (Admin)
 *
 * Cập nhật thông tin khóa học
 * Chỉ dành cho admin
 */
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCourse } from "@/services/api.client";
import { CourseType, UpdateCourseRequest, UpdateCourseResponse } from "@/types/api";

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
interface UpdateCourseVariables extends UpdateCourseRequest {
    groupId: string;
}

/**
 * Hook để cập nhật khóa học
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param options - React Query mutation options
 * @returns Mutation result với mutate function
 *
 * @example
 * const { mutate, isPending } = useUpdateCourse("atld", {
 *   onSuccess: () => {
 *     console.log("Course updated");
 *     toast.success("Cập nhật thành công");
 *   },
 * });
 *
 * // Cập nhật title và description
 * mutate({
 *   groupId: "group_001",
 *   title: "New Title",
 *   description: "Updated description",
 * });
 *
 * // Cập nhật theory section
 * mutate({
 *   groupId: "group_001",
 *   theory: {
 *     title: "Updated Theory",
 *     description: "...",
 *     videos: [...],
 *   },
 * });
 */
export function useUpdateCourse(
    type: CourseType,
    options?: Omit<
        UseMutationOptions<UpdateCourseResponse, Error, UpdateCourseVariables, unknown>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId, ...data }: UpdateCourseVariables) =>
            updateCourse(type, groupId, data),
        onSuccess: (data, variables, context, mutation) => {
            // Invalidate các queries liên quan
            void queryClient.invalidateQueries({
                queryKey: courseListKeys.list(type),
            });
            void queryClient.invalidateQueries({
                queryKey: coursePreviewKeys.preview(type, variables.groupId),
            });
            void queryClient.invalidateQueries({
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
