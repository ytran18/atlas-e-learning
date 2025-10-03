"use client";

import { useRef } from "react";

import Webcam from "react-webcam";

import { useCameraCapture } from "@/hooks/useCameraCapture";

import { CameraCaptureButton } from "../_components/cameraCaptureButton";
import { CameraUploadProgress } from "../_components/cameraUploadProgress";
import { CameraView } from "../_components/cameraView";
import { CapturedImagePreview } from "../_components/capturedImagePreview";

interface CameraCaptureProps {
    onUploadSuccess?: (fileKey: string, publicUrl?: string) => void;
    onUploadError?: (error: string) => void;
    autoUpload?: boolean;
    mirrored?: boolean;
}

export const CameraCapture = ({
    onUploadSuccess,
    onUploadError,
    autoUpload = true,
    mirrored = true,
}: CameraCaptureProps) => {
    const webcamRef = useRef<Webcam>(null);
    const { capturedImage, uploadProgress, captureImage, uploadImage, clearCapture } =
        useCameraCapture();

    const handleCapture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            captureImage(imageSrc);

            if (autoUpload) {
                const result = await uploadImage();
                if (result.success) {
                    onUploadSuccess?.(result.fileKey!, result.publicUrl);
                } else {
                    onUploadError?.(result.error!);
                }
            }
        }
    };

    const handleManualUpload = async () => {
        const result = await uploadImage();
        if (result.success) {
            onUploadSuccess?.(result.fileKey!, result.publicUrl);
        } else {
            onUploadError?.(result.error!);
        }
    };

    const isUploading = uploadProgress.status === "uploading";
    const isSuccess = uploadProgress.status === "success";

    return (
        <div className="camera-capture space-y-4">
            {!capturedImage ? (
                <>
                    <CameraView webcamRef={webcamRef} mirrored={mirrored} />
                    <div className="flex justify-center">
                        <CameraCaptureButton onCapture={handleCapture} disabled={isUploading} />
                    </div>
                </>
            ) : (
                <>
                    <CapturedImagePreview
                        imageSrc={capturedImage}
                        onRemove={clearCapture}
                        publicUrl={
                            isSuccess && uploadProgress.status === "success" ? undefined : undefined
                        }
                    />
                    <div className="flex justify-center gap-4">
                        <CameraCaptureButton onCapture={clearCapture} disabled={isUploading}>
                            Retake Photo
                        </CameraCaptureButton>
                        {!autoUpload && !isSuccess && (
                            <button
                                onClick={handleManualUpload}
                                disabled={isUploading}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                                type="button"
                            >
                                Upload Image
                            </button>
                        )}
                    </div>
                </>
            )}

            <CameraUploadProgress
                progress={uploadProgress.progress}
                status={uploadProgress.status}
                error={uploadProgress.error}
            />
        </div>
    );
};
