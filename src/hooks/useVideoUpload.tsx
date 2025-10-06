import { useCallback, useState } from "react";

import { uploadFile } from "@/libs/axios/axiosClient";

export interface UploadProgress {
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    error?: string;
}

export interface UploadResult {
    success: boolean;
    fileKey?: string;
    publicUrl?: string;
    uploadId?: string;
    error?: string;
}

export interface UseVideoUploadReturn {
    uploadProgress: UploadProgress;
    uploadVideo: (file: File, contentType?: string) => Promise<UploadResult>;
    resetUpload: () => void;
}

export const useVideoUpload = (): UseVideoUploadReturn => {
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        progress: 0,
        status: "idle",
    });

    const resetUpload = useCallback(() => {
        setUploadProgress({
            progress: 0,
            status: "idle",
        });
    }, []);

    const uploadVideo = useCallback(
        async (file: File, contentType = "video"): Promise<UploadResult> => {
            try {
                setUploadProgress({
                    progress: 0,
                    status: "uploading",
                });

                // Prepare FormData
                const formData = new FormData();
                formData.append("file", file);
                formData.append("contentType", contentType);

                // Upload with axios and progress tracking
                const response = await uploadFile(
                    "/api/upload/video",
                    formData,
                    (progressEvent) => {
                        const percentComplete = Math.round(progressEvent.progress);

                        console.log("Video upload progress:", {
                            loaded: progressEvent.loaded,
                            total: progressEvent.total,
                            percent: `${percentComplete}%`,
                        });

                        setUploadProgress({
                            progress: percentComplete,
                            status: "uploading",
                        });
                    }
                );

                // Check response
                if (response.data.success) {
                    setUploadProgress({
                        progress: 100,
                        status: "success",
                    });

                    return {
                        success: true,
                        fileKey: response.data.fileKey,
                        publicUrl: response.data.publicUrl,
                        uploadId: response.data.uploadId,
                    };
                } else {
                    throw new Error(response.data.error || "Upload failed");
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error occurred";

                setUploadProgress({
                    progress: 0,
                    status: "error",
                    error: errorMessage,
                });

                return {
                    success: false,
                    error: errorMessage,
                };
            }
        },
        []
    );

    return {
        uploadProgress,
        uploadVideo,
        resetUpload,
    };
};
