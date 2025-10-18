import { ReactEventHandler, useEffect, useState } from "react";

import { Button, Card } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { useLearnContext } from "@/contexts/LearnContext";
import { courseProgressKeys, useUpdateProgress } from "@/hooks/api";
import VideoPlayer from "@/libs/player/VideoPlayer";

const LearnTheory = () => {
    const { learnDetail, progress } = useLearnContext();

    const queryClient = useQueryClient();

    // Ensure we have a valid video index and fallback to 0 if needed
    const videoIndex = progress.currentVideoIndex ?? 0;
    const currentVideo = learnDetail.theory.videos[videoIndex];

    // Check if current video is already completed
    const isCurrentVideoCompleted = progress.completedVideos.some(
        (completed) => completed.section === "theory" && completed.index === videoIndex
    );

    const [isFinishVideo, setIsFinishVideo] = useState<boolean>(isCurrentVideoCompleted);

    // Update isFinishVideo state when current video changes
    useEffect(() => {
        setIsFinishVideo(isCurrentVideoCompleted);
    }, [isCurrentVideoCompleted]);

    // Hook để update progress
    const { mutate: updateProgress, isPending: isUpdatingProgress } = useUpdateProgress("atld", {
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: courseProgressKeys.progress("atld", learnDetail.id),
            });
        },
        onError: (error) => {
            console.error("Failed to update progress:", error);
        },
    });

    const handleVideoPlay = () => {};

    const handleVideoEndedInternal = () => {
        setIsFinishVideo(true);

        // Check if this video is already completed to avoid duplicate API calls
        const isVideoAlreadyCompleted = progress.completedVideos.some(
            (completed) => completed.section === "theory" && completed.index === videoIndex
        );

        if (!isVideoAlreadyCompleted) {
            // Update progress khi video kết thúc
            updateProgress({
                groupId: learnDetail.id,
                section: "theory",
                videoIndex: videoIndex,
                currentTime: 0,
                completedVideo: {
                    section: "theory",
                    index: videoIndex,
                },
            });
        }
    };

    const handleVideoPaused = () => {
        console.log("video paused");
    };

    const handleProgress: ReactEventHandler<HTMLVideoElement> = (event) => {
        const currentTime = (event.target as HTMLVideoElement).currentTime;
        console.log("currentTime", currentTime);
    };

    const handleNextVideo = () => {
        const nextVideoIndex = videoIndex + 1;

        const totalVideos = learnDetail.theory.videos.length;

        if (nextVideoIndex < totalVideos) {
            // Move to next video in theory section
            updateProgress({
                groupId: learnDetail.id,
                section: "theory",
                videoIndex: nextVideoIndex,
                currentTime: 0,
            });
            setIsFinishVideo(false);
        } else {
            // All theory videos completed, move to practice section
            updateProgress({
                groupId: learnDetail.id,
                section: "practice",
                videoIndex: 0,
                currentTime: 0,
            });
        }
    };

    return (
        <Card
            withBorder
            shadow="sm"
            radius="md"
            padding="lg"
            h="100%"
            className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 !p-0 sm:!p-4"
        >
            <div className="flex flex-col gap-4 lg:gap-6 h-full">
                {/* Video Player Container */}
                <div className="flex-1 min-h-0">
                    <VideoPlayer
                        src={currentVideo?.url || learnDetail.theory.videos[0].url}
                        canSeek={currentVideo?.canSeek || learnDetail.theory.videos[0].canSeek}
                        onEnded={handleVideoEndedInternal}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPaused}
                        onProgress={handleProgress}
                    />
                </div>

                {/* Video Info and Navigation */}
                <div className="flex-shrink-0 space-y-4 px-2 sm:px-0">
                    {/* Video Title and Description */}
                    <div className="space-y-2">
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                            {currentVideo?.title || learnDetail.theory.videos[0].title}
                        </h3>
                        {currentVideo?.description && (
                            <p className="text-sm lg:text-base text-gray-600">
                                {currentVideo.description}
                            </p>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between text-sm text-gray-500 flex-shrink-0 px-2 sm:px-0">
                        <span>
                            Video {videoIndex + 1} / {learnDetail.theory.videos.length}
                        </span>
                        <span>{isFinishVideo ? "✓ Hoàn thành" : "Đang học"}</span>
                    </div>

                    {/* Navigation Button */}
                    <div className="w-full flex justify-end flex-shrink-0 p-2 sm:p-0">
                        <Button
                            disabled={!isFinishVideo || isUpdatingProgress}
                            loading={isUpdatingProgress}
                            size="md"
                            className="px-6 lg:px-8 py-3 w-full sm:w-auto"
                            onClick={handleNextVideo}
                        >
                            {videoIndex + 1 < learnDetail.theory.videos.length
                                ? "Video tiếp theo"
                                : "Chuyển sang thực hành"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LearnTheory;
