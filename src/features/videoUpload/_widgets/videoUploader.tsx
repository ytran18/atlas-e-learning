"use client";

import { useState } from "react";

import { useVideoUpload } from "@/hooks/useVideoUpload";

import { VideoPreview } from "../_components/videoPreview";
import { VideoUploadButton } from "../_components/videoUploadButton";
import { VideoUploadProgress } from "../_components/videoUploadProgress";

interface VideoUploaderProps {
    onUploadSuccess?: (fileKey: string, publicUrl?: string) => void;
    onUploadError?: (error: string) => void;
    contentType?: string;
    maxSize?: number; // in MB
    accept?: string;
    autoUpload?: boolean;
}

export const VideoUploader = ({
    onUploadSuccess,
    onUploadError,
    contentType = "video",
    maxSize = 500,
    accept = "video/*",
    autoUpload = true,
}: VideoUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>();

    const { uploadProgress, uploadVideo, resetUpload } = useVideoUpload();

    const handleFileSelect = async (file: File) => {
        setSelectedFile(file);
        setUploadedUrl(undefined);
        resetUpload();

        if (autoUpload) {
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File = selectedFile!) => {
        if (!file) return;

        const result = await uploadVideo(file, contentType);

        if (result.success) {
            setUploadedUrl(result.publicUrl);
            onUploadSuccess?.(result.fileKey!, result.publicUrl);
        } else {
            onUploadError?.(result.error!);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setUploadedUrl(undefined);
        resetUpload();
    };

    const isUploading = uploadProgress.status === "uploading";
    const isSuccess = uploadProgress.status === "success";

    return (
        <div className="video-uploader">
            <VideoUploadButton
                onFileSelect={handleFileSelect}
                disabled={isUploading}
                accept={accept}
                maxSize={maxSize}
            >
                {selectedFile ? "Change Video" : "Select Video"}
            </VideoUploadButton>

            {selectedFile && (
                <VideoPreview file={selectedFile} publicUrl={uploadedUrl} onRemove={handleRemove} />
            )}

            <VideoUploadProgress
                progress={uploadProgress.progress}
                status={uploadProgress.status}
                error={uploadProgress.error}
                fileName={selectedFile?.name}
            />

            {!autoUpload && selectedFile && !isSuccess && (
                <button onClick={() => handleUpload()} disabled={isUploading} type="button">
                    Upload Video
                </button>
            )}
        </div>
    );
};
