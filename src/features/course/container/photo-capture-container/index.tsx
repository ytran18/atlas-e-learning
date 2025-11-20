"use client";

import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";

import { useUser } from "@clerk/nextjs";

import { useStartCourse } from "@/api";
import { CourseType } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

import { ActionButtons } from "../../components/verify/action-buttons";
import { CameraPreview } from "../../components/verify/camera-preview";
import { CameraReadyIndicator } from "../../components/verify/camera-ready-indicator";
import { CaptureButton } from "../../components/verify/capture-button";
import { ErrorMessage } from "../../components/verify/error-message";
import { InstructionsCard } from "../../components/verify/instructions-card";
import { PhotoPreview } from "../../components/verify/photo-preview";
import { PrivacyNotice } from "../../components/verify/privacy-notice";
import { SuccessMessage } from "../../components/verify/success-message";
import { useCameraCapture } from "../../hooks";

interface PhotoCaptureContainerProps {
    courseType: CourseType;
    paramKey: string;
    learnPath: string;
}

const PhotoCaptureContainer = ({ courseType, paramKey, learnPath }: PhotoCaptureContainerProps) => {
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

    const { mutateAsync: startCourse, isPending: isStarting } = useStartCourse(courseType, {
        onSuccess: () => {
            router.push(learnPath.replace(`[${paramKey}]`, courseId));
        },
    });

    const handleUploadAndContinue = async () => {
        if (!capturedPhoto || !courseId || !user?.unsafeMetadata) return;

        try {
            await startCourse({
                groupId: courseId,
                portraitUrl: capturedPhoto,
                courseName: courseName as string,
                userFullname: user?.unsafeMetadata?.fullName as string,
                userBirthDate: user?.unsafeMetadata?.birthDate as string,
                userCompanyName: user?.unsafeMetadata?.companyName as string,
                userIdCard: user?.unsafeMetadata?.cccd as string,
            });
        } catch (err) {
            console.error("Error preparing photo upload:", err);
        }
    };

    const displayError = cameraError;

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
                            isUploading={isStarting}
                        />
                    )}
                </div>

                {/* Privacy Notice */}
                <PrivacyNotice />
            </div>
        </div>
    );
};

export default PhotoCaptureContainer;
