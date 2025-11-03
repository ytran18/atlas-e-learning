import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Card } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys, useUpdateProgress } from "@/api/user";
import { useLearnContext } from "@/contexts/LearnContext";
import VideoPlayer from "@/libs/player/VideoPlayer";
import { updateCourseProgress, uploadLearningCapture } from "@/services/api.client";
import type { CaptureType } from "@/types/api";

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

    // -------- Auto-capture helpers (mirrors LearnTheory) --------
    const isCapturingRef = useRef<boolean>(false);
    const lastCaptureTimeRef = useRef<number>(0);
    const fallbackTriggeredRef = useRef<boolean>(false);
    const seedRef = useRef<number>(0);
    const plannedTargetRef = useRef<Map<string, number>>(new Map());
    // Track last seen currentTime per video to detect "crossing" the planned target
    const lastSeenTimeRef = useRef<Map<string, number>>(new Map());
    // Ref to the actual HTMLVideoElement exposed by VideoPlayer
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!learnDetail?.id) return;
        const key = `atlas-capture-seed:${learnDetail.id}`;
        try {
            let stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
            if (!stored) {
                stored = String(Math.floor(Math.random() * 2 ** 31));
                localStorage.setItem(key, stored);
            }
            seedRef.current = Number(stored) || 1;
            console.debug("[auto-capture] seed initialized", { key, seed: seedRef.current });
        } catch {
            seedRef.current = Math.floor(Math.random() * 2 ** 31) || 1;
            console.debug("[auto-capture] seed init fallback", { seed: seedRef.current });
        }
        plannedTargetRef.current.clear();
        fallbackTriggeredRef.current = false;
    }, [learnDetail?.id]);

    const hash32 = (s: string) => {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        }
        return h >>> 0;
    };

    const mulberry32 = (a: number) => () => {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const canvasToBlob = (canvas: HTMLCanvasElement, type = "image/png") =>
        new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type));

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

    const handleProgress = useCallback(() => {
        if (!!progress.finishImageUrl || isCapturingRef.current) {
            console.debug("[auto-capture] skip: already captured or capturing", {
                hasCaptured: !!progress.finishImageUrl,
                isCapturing: isCapturingRef.current,
                courseId: learnDetail?.id,
                videoIndex,
            });
            return;
        }

        if (!learnDetail || !currentVideo) return;

        const now = Date.now();
        if (now - lastCaptureTimeRef.current < 20000) {
            console.debug("[auto-capture] skip: throttle", {
                sinceLastMs: now - lastCaptureTimeRef.current,
            });
            return;
        }

        if (typeof document !== "undefined" && document.visibilityState !== "visible") {
            console.debug("[auto-capture] skip: document not visible");
            return;
        }

        const videoEl = (videoRef.current as HTMLVideoElement | null) ?? null;
        if (!videoEl || (videoEl.readyState ?? 0) < 2 || (videoEl.duration ?? 0) <= 0) {
            console.debug("[auto-capture] skip: video not ready", {
                readyState: videoEl?.readyState,
                duration: videoEl?.duration,
            });
            return;
        }

        const totalTheory = learnDetail?.theory?.videos?.length ?? 0;
        const totalPractice = learnDetail?.practice?.videos?.length ?? 0;
        const totalVideos = totalTheory + totalPractice;
        if (totalVideos <= 0) return;

        const videoKey = `practice-${videoIndex}`;
        let targetTime = plannedTargetRef.current.get(videoKey);

        if (targetTime == null) {
            const dur = videoEl.duration;
            const seed = hash32(`${seedRef.current}:${learnDetail.id}:${videoKey}`);
            const rng = mulberry32(seed);

            const minSec = Math.min(Math.max(5, dur * 0.15), Math.max(5, dur - 10));
            const maxSec = Math.max(minSec + 1, Math.min(dur - 5, dur * 0.85));
            targetTime = minSec + rng() * (maxSec - minSec);
            plannedTargetRef.current.set(videoKey, targetTime);
            console.debug("[auto-capture] planned target time", {
                videoKey,
                targetTime: Math.floor(targetTime),
                duration: Math.floor(dur),
            });
        }

        const currentPos = totalTheory + videoIndex; // practice index offset
        const totalProgress = currentPos / totalVideos;
        const shouldForce = totalProgress >= 0.8 && !fallbackTriggeredRef.current;

        // Determine crossing similarly to LearnTheory (guard against prev=0)
        const prev = lastSeenTimeRef.current.get(videoKey) ?? 0;
        const current = videoEl.currentTime ?? 0;

        const reachedTarget =
            prev < (targetTime ?? Infinity) && current >= (targetTime ?? Infinity);
        const fallbackReady = shouldForce && prev < 10 && current >= 10;

        // store last seen time for next invocation
        lastSeenTimeRef.current.set(videoKey, current);

        if (!reachedTarget && !fallbackReady) {
            // not yet time to capture
            return;
        }

        console.debug("[auto-capture] capture condition met", {
            videoKey,
            currentTime: Math.floor(videoEl.currentTime ?? 0),
            reachedTarget,
            fallbackReady,
            totalProgress: Number(totalProgress.toFixed(3)),
        });

        if (shouldForce) fallbackTriggeredRef.current = true;

        (async () => {
            if (isCapturingRef.current) return;
            isCapturingRef.current = true;
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const vw = videoEl.videoWidth || videoEl.clientWidth;
                const vh = videoEl.videoHeight || videoEl.clientHeight;
                if (!vw || !vh) return;
                canvas.width = vw;
                canvas.height = vh;

                try {
                    console.debug("[auto-capture] starting capture", {
                        videoKey,
                        currentTime: Math.floor(videoEl.currentTime || 0),
                    });
                    const rVFC = (videoEl as any).requestVideoFrameCallback;
                    if (typeof rVFC === "function") {
                        await new Promise<void>((resolve) => {
                            rVFC(() => resolve());
                        });
                    }
                } catch {}

                ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(10, 10, 380, 84);
                ctx.fillStyle = "white";
                ctx.font = "14px Arial";
                ctx.fillText(`Course: ${String(courseType).toUpperCase()}`, 20, 30);
                ctx.fillText(`Section: practice - Video ${videoIndex + 1}`, 20, 50);
                ctx.fillText(`Time: ${Math.floor(videoEl.currentTime || 0)}s`, 20, 70);

                const blob = await canvasToBlob(canvas, "image/png");
                if (!blob) return;

                const file = new File(
                    [blob],
                    `learning-proof-practice-${videoIndex}-${Date.now()}.png`,
                    { type: "image/png" }
                );

                const uploadRes = await uploadLearningCapture(
                    courseType,
                    file,
                    learnDetail.id,
                    "finish" as CaptureType
                );

                console.debug("[auto-capture] upload result", { imageUrl: uploadRes?.imageUrl });

                await updateCourseProgress(courseType, learnDetail.id, {
                    section: "practice",
                    videoIndex: videoIndex,
                    currentTime: videoEl.currentTime || 0,
                    finishImageUrl: uploadRes.imageUrl,
                });

                await queryClient.invalidateQueries({
                    queryKey: courseProgressKeys.progress(courseType, learnDetail.id),
                });

                lastCaptureTimeRef.current = Date.now();
                console.info("[auto-capture] capture completed", {
                    courseId: learnDetail.id,
                    videoKey,
                    imageUrl: uploadRes?.imageUrl,
                });
            } catch (err) {
                console.error("Learning proof capture failed:", err);
            } finally {
                isCapturingRef.current = false;
            }
        })();
    }, [progress.finishImageUrl, learnDetail, currentVideo, videoIndex, courseType, queryClient]);

    // Attach timeupdate listener and initialize lastSeen for the current video
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const videoKey = `practice-${videoIndex}`;
        // initialize to current playback position to avoid prev=0 false positives
        lastSeenTimeRef.current.set(videoKey, v.currentTime ?? 0);

        const handler = () => {
            try {
                handleProgress();
            } catch (e) {
                console.error("timeupdate handler error:", e);
            }
        };

        v.addEventListener("timeupdate", handler);
        return () => {
            v.removeEventListener("timeupdate", handler);
        };
    }, [videoIndex, learnDetail?.id, handleProgress]);

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
                        videoRef={videoRef}
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
