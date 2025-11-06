/**
 * Hook: useUploadCapture
 *
 * Upload ảnh chụp trong quá trình học
 * Sử dụng cho: ảnh bắt đầu, ảnh trong quá trình học, ảnh kết thúc
 */
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadLearningCapture } from "@/services/api.client";
import { CaptureType, CourseType, UploadCaptureResponse } from "@/types/api";

import { courseProgressKeys } from "./useCourseProgress";

/**
 * Interface cho mutation variables
 */
interface UploadCaptureVariables {
    file: File;
    groupId: string;
    captureType: CaptureType;
}

export function useUploadCapture(
    type: CourseType,
    options?: Omit<
        UseMutationOptions<UploadCaptureResponse, Error, UploadCaptureVariables, unknown>,
        "mutationFn"
    >
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, groupId, captureType }: UploadCaptureVariables) =>
            uploadLearningCapture(type, file, groupId, captureType),
        onSuccess: (data, variables, context, mutation) => {
            // Invalidate progress query nếu là ảnh start hoặc finish
            if (variables.captureType === "start" || variables.captureType === "finish") {
                void queryClient.invalidateQueries({
                    queryKey: courseProgressKeys.progress(type, variables.groupId),
                });
            }

            // Gọi onSuccess callback nếu có
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
