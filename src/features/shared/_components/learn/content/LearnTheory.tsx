import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Card } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys, useUpdateProgress } from "@/api";
import { useLearnContext } from "@/contexts/LearnContext";
import VideoPlayer from "@/libs/player/VideoPlayer";
import { updateCourseProgress, uploadLearningCapture } from "@/services/api.client";
import type { CaptureType } from "@/types/api";

import { COURSE_THEMES, CourseType } from "../../../types";

interface LearnTheoryProps {
    courseType: CourseType;
}

const LearnTheory = ({ courseType }: LearnTheoryProps) => {
    const { learnDetail, progress, currentVideoIndex, navigateToVideo, navigateToExam } =
        useLearnContext();

    const queryClient = useQueryClient();

    const router = useRouter();

    const theme = COURSE_THEMES[courseType];

    const searchParams = useSearchParams();

    const sectionDB = searchParams.get("section");

    const videoIndexDB = searchParams.get("video");

    const hasCaptured = !!progress.finishImageUrl;

    // Use client-side video index
    const videoIndex = currentVideoIndex;

    const currentVideo = learnDetail.theory.videos[videoIndex];

    const isShowNextButton = sectionDB === "theory" && Number(videoIndexDB) === videoIndex;

    // Check if current video is already completed
    const isCurrentVideoCompleted = progress.completedVideos.some(
        (completed) => completed.section === "theory" && completed.index === videoIndex
    );

    const [isFinishVideo, setIsFinishVideo] = useState<boolean>(isCurrentVideoCompleted);

    // -------- Auto-capture moved here (per requirements) --------
    // Single-proof-per-course flags and helpers
    const isCapturingRef = useRef<boolean>(false);

    const lastCaptureTimeRef = useRef<number>(0);

    const fallbackTriggeredRef = useRef<boolean>(false);

    // Deterministic per-user seed stored per course to reduce collision
    const seedRef = useRef<number>(0);

    // Cache per-video target time so it doesn't change on every progress event
    const plannedTargetRef = useRef<Map<string, number>>(new Map());

    // Track last seen currentTime per video to detect "crossing" the planned target
    const lastSeenTimeRef = useRef<Map<string, number>>(new Map());

    // Ref to the actual HTMLVideoElement exposed by VideoPlayer
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Initialize deterministic seed once per course (client only)
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
            // Fallback seed if localStorage not accessible
            seedRef.current = Math.floor(Math.random() * 2 ** 31) || 1;

            console.debug("[auto-capture] seed init fallback", { seed: seedRef.current });
        }
        // Reset per-video plans when course changes
        plannedTargetRef.current.clear();

        fallbackTriggeredRef.current = false;
    }, [learnDetail?.id]);

    // Simple string hash -> uint32
    const hash32 = (s: string) => {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        }
        return h >>> 0;
    };

    // Mulberry32 PRNG
    const mulberry32 = (a: number) => () => {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Convert canvas to blob (Promise)
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
        if (hasCaptured) return;
    };

    // Use a stable callback so we can also call it from a 'timeupdate' listener
    const handleProgress = useCallback(() => {
        // Lightweight checks first
        if (hasCaptured || isCapturingRef.current) {
            return;
        }

        if (!learnDetail || !currentVideo) return;

        // Throttle: at least 20s between capture attempts
        const now = Date.now();

        if (now - lastCaptureTimeRef.current < 20000) {
            return;
        }

        // Only capture when tab is visible
        if (typeof document !== "undefined" && document.visibilityState !== "visible") {
            return;
        }

        const videoEl = (videoRef.current as HTMLVideoElement | null) ?? null;

        if (!videoEl || (videoEl.readyState ?? 0) < 2 || (videoEl.duration ?? 0) <= 0) {
            return;
        }

        const totalTheory = learnDetail?.theory?.videos?.length ?? 0;

        const totalPractice = learnDetail?.practice?.videos?.length ?? 0;

        const totalVideos = totalTheory + totalPractice;

        if (totalVideos <= 0) return;

        const videoKey = `theory-${videoIndex}`;

        let targetTime = plannedTargetRef.current.get(videoKey);

        console.log("Target time:", targetTime);

        if (targetTime == null) {
            const dur = videoEl.duration;

            const seed = hash32(`${seedRef.current}:${learnDetail.id}:${videoKey}`);

            const rng = mulberry32(seed);

            const minSec = Math.min(Math.max(5, dur * 0.15), Math.max(5, dur - 10));

            const maxSec = Math.max(minSec + 1, Math.min(dur - 5, dur * 0.85));

            targetTime = minSec + rng() * (maxSec - minSec);

            plannedTargetRef.current.set(videoKey, targetTime);
        }

        // Fallback: force if progressed enough in course
        const currentPos = videoIndex;

        const totalProgress = currentPos / totalVideos;

        const shouldForce = totalProgress >= 0.8 && !fallbackTriggeredRef.current;

        // Determine crossing: previous time < target && current >= target
        const prev = lastSeenTimeRef.current.get(videoKey) ?? 0;

        const current = videoEl.currentTime ?? 0;

        const crossedTarget =
            prev < (targetTime ?? Infinity) && current >= (targetTime ?? Infinity);

        const fallbackReady = shouldForce && prev < 10 && current >= 10;

        // store last seen time for next invocation
        lastSeenTimeRef.current.set(videoKey, current);

        if (!crossedTarget && !fallbackReady) return;

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
                    const rVFC = (videoEl as any).requestVideoFrameCallback;

                    if (typeof rVFC === "function") {
                        await new Promise<void>((resolve) => rVFC(() => resolve()));
                    }
                } catch {}

                ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(10, 10, 380, 84);
                ctx.fillStyle = "white";
                ctx.font = "14px Arial";
                ctx.fillText(`Course: ${String(courseType).toUpperCase()}`, 20, 30);
                ctx.fillText(`Section: theory - Video ${videoIndex + 1}`, 20, 50);
                ctx.fillText(`Time: ${Math.floor(videoEl.currentTime || 0)}s`, 20, 70);

                const blob = await canvasToBlob(canvas, "image/png");

                if (!blob) return;

                const file = new File(
                    [blob],
                    `learning-proof-theory-${videoIndex}-${Date.now()}.png`,
                    { type: "image/png" }
                );

                const uploadRes = await uploadLearningCapture(
                    courseType,
                    file,
                    learnDetail.id,
                    "finish" as CaptureType
                );

                await updateCourseProgress(courseType, learnDetail.id, {
                    section: "theory",
                    videoIndex: videoIndex,
                    currentTime: videoEl.currentTime || 0,
                    finishImageUrl: uploadRes.imageUrl,
                });

                await queryClient.invalidateQueries({
                    queryKey: courseProgressKeys.progress(courseType, learnDetail.id),
                });

                lastCaptureTimeRef.current = Date.now();
            } catch (err) {
                console.error("Learning proof capture failed:", err);
            } finally {
                isCapturingRef.current = false;
            }
        })();
    }, [hasCaptured, learnDetail, currentVideo, videoIndex, courseType, queryClient]);

    // Attach a 'timeupdate' listener to the actual <video> element as a robust
    // source of currentTime updates. ReactPlayer's onProgress may not run every
    // second depending on configuration, so timeupdate ensures we catch the
    // moment currentTime crosses the planned target.
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        // Initialize last-seen time for this video to avoid false positives
        const videoKey = `theory-${videoIndex}`;
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

        const totalVideos = learnDetail.theory.videos.length;

        if (nextVideoIndex < totalVideos) {
            // Move to next video in theory section
            updateProgress({
                groupId: learnDetail.id,
                section: "theory",
                videoIndex: nextVideoIndex,
                currentTime: 0,
            });
            // Update local state immediately for better UX
            navigateToVideo("theory", nextVideoIndex);
            // Update URL
            router.replace(`?section=theory&video=${nextVideoIndex}`);

            setIsFinishVideo(false);
        } else {
            // All theory videos completed, move to practice section
            updateProgress({
                groupId: learnDetail.id,
                section: learnDetail?.practice?.videos?.length > 0 ? "practice" : "exam",
                videoIndex: 0,
                currentTime: 0,
            });
            // Update local state immediately for better UX
            if (learnDetail?.practice?.videos?.length > 0) {
                navigateToVideo("practice", 0);

                router.replace(`?section=practice&video=0`);
            } else if (learnDetail?.exam?.questions?.length > 0) {
                navigateToExam();
            } else {
                updateProgress({
                    groupId: learnDetail.id,
                    section: "theory",
                    isCompleted: true,
                    videoIndex,
                    currentTime: 0,
                });
            }
        }
    };

    return (
        <Card
            withBorder
            shadow="sm"
            radius="md"
            padding="lg"
            h="100%"
            className={`bg-linear-to-br ${theme.gradient} p-0! sm:p-4!`}
        >
            <div className="flex flex-col gap-4 lg:gap-6 h-full">
                {/* Video Player Container */}
                <div className="min-h-0">
                    <VideoPlayer
                        src={currentVideo?.url || learnDetail?.theory?.videos?.[0]?.url}
                        canSeek={currentVideo?.canSeek || learnDetail?.theory?.videos?.[0]?.canSeek}
                        onEnded={handleVideoEndedInternal}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPaused}
                        onProgress={handleProgress}
                        videoRef={videoRef}
                        isUsingLink={
                            currentVideo?.isUsingLink ||
                            learnDetail?.theory?.videos?.[0]?.isUsingLink
                        }
                    />
                </div>

                {/* Video Info and Navigation */}
                <div className="shrink-0 space-y-4 px-2 sm:px-0">
                    {/* Video Title and Description */}
                    <div className="space-y-2">
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                            {currentVideo?.title || learnDetail.theory.videos?.[0]?.title}
                        </h3>
                        {currentVideo?.description && (
                            <p className="text-sm lg:text-base text-gray-600">
                                {currentVideo.description}
                            </p>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between text-sm text-gray-500 shrink-0 px-2 sm:px-0 mb-3">
                        <span>
                            Video {videoIndex + 1} / {learnDetail.theory.videos.length}
                        </span>
                        <span>{isFinishVideo ? "✓ Hoàn thành" : "Đang học"}</span>
                    </div>

                    {/* Navigation Button */}
                    {isShowNextButton && (
                        <div className="w-full flex justify-end shrink-0 p-2 sm:p-0">
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
                    )}
                </div>
            </div>
        </Card>
    );
};

export default LearnTheory;
