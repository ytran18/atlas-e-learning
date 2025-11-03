/**
 * Custom hook for video upload using React Query
 */
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

import { UploadResult } from "@/features/quan-tri/types/video";
import { uploadVideo, validateVideoFile } from "@/services";

interface UseVideoUploadOptions {
    maxSizeMB?: number;
    onSuccess?: (result: UploadResult) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
}

interface VideoUploadParams {
    file: File;
}

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
    const { getToken } = useAuth();
    const { maxSizeMB = 90, onSuccess, onError, onProgress } = options;

    const mutation = useMutation({
        mutationFn: async ({ file }: VideoUploadParams): Promise<UploadResult> => {
            // Validate file before upload
            const validationError = validateVideoFile(file, maxSizeMB);
            if (validationError) {
                throw new Error(validationError);
            }

            // Get auth token
            const token = await getToken({
                template: "default-auth",
            });
            if (!token) {
                throw new Error("No authentication token available");
            }

            // Upload video with progress tracking
            return uploadVideo(file, token, onProgress);
        },
        onSuccess: (result) => {
            onSuccess?.(result);
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });

    return {
        uploadVideo: mutation.mutate,
        uploadVideoAsync: mutation.mutateAsync,
        isUploading: mutation.isPending,
        uploadProgress: 0, // Progress is handled by onProgress callback
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}
