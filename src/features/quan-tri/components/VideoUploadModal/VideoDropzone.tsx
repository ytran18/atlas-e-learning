import { forwardRef, useImperativeHandle, useState } from "react";

import { Button } from "@mantine/core";
import { DropzoneProps, FileWithPath } from "@mantine/dropzone";

import { useVideoUpload } from "../../../../hooks/api/video/useVideoUpload";
import { useVideoProgress } from "../../hooks/useVideoProgress";
import { FinalResult, UploadResult } from "../../types/video";
import DropZoneBlock from "./DropZoneBlock";
import SelectFileBlock from "./SelectFileBlock";
import UploadErrorBlock from "./UploadErrorBlock";
import UploadProgressBlock from "./UploadProgressBlock";
import UploadedResultBlock from "./UploadedResultBlock";
import { VideoProgressComponent } from "./VideoProgressComponent";

interface VideoDropzoneProps extends Partial<DropzoneProps> {
    onFileSelect?: (file: File | null) => void;
    onUploadComplete?: (result: UploadResult) => void;
    maxSize?: number; // in MB
}

export interface VideoDropzoneRef {
    uploadVideo: () => Promise<void>;
    resetUpload: () => void;
    hasFile: boolean;
    isUploading: boolean;
    isUploaded: boolean;
}

const VideoDropzone = forwardRef<VideoDropzoneRef, VideoDropzoneProps>(
    ({ onFileSelect, onUploadComplete, maxSize = 1000, ...props }, ref) => {
        const [selectedFile, setSelectedFile] = useState<File | null>(null);

        const [uploadProgress, setUploadProgress] = useState(0);

        const [taskId, setTaskId] = useState<string | null>(null);

        // Video upload hook with React Query
        const {
            uploadVideo: uploadVideoMutation,
            isUploading,
            error: uploadError,
            reset: resetUploadMutation,
        } = useVideoUpload({
            maxSizeMB: maxSize,
            onSuccess: (result) => {
                console.log("Upload success:", result);
                // Set taskId for WebSocket progress tracking
                if (result.data?.taskId) {
                    setTaskId(result.data.taskId);
                    console.log("Task ID set for progress tracking:", result.data.taskId);
                }
            },
            onError: (error) => {
                console.error("Upload error:", error);
            },
            onProgress: (progress) => {
                setUploadProgress(progress);
            },
        });

        // WebSocket progress tracking
        const {
            progress,
            result,
            isConnected,
            error: wsError,
        } = useVideoProgress(taskId, (result: FinalResult) => {
            onUploadComplete?.({
                success: true,
                data: {
                    fileKey: result?.r2UploadResult?.key,
                    publicUrl: result?.r2UploadResult?.url,
                    taskId: result?.taskId,
                },
            });
        });

        // Manual upload function
        const uploadVideo = async () => {
            if (!selectedFile) {
                throw new Error("No file selected");
            }
            await uploadVideoMutation({ file: selectedFile });
        };

        // Reset function
        const resetUpload = () => {
            setSelectedFile(null);

            setUploadProgress(0);

            setTaskId(null);

            resetUploadMutation();

            onFileSelect?.(null);
        };

        // Expose methods to parent component
        useImperativeHandle(ref, () => ({
            uploadVideo,
            resetUpload,
            hasFile: !!selectedFile,
            isUploading,
            isUploaded: !!result,
        }));

        const handleDrop = async (files: FileWithPath[]) => {
            const file = files[0];

            if (!file) return;

            setSelectedFile(file);

            onFileSelect?.(file);
            // Note: No auto-upload - parent component will call uploadVideo() manually
        };

        const handleResetUpload = () => {
            resetUpload();
        };

        return (
            <div className="space-y-4">
                {!selectedFile && (
                    <DropZoneBlock onDrop={handleDrop} isUploading={isUploading} {...props} />
                )}

                {selectedFile && <SelectFileBlock selectedFile={selectedFile} />}

                {isUploading && <UploadProgressBlock uploadProgress={uploadProgress} />}

                {uploadError && <UploadErrorBlock uploadError={uploadError} />}

                {taskId && (
                    <VideoProgressComponent
                        progress={progress}
                        isConnected={isConnected}
                        error={wsError}
                    />
                )}

                {/* Final Result from WebSocket */}
                {result && <UploadedResultBlock result={result} />}

                {/* Reset Button */}
                {(selectedFile || uploadError) && !isUploading && !progress && (
                    <div className="flex justify-end">
                        <Button onClick={handleResetUpload}>Chọn file khác</Button>
                    </div>
                )}
            </div>
        );
    }
);

VideoDropzone.displayName = "VideoDropzone";

export default VideoDropzone;
