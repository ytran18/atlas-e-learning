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

interface LearnTheoryProps {
    courseType: CourseType;
}

const LearnTheory = ({ courseType }: LearnTheoryProps) => {
    const { t } = useI18nTranslate();

    const { learnDetail, progress, currentVideoIndex, navigateToVideo, navigateToExam } =
        useLearnContext();

    const router = useRouter();

    const queryClient = useQueryClient();

    const searchParams = useSearchParams();

    const theme = COURSE_THEMES[courseType];

    const videoIndex = currentVideoIndex;

    const currentVideo = learnDetail.theory.videos[videoIndex];

    const sectionDB = searchParams.get("section");

    const videoIndexDB = searchParams.get("video");

    const isShowNextButton = useMemo(() => {
        return sectionDB === "theory" && Number(videoIndexDB) === videoIndex;
    }, [sectionDB, videoIndexDB, videoIndex]);

    const hasCaptured = !!progress.finishImageUrl;

    const isCurrentVideoCompleted = useMemo(
        () =>
            progress.completedVideos.some((c) => c.section === "theory" && c.index === videoIndex),
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

    // stable handlers
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
            (c) => c.section === "theory" && c.index === videoIndex
        );

        if (!already) {
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

    const handleNextVideo = () => {
        const nextVideoIndex = videoIndex + 1;

        const total = learnDetail.theory.videos.length;

        if (nextVideoIndex < total) {
            updateProgress({
                groupId: learnDetail.id,
                section: "theory",
                videoIndex: nextVideoIndex,
                currentTime: 0,
            });

            navigateToVideo("theory", nextVideoIndex);

            router.replace(`?section=theory&video=${nextVideoIndex}`);

            setIsFinishVideo(false);

            return;
        }

        if (learnDetail?.practice?.videos?.length > 0) {
            updateProgress({
                groupId: learnDetail.id,
                section: "practice",
                videoIndex: 0,
                currentTime: 0,
            });

            navigateToVideo("practice", 0);

            router.replace(`?section=practice&video=0`);

            return;
        }

        if (learnDetail?.exam?.questions?.length > 0) {
            navigateToExam();

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

    // Auto capture (timeupdate + deterministic target)
    const onPlayerProgress = useAutoCapture({
        videoRef,
        courseType,
        learnDetailId: learnDetail.id,
        sectionKey: "theory",
        videoIndex,
        hasCaptured,
        totalVideos,
    });

    const buttonText = useMemo(() => {
        if (learnDetail.practice.videos.length > 0) return t("chuyen_sang_thuc_hanh");
        if (learnDetail.exam.questions.length > 0) return t("chuyen_sang_bai_kiem_tra");
        return t("hoan_thanh_khoa_hoc");
    }, [learnDetail.practice.videos.length, learnDetail.exam.questions.length, t]);

    return (
        <LearnView
            gradientClass={theme.gradient}
            videoSlot={
                <div className="min-h-0">
                    <VideoPlayer
                        src={currentVideo?.url || learnDetail?.theory?.videos?.[0]?.url}
                        canSeek={
                            currentVideo?.canSeek ||
                            learnDetail?.theory?.videos?.[0]?.canSeek ||
                            progress?.isCompleted
                        }
                        isUsingLink={
                            currentVideo?.isUsingLink ||
                            learnDetail?.theory?.videos?.[0]?.isUsingLink
                        }
                        onEnded={handleVideoEnded}
                        onProgress={onPlayerProgress}
                        videoRef={videoRef}
                    />
                </div>
            }
            infoSlot={
                <LearnInfo
                    title={currentVideo?.title || learnDetail.theory.videos?.[0]?.title}
                    description={currentVideo?.description}
                    currentIndex={videoIndex}
                    total={learnDetail.theory.videos.length}
                    isFinished={isFinishVideo}
                />
            }
            nextButtonSlot={
                <LearnNextButton
                    show={isShowNextButton}
                    disabled={!isFinishVideo || isUpdatingProgress}
                    loading={isUpdatingProgress}
                    text={
                        videoIndex + 1 < learnDetail.theory.videos.length
                            ? t("video_tiep_theo")
                            : buttonText
                    }
                    onClick={handleNextVideo}
                />
            }
        />
    );
};

export default LearnTheory;
