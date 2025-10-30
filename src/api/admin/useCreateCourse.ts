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

/**
 * Hook để tạo khóa học mới
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param options - React Query mutation options
 * @returns Mutation result với mutate function
 *
 * @example
 * const { mutate, isPending, isSuccess } = useCreateCourse("atld", {
 *   onSuccess: (data) => {
 *     console.log("Course created with ID:", data.id);
 *     router.push(`/admin/atld/${data.id}`);
 *   },
 *   onError: (error) => {
 *     console.error("Failed to create:", error);
 *   },
 * });
 *
 * // Tạo khóa học mới
 * mutate({
 *   title: "An Toàn Lao Động Cơ Bản",
 *   type: "atld",
 *   description: "Khóa học nền tảng...",
 *   theory: {
 *     title: "Lý thuyết",
 *     description: "...",
 *     videos: [...],
 *   },
 *   practice: {
 *     title: "Thực hành",
 *     description: "...",
 *     videos: [...],
 *   },
 *   exam: {
 *     title: "Thi cuối khóa",
 *     timeLimit: 1800,
 *     questions: [...],
 *   },
 * });
 */
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
