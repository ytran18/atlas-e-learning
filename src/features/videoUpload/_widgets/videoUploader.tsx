"use client";

import { useState } from "react";

import { useVideoUpload } from "@/hooks/useVideoUpload";

import { VideoUploadButton } from "../_components/VideoUploadButton";
import { ProgressiveVideoPlayer } from "../_components/progressiveVideoPlayer";
import { VideoUploadProgress } from "../_components/videoUploadProgress";

interface VideoUploaderProps {
    onUploadSuccess?: (fileKey: string, publicUrl?: string, uploadId?: string) => void;
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
    accept = "video/mp4,video/webm,video/ogg",
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
            onUploadSuccess?.(result.fileKey!, result.publicUrl, result.uploadId);
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
        <div className="video-uploader w-full max-w-2xl mx-auto space-y-4">
            <VideoUploadButton
                onFileSelect={handleFileSelect}
                disabled={isUploading}
                accept={accept}
                maxSize={maxSize}
            >
                {selectedFile ? "Change Video" : "Select Video"}
            </VideoUploadButton>

            {selectedFile && !uploadedUrl && (
                <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Selected:</span> {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                </div>
            )}

            <VideoUploadProgress
                progress={uploadProgress.progress}
                status={uploadProgress.status}
                error={uploadProgress.error}
                fileName={selectedFile?.name}
            />

            {uploadedUrl && isSuccess && (
                <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-green-800 mb-2">
                            ✅ Video uploaded successfully!
                        </h3>
                        <p className="text-xs text-green-700 break-all mb-2">
                            <span className="font-semibold">Video URL:</span> {uploadedUrl}
                        </p>
                        <p className="text-xs text-green-600">
                            💡 Video supports progressive loading - plays while downloading!
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Preview (Progressive Streaming):
                        </h4>
                        <ProgressiveVideoPlayer
                            src={uploadedUrl}
                            controls
                            className="shadow-lg"
                            onError={(error) => {
                                console.error("Player error:", error);
                                onUploadError?.(error);
                            }}
                            onLoadProgress={(percent) => {
                                console.log(`Video buffered: ${percent}%`);
                            }}
                        />
                    </div>

                    <button
                        onClick={handleRemove}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        type="button"
                    >
                        Upload Another Video
                    </button>
                </div>
            )}

            {!autoUpload && selectedFile && !isSuccess && (
                <button
                    onClick={() => handleUpload()}
                    disabled={isUploading}
                    type="button"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isUploading ? "Uploading..." : "Upload Video"}
                </button>
            )}
        </div>
    );
};
