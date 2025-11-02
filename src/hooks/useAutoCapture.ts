/**
 * Hook: useAutoCapture
 *
 * Tự động capture ngẫu nhiên các frame từ video trong quá trình học
 * để tạo proof rằng user đã thực sự học khóa học
 * Capture có thể xảy ra ở bất kỳ video nào trong phần lý thuyết hoặc thực hành
 */
import { useEffect, useRef } from "react";

import { updateCourseProgress, uploadLearningCapture } from "@/services/api.client";
import { CaptureType, CourseType } from "@/types/api";

interface UseAutoCaptureProps {
    courseType: CourseType;
    groupId: string;
    currentSection: string;
    currentVideoIndex: number;
    learnDetail: any; // CourseDetail type
    hasCaptured: boolean;
}

export function useAutoCapture({
    courseType,
    groupId,
    currentSection,
    currentVideoIndex,
    learnDetail,
    hasCaptured,
}: UseAutoCaptureProps) {
    const capturedVideosRef = useRef<Set<string>>(new Set());
    const lastCaptureTimeRef = useRef<number>(0);
    const isCapturingRef = useRef<boolean>(false);
    const totalCapturesRef = useRef<number>(0);
    const fallbackTriggeredRef = useRef<boolean>(false);

    // Enhanced probability calculation with guaranteed capture
    const getCaptureProbability = () => {
        if (!learnDetail || hasCaptured || isCapturingRef.current) return 0;

        const totalVideos = learnDetail.theory.videos.length + learnDetail.practice.videos.length;

        const currentVideoKey = `${currentSection}-${currentVideoIndex}`;

        // If already captured this video, don't capture again
        if (capturedVideosRef.current.has(currentVideoKey)) return 0;

        // Calculate current video position
        const currentVideoPosition =
            currentSection === "theory"
                ? currentVideoIndex
                : learnDetail.theory.videos.length + currentVideoIndex;

        const totalProgress = currentVideoPosition / totalVideos;

        // FALLBACK: If no captures yet and we're at 70% progress, force capture
        if (
            totalCapturesRef.current === 0 &&
            totalProgress >= 0.7 &&
            !fallbackTriggeredRef.current
        ) {
            fallbackTriggeredRef.current = true;
            return 1.0; // 100% chance for fallback
        }

        // GUARANTEED CAPTURE for last 2 videos (100% chance)
        if (currentVideoPosition >= totalVideos - 2) {
            return 1.0; // 100% chance
        }

        // HIGH PROBABILITY for last 4 videos (80% chance)
        if (currentVideoPosition >= totalVideos - 4) {
            return 0.8;
        }

        // MEDIUM PROBABILITY for middle videos (50% chance)
        if (totalProgress >= 0.3 && totalProgress <= 0.7) {
            return 0.5;
        }

        // Base probability: 30% chance for early videos
        let probability = 0.3;

        // Increase probability for practice videos (more practical proof)
        if (currentSection === "practice") {
            probability += 0.2; // 50% for practice videos
        }

        // Increase probability based on progress
        probability += totalProgress * 0.25; // Up to 55% for later videos

        return Math.min(probability, 0.55); // Cap at 55%
    };

    // Simple capture function
    const captureVideoFrame = async () => {
        if (isCapturingRef.current) return;

        try {
            isCapturingRef.current = true;

            // Find the video element on the page
            const videoElement = document.querySelector("video") as HTMLVideoElement;

            if (!videoElement) {
                console.error("No video element found on page");
                return;
            }

            // Check if video is loaded and has video data
            if (videoElement.readyState < 2) {
                console.error("Video not ready for capture");
                return;
            }

            // Mark this video as captured
            const currentVideoKey = `${currentSection}-${currentVideoIndex}`;
            capturedVideosRef.current.add(currentVideoKey);
            totalCapturesRef.current += 1;
            lastCaptureTimeRef.current = Date.now();

            // Create a canvas to capture the video frame
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                console.error("Could not get canvas context");
                return;
            }

            // Set canvas size to match video dimensions
            canvas.width = videoElement.videoWidth || videoElement.clientWidth;
            canvas.height = videoElement.videoHeight || videoElement.clientHeight;

            // Draw the current video frame to canvas
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Add timestamp and video info overlay
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(10, 10, 300, 80);

            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(`Course: ${courseType.toUpperCase()}`, 20, 30);
            ctx.fillText(`Section: ${currentSection} - Video ${currentVideoIndex + 1}`, 20, 50);
            ctx.fillText(`Time: ${Math.floor(videoElement.currentTime || 0)}s`, 20, 70);

            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Failed to create blob from video frame");
                    return;
                }

                try {
                    // Convert blob to File
                    const file = new File(
                        [blob],
                        `learning-proof-${currentSection}-${currentVideoIndex}-${Date.now()}.png`,
                        {
                            type: "image/png",
                        }
                    );

                    // Upload the capture
                    const uploadResult = await uploadLearningCapture(
                        courseType,
                        file,
                        groupId,
                        "finish" as CaptureType
                    );

                    // Update progress with finishImageUrl
                    await updateCourseProgress(courseType, groupId, {
                        section: currentSection as "theory" | "practice" | "exam",
                        videoIndex: currentVideoIndex,
                        currentTime: videoElement.currentTime || 0,
                        finishImageUrl: uploadResult.imageUrl,
                    });

                    console.log(
                        `Learning proof captured: ${currentSection}-${currentVideoIndex} (Total: ${totalCapturesRef.current})`,
                        uploadResult.imageUrl
                    );
                } catch (error) {
                    console.error("Failed to upload learning proof capture:", error);
                } finally {
                    isCapturingRef.current = false;
                }
            }, "image/png");
        } catch (error) {
            console.error("Learning proof capture failed:", error);
            isCapturingRef.current = false;
        }
    };

    // Effect that runs when video changes - waits for video to play
    useEffect(() => {
        // Skip if already captured or currently capturing
        if (hasCaptured || isCapturingRef.current) return;

        // Skip if no course details
        if (!learnDetail) return;

        // Skip if too soon since last capture (minimum 20 seconds)
        const now = Date.now();
        if (now - lastCaptureTimeRef.current < 20000) return;

        // Calculate probability
        const probability = getCaptureProbability();
        if (probability <= 0) return;

        // Random chance
        if (Math.random() >= probability) return;

        // Wait for video to be ready and playing
        const videoElement = document.querySelector("video") as HTMLVideoElement;
        if (!videoElement) return;

        // Wait for video to have some duration and be playing
        const waitForVideoReady = () => {
            if (videoElement.readyState >= 2 && videoElement.duration > 0) {
                // Calculate random time based on video duration
                const videoDuration = videoElement.duration;
                let randomVideoTime;

                if (videoDuration < 30) {
                    // Short video: capture between 20%-80% of duration
                    randomVideoTime = videoDuration * (0.2 + Math.random() * 0.6);
                } else if (videoDuration < 120) {
                    // Medium video: capture between 15-60 seconds
                    randomVideoTime = 15 + Math.random() * 45;
                } else {
                    // Long video: capture between 30-90 seconds
                    randomVideoTime = 30 + Math.random() * 60;
                }

                // Ensure we don't exceed video duration
                randomVideoTime = Math.min(randomVideoTime, videoDuration - 5);

                console.log(
                    `📹 Will capture at ${Math.floor(randomVideoTime)}s of ${Math.floor(videoDuration)}s video`
                );

                const timeoutId = setTimeout(() => {
                    // Double-check conditions before capturing
                    if (!hasCaptured && !isCapturingRef.current) {
                        captureVideoFrame().catch((error) => {
                            console.error("Learning proof capture failed:", error);
                        });
                    }
                }, randomVideoTime * 1000); // Convert to milliseconds

                return () => clearTimeout(timeoutId);
            } else {
                // Video not ready yet, check again in 1 second
                const retryTimeout = setTimeout(waitForVideoReady, 1000);
                return () => clearTimeout(retryTimeout);
            }
        };

        return waitForVideoReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSection, currentVideoIndex, learnDetail, hasCaptured]);

    // Final fallback: Force capture if no captures after 80% progress
    useEffect(() => {
        if (!learnDetail || hasCaptured || isCapturingRef.current) return;
        if (totalCapturesRef.current > 0) return; // Already captured something

        const totalVideos = learnDetail.theory.videos.length + learnDetail.practice.videos.length;
        const currentVideoPosition =
            currentSection === "theory"
                ? currentVideoIndex
                : learnDetail.theory.videos.length + currentVideoIndex;

        const totalProgress = currentVideoPosition / totalVideos;

        // Force capture at 80% progress if no captures yet
        if (totalProgress >= 0.8) {
            console.log("🚨 FALLBACK: Forcing capture at 80% progress - no captures yet");

            // Wait for video to be ready and capture at random time
            const videoElement = document.querySelector("video") as HTMLVideoElement;
            if (videoElement && videoElement.readyState >= 2 && videoElement.duration > 0) {
                // Calculate random time based on video duration for fallback
                const videoDuration = videoElement.duration;
                let randomVideoTime;

                if (videoDuration < 30) {
                    // Short video: capture between 30%-70% of duration
                    randomVideoTime = videoDuration * (0.3 + Math.random() * 0.4);
                } else if (videoDuration < 120) {
                    // Medium video: capture between 20-80 seconds
                    randomVideoTime = 20 + Math.random() * 60;
                } else {
                    // Long video: capture between 40-120 seconds
                    randomVideoTime = 40 + Math.random() * 80;
                }

                // Ensure we don't exceed video duration
                randomVideoTime = Math.min(randomVideoTime, videoDuration - 5);

                console.log(
                    `🚨 FALLBACK: Will capture at ${Math.floor(randomVideoTime)}s of ${Math.floor(videoDuration)}s video`
                );

                setTimeout(() => {
                    captureVideoFrame().catch((error) => {
                        console.error("Fallback capture failed:", error);
                    });
                }, randomVideoTime * 1000);
            } else {
                // Video not ready, try immediate capture
                captureVideoFrame().catch((error) => {
                    console.error("Fallback capture failed:", error);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSection, currentVideoIndex, learnDetail, hasCaptured]);

    return {
        captureVideoFrame,
    };
}
