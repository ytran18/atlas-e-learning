/**
 * Hook: useCreateCourse (Admin)
 *
 * Tạo khóa học mới
 * Chỉ dành cho admin
 */
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { createCourse } from "@/services/api.client";
import { CourseType, CreateCourseRequest, CreateCourseResponse } from "@/types/api";

import { courseListKeys } from "../user/useCourseList";

export function useCreateCourse(
    type: CourseType,
    options?: Omit<
        UseMutationOptions<CreateCourseResponse, Error, CreateCourseRequest, unknown>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCourseRequest) => createCourse(type, data),
        onSuccess: (data, variables, context, mutation) => {
            // Invalidate course list để hiển thị khóa học mới
            void queryClient.invalidateQueries({
                queryKey: courseListKeys.list(type),
            });

            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
