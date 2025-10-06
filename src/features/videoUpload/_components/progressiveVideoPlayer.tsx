"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressiveVideoPlayerProps {
    src: string;
    className?: string;
    autoPlay?: boolean;
    controls?: boolean;
    muted?: boolean;
    width?: string | number;
    height?: string | number;
    poster?: string;
    onError?: (error: string) => void;
    onLoadProgress?: (bufferedPercent: number) => void;
}

export const ProgressiveVideoPlayer = ({
    src,
    className = "",
    autoPlay = false,
    controls = true,
    muted = false,
    width = "100%",
    height = "auto",
    poster,
    onError,
    onLoadProgress,
}: ProgressiveVideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bufferedPercent, setBufferedPercent] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        const handleLoadStart = () => {
            setIsLoading(true);
            setError(null);
        };

        const handleLoadedData = () => {
            setIsLoading(false);
        };

        const handleCanPlay = () => {
            setIsLoading(false);
            if (autoPlay) {
                video.play().catch((err) => {
                    console.error("Autoplay failed:", err);
                });
            }
        };

        const handleError = () => {
            const errorMsg = "Cannot load video. Please check the URL and try again.";
            setError(errorMsg);
            setIsLoading(false);
            onError?.(errorMsg);
        };

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const duration = video.duration;
                if (duration > 0) {
                    const percent = (bufferedEnd / duration) * 100;
                    setBufferedPercent(percent);
                    onLoadProgress?.(percent);
                }
            }
        };

        // Add event listeners
        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("error", handleError);
        video.addEventListener("progress", handleProgress);

        // Cleanup
        return () => {
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("error", handleError);
            video.removeEventListener("progress", handleProgress);
        };
    }, [src, autoPlay, onError, onLoadProgress]);

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-900 text-red-400 rounded-lg ${className}`}
                style={{ width, height: height === "auto" ? 300 : height }}
            >
                <div className="text-center p-4">
                    <svg
                        className="mx-auto mb-2 w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={{ width }}>
            {isLoading && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg z-10"
                    style={{ height: height === "auto" ? 300 : height }}
                >
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-white text-sm">Loading video...</p>
                    </div>
                </div>
            )}

            {bufferedPercent > 0 && bufferedPercent < 100 && !isLoading && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
                    Buffered: {Math.round(bufferedPercent)}%
                </div>
            )}

            <video
                ref={videoRef}
                src={src}
                className="w-full rounded-lg bg-black"
                controls={controls}
                muted={muted}
                playsInline
                preload="metadata" // Load metadata first, then progressive load
                poster={poster}
                style={{ width, height }}
            />
        </div>
    );
};
