import { useCallback, useRef, useState } from "react";

export interface CaptureProgress {
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    error?: string;
}

export interface CaptureResult {
    success: boolean;
    fileKey?: string;
    publicUrl?: string;
    error?: string;
}

export interface UseCameraCaptureReturn {
    capturedImage: string | null;
    uploadProgress: CaptureProgress;
    captureImage: (imageSrc: string) => void;
    uploadImage: () => Promise<CaptureResult>;
    clearCapture: () => void;
    resetUpload: () => void;
}

export const useCameraCapture = (): UseCameraCaptureReturn => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<CaptureProgress>({
        progress: 0,
        status: "idle",
    });
    const imageDataRef = useRef<string | null>(null);

    const captureImage = useCallback((imageSrc: string) => {
        setCapturedImage(imageSrc);
        imageDataRef.current = imageSrc;
    }, []);

    const clearCapture = useCallback(() => {
        setCapturedImage(null);
        imageDataRef.current = null;
        setUploadProgress({
            progress: 0,
            status: "idle",
        });
    }, []);

    const resetUpload = useCallback(() => {
        setUploadProgress({
            progress: 0,
            status: "idle",
        });
    }, []);

    const uploadImage = useCallback(async (): Promise<CaptureResult> => {
        if (!imageDataRef.current) {
            return {
                success: false,
                error: "No image captured",
            };
        }

        try {
            setUploadProgress({
                progress: 0,
                status: "uploading",
            });

            // Convert base64 to blob
            const base64Data = imageDataRef.current.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/jpeg" });

            // Create File from Blob
            const file = new File([blob], `capture-${Date.now()}.jpg`, {
                type: "image/jpeg",
            });

            // Upload to server with progress tracking
            const result = await new Promise<{ fileKey: string; publicUrl?: string }>(
                (resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("contentType", "image");

                    xhr.upload.addEventListener("progress", (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 100);
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
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

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
    }, []);

    return {
        capturedImage,
        uploadProgress,
        captureImage,
        uploadImage,
        clearCapture,
        resetUpload,
    };
};
