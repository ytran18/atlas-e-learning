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
            padding="xl"
            h="100%"
            className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20"
        >
            <div className="flex flex-col gap-6 h-[calc(100%-24px)]">
                <VideoPlayer
                    src={currentVideo?.url || learnDetail.theory.videos[0].url}
                    canSeek={currentVideo?.canSeek || learnDetail.theory.videos[0].canSeek}
                    onEnded={handleVideoEndedInternal}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPaused}
                    onProgress={handleProgress}
                />

                <div className="w-full flex justify-end">
                    <Button
                        disabled={!isFinishVideo || isUpdatingProgress}
                        loading={isUpdatingProgress}
                        size="md"
                        className="px-8 py-3"
                        onClick={handleNextVideo}
                    >
                        Tiếp theo
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default LearnTheory;
