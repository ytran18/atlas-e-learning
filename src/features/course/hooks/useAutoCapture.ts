import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys } from "@/api";
import { updateCourseProgress, uploadLearningCapture } from "@/services";
import { CaptureType, CourseType } from "@/types/api";

import { canvasToBlob } from "../utils/canvas-to-blob";
import { getRealVideoEl } from "../utils/get-real-video-element";
import { hash32 } from "../utils/hash-32";
import { mulberry32 } from "../utils/mulberry-32";

interface UseAutoCaptureParams {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    courseType: CourseType;
    learnDetailId: string;
    sectionKey: "theory" | "practice";
    videoIndex: number;
    hasCaptured: boolean;
    totalVideos: number;
}

export function useAutoCapture({
    videoRef,
    courseType,
    learnDetailId,
    sectionKey,
    videoIndex,
    hasCaptured,
    totalVideos,
}: UseAutoCaptureParams) {
    const queryClient = useQueryClient();

    // refs
    const isCapturingRef = useRef<boolean>(false);

    const lastCaptureTimeRef = useRef<number>(0);

    const fallbackTriggeredRef = useRef<boolean>(false);

    const seedRef = useRef<number>(0);

    const plannedTargetRef = useRef<Map<string, number>>(new Map());

    const lastSeenTimeRef = useRef<Map<string, number>>(new Map());

    // Initialize deterministic seed once per course
    useEffect(() => {
        if (!learnDetailId) return;

        const key = `atlas-capture-seed:${learnDetailId}`;

        try {
            let stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;

            if (!stored) {
                stored = String(Math.floor(Math.random() * 2 ** 31));

                localStorage.setItem(key, stored);
            }

            seedRef.current = Number(stored) || 1;

            // reset per-video
            plannedTargetRef.current.clear();

            fallbackTriggeredRef.current = false;
        } catch {
            seedRef.current = Math.floor(Math.random() * 2 ** 31) || 1;

            plannedTargetRef.current.clear();

            fallbackTriggeredRef.current = false;
        }
    }, [learnDetailId]);

    const handleProgress = useCallback(() => {
        if (hasCaptured || isCapturingRef.current) return;

        const videoEl = getRealVideoEl(videoRef);

        if (!videoEl || (videoEl.readyState ?? 0) < 2 || (videoEl.duration ?? 0) <= 0) return;

        // throttle 20s
        const now = Date.now();

        if (now - lastCaptureTimeRef.current < 20000) return;

        if (typeof document !== "undefined" && document.visibilityState !== "visible") return;

        const videoKey = `${sectionKey}-${videoIndex}`;

        let targetTime = plannedTargetRef.current.get(videoKey);

        if (targetTime == null) {
            const dur = videoEl.duration;

            const seed = hash32(`${seedRef.current}:${learnDetailId}:${videoKey}`);

            const rng = mulberry32(seed);

            const minSec = Math.min(Math.max(5, dur * 0.15), Math.max(5, dur - 10));

            const maxSec = Math.max(minSec + 1, Math.min(dur - 5, dur * 0.85));

            targetTime = minSec + rng() * (maxSec - minSec);

            plannedTargetRef.current.set(videoKey, targetTime);
        }

        // Fallback: force if progressed enough in course
        const currentPos = videoIndex;

        const progressRatio = totalVideos > 0 ? currentPos / totalVideos : 0;

        const shouldForce = progressRatio >= 0.8 && !fallbackTriggeredRef.current;

        const prev = lastSeenTimeRef.current.get(videoKey) ?? 0;

        const current = videoEl.currentTime ?? 0;

        const crossedTarget =
            prev < (targetTime ?? Infinity) && current >= (targetTime ?? Infinity);

        const fallbackReady = shouldForce && prev < 10 && current >= 10;

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

                ctx.fillText(`Section: ${sectionKey} - Video ${videoIndex + 1}`, 20, 50);

                ctx.fillText(`Time: ${Math.floor(videoEl.currentTime || 0)}s`, 20, 70);

                const blob = await canvasToBlob(canvas, "image/png");

                if (!blob) return;

                const file = new File(
                    [blob],
                    `learning-proof-${sectionKey}-${videoIndex}-${Date.now()}.png`,
                    { type: "image/png" }
                );

                const uploadRes = await uploadLearningCapture(
                    courseType,
                    file,
                    learnDetailId,
                    "finish" as CaptureType
                );

                await updateCourseProgress(courseType, learnDetailId, {
                    section: sectionKey,
                    videoIndex: videoIndex,
                    currentTime: videoEl.currentTime || 0,
                    finishImageUrl: uploadRes.imageUrl,
                });

                await queryClient.invalidateQueries({
                    queryKey: courseProgressKeys.progress(courseType, learnDetailId),
                });

                lastCaptureTimeRef.current = Date.now();
            } catch (err) {
                console.error("Learning proof capture failed:", err);
            } finally {
                isCapturingRef.current = false;
            }
        })();
    }, [
        hasCaptured,
        videoRef,
        courseType,
        learnDetailId,
        sectionKey,
        videoIndex,
        totalVideos,
        queryClient,
    ]);

    // timeupdate listener on the real <video>
    useEffect(() => {
        const v = videoRef.current;

        if (!v) return;

        const videoKey = `${sectionKey}-${videoIndex}`;

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
    }, [videoIndex, sectionKey, learnDetailId, handleProgress, videoRef]);

    return handleProgress;
}
