import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys, useUpdateProgress } from "@/api";
import { useLearnContext } from "@/contexts/LearnContext";
import { useAutoCapture } from "@/features/course/hooks/useAutoCapture";
import { COURSE_THEMES } from "@/features/course/types";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import VideoPlayer from "@/libs/player/VideoPlayer";
import { CourseType } from "@/types/api";

import LearnInfo from "../learn-info";
import LearnNextButton from "../learn-next-button";
import LearnView from "../learn-view";

interface LearnPracticeProps {
    courseType: CourseType;
}

const LearnPractice = ({ courseType }: LearnPracticeProps) => {
    const { t } = useI18nTranslate();

    const { learnDetail, progress, currentVideoIndex, navigateToVideo, navigateToExam } =
        useLearnContext();

    const router = useRouter();

    const queryClient = useQueryClient();

    const searchParams = useSearchParams();

    const theme = COURSE_THEMES[courseType];

    const videoIndex = currentVideoIndex;

    const currentVideo = learnDetail.practice.videos[videoIndex];

    const sectionDB = searchParams.get("section");

    const videoIndexDB = searchParams.get("video");

    const isShowNextButton = useMemo(() => {
        return sectionDB === "practice" && Number(videoIndexDB) === videoIndex;
    }, [sectionDB, videoIndexDB, videoIndex]);

    const hasCaptured = !!progress.finishImageUrl;

    const isCurrentVideoCompleted = useMemo(
        () =>
            progress.completedVideos.some(
                (c) => c.section === "practice" && c.index === videoIndex
            ),
        [progress.completedVideos, videoIndex]
    );

    const [isFinishVideo, setIsFinishVideo] = useState<boolean>(isCurrentVideoCompleted);

    useEffect(() => {
        setIsFinishVideo(isCurrentVideoCompleted);
    }, [isCurrentVideoCompleted, videoIndex]);

    const totalTheory = learnDetail?.theory?.videos?.length ?? 0;

    const totalPractice = learnDetail?.practice?.videos?.length ?? 0;

    const totalVideos = totalTheory + totalPractice;

    const videoRef = useRef<HTMLVideoElement | null>(null);

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

    const handleVideoEnded = () => {
        setIsFinishVideo(true);
        const already = progress.completedVideos.some(
            (c) => c.section === "practice" && c.index === videoIndex
        );
        if (!already) {
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

    const handleNextVideo = () => {
        const nextVideoIndex = videoIndex + 1;
        const total = learnDetail.practice.videos.length;

        if (nextVideoIndex < total) {
            updateProgress({
                groupId: learnDetail.id,
                section: "practice",
                videoIndex: nextVideoIndex,
                currentTime: 0,
            });
            navigateToVideo("practice", nextVideoIndex);
            router.replace(`?section=practice&video=${nextVideoIndex}`);
            setIsFinishVideo(false);
            return;
        }

        if (learnDetail?.exam?.questions?.length > 0) {
            updateProgress({
                groupId: learnDetail.id,
                section: "exam",
                videoIndex: 0,
                currentTime: 0,
            });
            navigateToExam();
            router.replace(`?section=exam&video=0`);
            return;
        }

        updateProgress({
            groupId: learnDetail.id,
            section: "theory",
            isCompleted: true,
            videoIndex,
            currentTime: 0,
        });
    };

    const onPlayerProgress = useAutoCapture({
        videoRef,
        courseType,
        learnDetailId: learnDetail.id,
        sectionKey: "practice",
        videoIndex,
        hasCaptured,
        totalVideos,
    });

    const buttonText = useMemo(() => {
        if (learnDetail.practice.videos.length > 0) return t("tiep_theo");
        if (learnDetail.exam.questions.length > 0) return t("chuyen_sang_bai_kiem_tra");
        return t("hoan_thanh_khoa_hoc");
    }, [learnDetail.practice.videos.length, learnDetail.exam.questions.length, t]);

    return (
        <LearnView
            gradientClass={theme.gradient}
            videoSlot={
                <div className="min-h-0">
                    <VideoPlayer
                        src={currentVideo?.url || learnDetail.practice.videos?.[0]?.url}
                        canSeek={
                            currentVideo?.canSeek ||
                            learnDetail.practice.videos?.[0]?.canSeek ||
                            progress?.isCompleted
                        }
                        isUsingLink={
                            currentVideo?.isUsingLink ||
                            learnDetail.practice.videos?.[0]?.isUsingLink
                        }
                        onEnded={handleVideoEnded}
                        onProgress={onPlayerProgress}
                        videoRef={videoRef}
                    />
                </div>
            }
            infoSlot={
                <LearnInfo
                    title={currentVideo?.title || learnDetail.practice.videos?.[0]?.title}
                    description={currentVideo?.description}
                    currentIndex={videoIndex}
                    total={learnDetail.practice.videos.length}
                    isFinished={isFinishVideo}
                />
            }
            nextButtonSlot={
                <LearnNextButton
                    show={isShowNextButton}
                    disabled={!isFinishVideo || isUpdatingProgress}
                    loading={isUpdatingProgress}
                    text={buttonText}
                    onClick={handleNextVideo}
                />
            }
        />
    );
};

export default LearnPractice;
