import { useCallback, useState } from "react";

export interface UploadProgress {
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    error?: string;
}

export interface UploadResult {
    success: boolean;
    fileKey?: string;
    publicUrl?: string;
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

                // Upload directly to server-side API with progress tracking
                const result = await new Promise<{ fileKey: string; publicUrl?: string }>(
                    (resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("contentType", contentType);

                        xhr.upload.addEventListener("progress", (event) => {
                            if (event.lengthComputable) {
                                const percentComplete = Math.round(
                                    (event.loaded / event.total) * 100
                                );
                                setUploadProgress({
                                    progress: percentComplete,
                                    status: "uploading",
                                });
                            }
                        });

                        xhr.addEventListener("load", () => {
                            if (xhr.status === 200) {
                                const response = JSON.parse(xhr.responseText);
                                if (response.success) {
                                    resolve({
                                        fileKey: response.fileKey,
                                        publicUrl: response.publicUrl,
                                    });
                                } else {
                                    reject(new Error(response.error || "Upload failed"));
                                }
                            } else {
                                reject(new Error(`Upload failed with status: ${xhr.status}`));
                            }
                        });

                        xhr.addEventListener("error", () => {
                            reject(new Error("Network error during upload"));
                        });

                        xhr.addEventListener("abort", () => {
                            reject(new Error("Upload aborted"));
                        });

                        xhr.open("POST", "/api/upload/direct");
                        xhr.send(formData);
                    }
                );

                // Success
                setUploadProgress({
                    progress: 100,
                    status: "success",
                });

                return {
                    success: true,
                    fileKey: result.fileKey,
                    publicUrl: result.publicUrl,
                };
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
