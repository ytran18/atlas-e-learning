/**
 * Video Upload Service
 *
 * Service for handling video upload operations using Axios
 */
import axios from "axios";

import { UploadResult } from "@/features/quan-tri/types/video";

// ============================================================================
// Video Upload API
// ============================================================================

/**
 * Upload video file to the server using Axios
 */
export async function uploadVideo(
    file: File,
    token: string,
    onProgress?: (progress: number) => void
): Promise<UploadResult> {
    const formData = new FormData();

    formData.append("video", file);

    try {
        const response = await axios.post<UploadResult>(
            "https://api.antoanlaodongso.com/api/video/upload",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                timeout: 300000, // 5 minutes timeout
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onProgress) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(progress);
                    }
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.error || "Upload failed";
                throw new Error(errorMessage);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error("Network error during upload");
            } else {
                // Something else happened
                throw new Error(error.message || "Upload failed");
            }
        }
        throw new Error("Upload failed");
    }
}

/**
 * Validate video file before upload
 */
export function validateVideoFile(file: File, maxSizeMB: number = 1000): string | null {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
        return `File quá lớn. Kích thước tối đa cho phép là ${maxSizeMB}MB`;
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
        return "File phải là định dạng video";
    }

    return null;
}
