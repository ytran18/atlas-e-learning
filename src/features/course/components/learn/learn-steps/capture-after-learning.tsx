import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys, useUpdateProgress, useUploadCapture } from "@/api";
import { useLearnContext } from "@/contexts/LearnContext";
import { useCameraCapture } from "@/features/course/hooks";
import { CourseType } from "@/types/api";

import { ActionButtons } from "../../verify/action-buttons";
import { CameraPreview } from "../../verify/camera-preview";
import { CameraReadyIndicator } from "../../verify/camera-ready-indicator";
import { CaptureButton } from "../../verify/capture-button";
import { ErrorMessage } from "../../verify/error-message";
import { PhotoPreview } from "../../verify/photo-preview";
import { SuccessMessage } from "../../verify/success-message";

type CaptureAfterLearningProps = {
    courseType: CourseType;
};

const CaptureAfterLearning = ({ courseType }: CaptureAfterLearningProps) => {
    const queryClient = useQueryClient();

    const { learnDetail } = useLearnContext();

    const {
        videoRef,
        canvasRef,
        capturedPhoto,
        isCameraReady,
        error: cameraError,
        capturePhoto,
        retakePhoto,
    } = useCameraCapture();

    const { mutateAsync: updateProgress, isPending } = useUpdateProgress(courseType);

    const { mutateAsync: uploadCapture, isPending: isUploadingCapture } =
        useUploadCapture(courseType);

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

    const displayError = cameraError;

    const handleFinishCoure = async () => {
        if (!capturedPhoto || !learnDetail.id) return;

        try {
            const res = await fetch(capturedPhoto);
            const blob = await res.blob();
            const file = new File([blob], `capture-${Date.now()}.png`, { type: "image/png" });

            const uploadRes = await uploadCapture({
                file,
                groupId: learnDetail.id,
                captureType: "capture-after-learning",
            });

            await updateProgress(
                {
                    groupId: learnDetail.id,
                    section: "exam",
                    videoIndex: 0,
                    currentTime: 0,
                    isCompleted: true,
                    captureAfterLearningImageUrl: uploadRes.imageUrl,
                },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: courseProgressKeys.progress(courseType, learnDetail.id),
                        });
                    },
                }
            );
        } catch (error) {
            console.log({ error });
            return undefined;
        }
    };

    return (
        <div className="bg-white flex-1 h-full rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-3 sm:p-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div
                className={`absolute top-0 right-0 w-48 h-48 bg-linear-to-br ${gradientColors.topRight} rounded-full opacity-5 -mr-24 -mt-24`}
            />

            <div
                className={`absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr ${gradientColors.bottomLeft} rounded-full opacity-5 -ml-16 -mb-16`}
            />

            <div className="relative z-10 h-full min-h-0 flex flex-col">
                <div className="mb-6 text-center px-4">
                    <span className="block text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-blue-600 mb-2">
                        Chúc mừng!
                    </span>
                    <span className="block text-gray-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                        Bạn chỉ còn 1 bước nữa để hoàn thành khóa học. Hãy chụp ảnh chân dung để
                        chứng minh rằng bạn đã học bài.
                    </span>
                </div>

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
                                courseType={"atld"}
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
                            onConfirm={handleFinishCoure}
                            isUploading={isPending || isUploadingCapture}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaptureAfterLearning;
