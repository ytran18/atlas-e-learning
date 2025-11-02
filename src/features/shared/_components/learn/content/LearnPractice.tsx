import { ReactEventHandler, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Card } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys, useUpdateProgress } from "@/api/user";
import { useLearnContext } from "@/contexts/LearnContext";
import VideoPlayer from "@/libs/player/VideoPlayer";

import { COURSE_THEMES, CourseType } from "../../../types";

interface LearnPracticeProps {
    courseType: CourseType;
}

const LearnPractice = ({ courseType }: LearnPracticeProps) => {
    const { learnDetail, progress, currentVideoIndex, navigateToVideo, navigateToExam } =
        useLearnContext();

    const queryClient = useQueryClient();

    const router = useRouter();

    const theme = COURSE_THEMES[courseType];

    const searchParams = useSearchParams();

    const sectionDB = searchParams.get("section");

    const videoIndexDB = searchParams.get("video");

    // Use client-side video index
    const videoIndex = currentVideoIndex;

    const currentVideo = learnDetail.practice.videos[videoIndex];

    const isShowNextButton = sectionDB === "practice" && Number(videoIndexDB) === videoIndex;

    // Check if current video is already completed
    const isCurrentVideoCompleted = progress.completedVideos.some(
        (completed) => completed.section === "practice" && completed.index === videoIndex
    );

    const [isFinishVideo, setIsFinishVideo] = useState<boolean>(isCurrentVideoCompleted);

    // Update isFinishVideo state when current video changes
    useEffect(() => {
        setIsFinishVideo(isCurrentVideoCompleted);
    }, [isCurrentVideoCompleted]);

    // Reset video state when video index changes
    useEffect(() => {
        setIsFinishVideo(isCurrentVideoCompleted);
    }, [videoIndex, isCurrentVideoCompleted]);

    // Hook để update progress
    const { mutate: updateProgress, isPending: isUpdatingProgress } = useUpdateProgress(
        courseType,
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: courseProgressKeys.progress(courseType, learnDetail.id),
                });
            },
            onError: (error) => {
                console.error("Failed to update progress:", error);
            },
        }
    );

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

    const handleProgress: ReactEventHandler<HTMLVideoElement> = () => {};

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
            // Update local state immediately for better UX
            navigateToVideo("practice", nextVideoIndex);
            // Update URL
            router.replace(`?section=practice&video=${nextVideoIndex}`);
            setIsFinishVideo(false);
        } else {
            // All practice videos completed, move to exam section
            updateProgress({
                groupId: learnDetail.id,
                section: "exam",
                videoIndex: 0,
                currentTime: 0,
            });
            // Update local state immediately for better UX
            navigateToExam();
            // Update URL
            router.replace(`?section=exam&video=0`);
        }
    };

    return (
        <Card
            withBorder
            shadow="sm"
            radius="md"
            h="100%"
            className={`bg-gradient-to-br ${theme.gradient} !p-0 sm:!p-4`}
        >
            <div className="flex flex-col gap-4 h-full">
                <div className="flex-1 min-h-0">
                    <VideoPlayer
                        src={currentVideo?.url || learnDetail.practice.videos?.[0]?.url}
                        canSeek={currentVideo?.canSeek || learnDetail.practice.videos?.[0]?.canSeek}
                        onEnded={handleVideoEndedInternal}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPaused}
                        onProgress={handleProgress}
                    />
                </div>

                <div className="space-y-2 flex-shrink-0 px-2 sm:px-0">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                        {currentVideo?.title || learnDetail.practice.videos?.[0]?.title}
                    </h3>
                    {currentVideo?.description && (
                        <p className="text-sm lg:text-base text-gray-600">
                            {currentVideo.description}
                        </p>
                    )}
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between text-sm text-gray-500 flex-shrink-0 px-2 sm:px-0 mb-3">
                    <span>
                        Video {videoIndex + 1} / {learnDetail.practice.videos.length}
                    </span>
                    <span>{isFinishVideo ? "✓ Hoàn thành" : "Đang học"}</span>
                </div>

                {isShowNextButton && (
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
                )}
            </div>
        </Card>
    );
};

export default LearnPractice;
