"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { ATLD_SLUG, navigationPaths } from "@/utils/navigationPaths";

import { ActionButtons } from "../_components/verify/ActionButtons";
import { CameraPreview } from "../_components/verify/CameraPreview";
import { CameraReadyIndicator } from "../_components/verify/CameraReadyIndicator";
import { CaptureButton } from "../_components/verify/CaptureButton";
import { ErrorMessage } from "../_components/verify/ErrorMessage";
import { InstructionsCard } from "../_components/verify/InstructionsCard";
import { PhotoPreview } from "../_components/verify/PhotoPreview";
import { PrivacyNotice } from "../_components/verify/PrivacyNotice";
import { SuccessMessage } from "../_components/verify/SuccessMessage";
import { useCameraCapture } from "../hooks/useCameraCapture";

interface PhotoCaptureContainerProps {
    courseId: number;
}

export const PhotoCaptureContainer = ({ courseId }: PhotoCaptureContainerProps) => {
    const router = useRouter();

    const { atldId } = useParams();

    const [isUploading, setIsUploading] = useState(false);

    const [uploadError, setUploadError] = useState<string | null>(null);

    const {
        videoRef,
        canvasRef,
        capturedPhoto,
        isCameraReady,
        error: cameraError,
        capturePhoto,
        retakePhoto,
    } = useCameraCapture();

    const handleUploadAndContinue = async () => {
        if (!capturedPhoto) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            // Convert data URL to blob
            const response = await fetch(capturedPhoto);

            const blob = await response.blob();

            // Create form data
            const formData = new FormData();

            formData.append("photo", blob, `verification-${Date.now()}.jpg`);

            // Upload to server
            const uploadResponse = await fetch("/api/upload-photo", {
                method: "POST",
                body: formData,
            });

            router.push(navigationPaths.ATLD_LEARN.replace(`[${ATLD_SLUG}]`, atldId as string));

            // if (!uploadResponse.ok) {
            //     throw new Error("Failed to upload photo");
            // }

            const data = await uploadResponse.json();

            console.log("[v0] Photo uploaded:", data.url);

            // Store photo URL in localStorage (or you can send it to your backend)
            localStorage.setItem(`course-${courseId}-verification`, data.url);

            // Redirect to learning page
            router.push(`/safety-training/${courseId}/learn`);
        } catch (err) {
            console.error("Error uploading photo:", err);

            setUploadError("Không thể tải ảnh lên. Vui lòng thử lại.");

            setIsUploading(false);
        }
    };

    const displayError = cameraError || uploadError;

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-3 sm:p-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-5 -mr-24 -mt-24" />

            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-5 -ml-16 -mb-16" />

            <div className="relative z-10">
                {/* Instructions Section - Hidden on mobile */}
                {!capturedPhoto && <InstructionsCard />}

                {/* Success Message */}
                {capturedPhoto && <SuccessMessage />}

                {/* Error Message */}
                {displayError && <ErrorMessage message={displayError} />}

                {/* Camera/Photo Preview */}
                <div className="relative mb-3 sm:mb-6 group">
                    <div className="relative aspect-[3/4] sm:aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                        {!capturedPhoto ? (
                            <CameraPreview videoRef={videoRef} isCameraReady={isCameraReady} />
                        ) : (
                            <PhotoPreview photoUrl={capturedPhoto} />
                        )}
                    </div>

                    {/* Camera Ready Indicator */}
                    {!capturedPhoto && isCameraReady && <CameraReadyIndicator />}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {/* Action Buttons */}
                <div className="flex items-center justify-center">
                    {!capturedPhoto ? (
                        <CaptureButton onClick={capturePhoto} disabled={!isCameraReady} />
                    ) : (
                        <ActionButtons
                            onRetake={retakePhoto}
                            onConfirm={handleUploadAndContinue}
                            isUploading={isUploading}
                        />
                    )}
                </div>

                {/* Privacy Notice */}
                <PrivacyNotice />
            </div>
        </div>
    );
};
