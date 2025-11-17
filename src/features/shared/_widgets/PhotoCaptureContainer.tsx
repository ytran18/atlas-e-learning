"use client";

import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";

import { useUser } from "@clerk/nextjs";

import { useStartCourse } from "@/api";
import { useUploadCapture } from "@/api/user/useUploadCapture";
import { navigationPaths } from "@/utils/navigationPaths";

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
import { CourseType } from "../types";

interface PhotoCaptureContainerProps {
    courseType: CourseType;
    paramKey: string;
    learnPath: string;
}

export const PhotoCaptureContainer = ({
    courseType,
    paramKey,
    learnPath,
}: PhotoCaptureContainerProps) => {
    const { user } = useUser();

    const router = useRouter();

    const params = useParams();

    const searchParams = useSearchParams();

    const courseName = searchParams.get("name");

    const courseId = params[paramKey] as string;

    const {
        videoRef,
        canvasRef,
        capturedPhoto,
        isCameraReady,
        error: cameraError,
        capturePhoto,
        retakePhoto,
    } = useCameraCapture();

    // Hook để upload ảnh lên Cloudflare R2
    const {
        mutateAsync: uploadCapture,
        isPending: isUploading,
        error: uploadError,
    } = useUploadCapture(courseType, {
        onSuccess: (data) => {
            console.log("[v0] Photo uploaded successfully:", data.imageUrl);
            // Navigate to learning page after successful upload
            router.push(learnPath.replace(`[${paramKey}]`, courseId));
        },
        onError: (error) => {
            console.error("[v0] Error uploading photo:", error);
        },
    });

    const { mutateAsync: startCourse, isPending: isStarting } = useStartCourse(courseType);

    /**
     * Convert data URL to File object
     */
    const dataURLtoFile = (dataUrl: string, filename: string): File => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };

    const handleUploadAndContinue = async () => {
        if (!capturedPhoto || !courseId || !user?.unsafeMetadata) return;

        try {
            // Convert data URL to File
            const file = dataURLtoFile(capturedPhoto, `verification-${Date.now()}.jpg`);

            // Upload using the hook
            await uploadCapture({
                file,
                groupId: courseId,
                captureType: "start", // Ảnh verification trước khi bắt đầu
            });

            await startCourse({
                groupId: courseId,
                portraitUrl: capturedPhoto,
                courseName: courseName as string,
                userFullname: user?.unsafeMetadata?.fullName as string,
                userBirthDate: user?.unsafeMetadata?.birthDate as string,
                userCompanyName: user?.unsafeMetadata?.companyName as string,
                cccd: user?.unsafeMetadata?.cccd as string,
                userIdCard: user?.unsafeMetadata?.cccd as string,
            });
        } catch (err) {
            console.error("Error preparing photo upload:", err);
        }
    };

    const displayError = cameraError || uploadError?.message;

    const getGradientColors = () => {
        switch (courseType) {
            case "atld":
                return {
                    topRight: "from-green-400 to-blue-400",
                    bottomLeft: "from-purple-400 to-pink-400",
                };
            case "hoc-nghe":
                return {
                    topRight: "from-green-400 to-emerald-400",
                    bottomLeft: "from-green-400 to-emerald-400",
                };
            default:
                return {
                    topRight: "from-green-400 to-blue-400",
                    bottomLeft: "from-purple-400 to-pink-400",
                };
        }
    };

    const gradientColors = getGradientColors();

    if (!courseName) {
        redirect(navigationPaths.LANDING_PAGE);
    }

    return (
        <div className="bg-white flex-1 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-3 sm:p-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div
                className={`absolute top-0 right-0 w-48 h-48 bg-linear-to-br ${gradientColors.topRight} rounded-full opacity-5 -mr-24 -mt-24`}
            />
            <div
                className={`absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr ${gradientColors.bottomLeft} rounded-full opacity-5 -ml-16 -mb-16`}
            />

            <div className="relative z-10 h-full min-h-0 flex flex-col">
                {/* Instructions Section - Hidden on mobile */}
                {!capturedPhoto && <InstructionsCard />}

                {/* Success Message */}
                {capturedPhoto && <SuccessMessage />}

                {/* Error Message */}
                {displayError && <ErrorMessage message={displayError} />}

                {/* Camera/Photo Preview */}
                <div className="relative mb-3 sm:mb-6 group flex-1 min-h-0">
                    <div className="relative h-full w-full sm:aspect-video bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                        {!capturedPhoto ? (
                            <CameraPreview
                                videoRef={videoRef}
                                isCameraReady={isCameraReady}
                                courseType={courseType}
                            />
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
                            isUploading={isUploading || isStarting}
                        />
                    )}
                </div>

                {/* Privacy Notice */}
                <PrivacyNotice />
            </div>
        </div>
    );
};
