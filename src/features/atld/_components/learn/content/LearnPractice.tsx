import { ReactEventHandler, useEffect, useState } from "react";

import { Button, Card } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { useLearnContext } from "@/contexts/LearnContext";
import { courseProgressKeys, useUpdateProgress } from "@/hooks/api";
import VideoPlayer from "@/libs/player/VideoPlayer";

const LearnPractice = () => {
    const { learnDetail, progress } = useLearnContext();

    const queryClient = useQueryClient();

    // Ensure we have a valid video index and fallback to 0 if needed
    const videoIndex = progress.currentVideoIndex ?? 0;
    const currentVideo = learnDetail.practice.videos[videoIndex];

    // Check if current video is already completed
    const isCurrentVideoCompleted = progress.completedVideos.some(
        (completed) => completed.section === "practice" && completed.index === videoIndex
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
            (completed) => completed.section === "practice" && completed.index === videoIndex
        );

        if (!isVideoAlreadyCompleted) {
            // Update progress khi video kết thúc
            updateProgress({
                groupId: learnDetail.id,
                section: "practice",
                videoIndex: videoIndex,
                currentTime: 0,
                completedVideo: {
                    section: "practice",
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
        const totalVideos = learnDetail.practice.videos.length;

        if (nextVideoIndex < totalVideos) {
            // Move to next video in practice section
            updateProgress({
                groupId: learnDetail.id,
                section: "practice",
                videoIndex: nextVideoIndex,
                currentTime: 0,
            });
            setIsFinishVideo(false);
        } else {
            // All practice videos completed, move to exam section
            updateProgress({
                groupId: learnDetail.id,
                section: "exam",
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
            h="100%"
            className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 !p-0 sm:!p-4"
        >
            <div className="flex flex-col gap-4 h-full">
                <div className="flex-1 min-h-0">
                    <VideoPlayer
                        src={currentVideo?.url || learnDetail.practice.videos[0].url}
                        // canSeek={currentVideo?.canSeek || learnDetail.practice.videos[0].canSeek}
                        canSeek={true}
                        onEnded={handleVideoEndedInternal}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPaused}
                        onProgress={handleProgress}
                    />
                </div>

                <div className="space-y-2 flex-shrink-0 px-2 sm:px-0">
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
                        Video {videoIndex + 1} / {learnDetail.practice.videos.length}
                    </span>
                    <span>{isFinishVideo ? "✓ Hoàn thành" : "Đang học"}</span>
                </div>

                <div className="w-full flex justify-end flex-shrink-0 p-2 sm:p-0">
                    <Button
                        disabled={!isFinishVideo || isUpdatingProgress}
                        loading={isUpdatingProgress}
                        size="md"
                        className="px-6 lg:px-8 py-3 w-full sm:w-auto"
                        onClick={handleNextVideo}
                    >
                        Tiếp theo
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default LearnPractice;
