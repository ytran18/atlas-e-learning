"use client";

import { ReactEventHandler, useEffect, useRef, useState } from "react";

import Hls from "hls.js";
import {
    MediaControlBar,
    MediaController,
    MediaFullscreenButton,
    MediaPlayButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/react";
import Player from "react-player";

interface VideoPlayerProps {
    src: string;
    canSeek?: boolean;
    isPreview?: boolean;
    onEnded?: () => void; // when video ended
    onPause?: () => void; // when video paused
    onPlay?: () => void; // when video played
    onProgress?: ReactEventHandler<HTMLVideoElement> | undefined; // when video progress
    isHls?: boolean; // whether the video source is HLS stream
    isUsingLink?: boolean; // whether the video source is using link
}

const LOADING_DEBOUNCE_TIME = 200;

const VideoPlayer = ({
    src,
    canSeek = true,
    isPreview = false,
    onEnded,
    onPause,
    onPlay,
    onProgress,
    isHls = true,
    isUsingLink = false,
}: VideoPlayerProps) => {
    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    const hlsRef = useRef<Hls | null>(null);

    const isLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [, setIsLoadingVideo] = useState<boolean>(false);

    // Convert R2 URLs to proxy URLs for same-origin requests
    const getProxyUrl = (originalUrl: string): string => {
        // Check if it's an R2 URL that needs proxying
        if (!originalUrl?.includes(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!)) {
            return originalUrl; // Not an R2 URL, return as is
        }

        // Extract path from R2 URL
        // https://pub-xxx.r2.dev/videos/abc123.m3u8 -> videos/abc123.m3u8
        const url = new URL(originalUrl);
        const path = url.pathname.substring(1); // Remove leading slash

        // Return proxy URL
        return `/api/video/${path}`;
    };

    const handleReady = () => {
        clearTimeout(isLoadingTimeoutRef.current as NodeJS.Timeout);

        isLoadingTimeoutRef.current = setTimeout(() => {
            setIsLoadingVideo(false);
        }, LOADING_DEBOUNCE_TIME);
    };

    const handleLoadStart = () => {
        setIsLoadingVideo(true);
    };

    // Handle progress for HTML5 video
    const handleProgress = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        // If onProgress callback is provided, call it
        if (onProgress) {
            onProgress(event);
        }
    };

    // Initialize HLS if needed
    useEffect(() => {
        const videoElement = videoElementRef.current;

        if (!videoElement || !isHls || isUsingLink) return;

        // Convert R2 URL to proxy URL for same-origin requests
        const proxySrc = getProxyUrl(src);

        // Prevent crash if `canPlayType` is not a function
        const canNativePlayHls =
            typeof videoElement.canPlayType === "function" &&
            videoElement.canPlayType("application/vnd.apple.mpegurl");

        if (canNativePlayHls) {
            // Native HLS support (Safari) - use proxy URL
            videoElement.src = proxySrc;
        } else if (Hls.isSupported()) {
            // Use hls.js for other browsers - also use proxy URL for consistency
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }

            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            });

            console.log("proxySrc", proxySrc);

            hlsRef.current = hls;
            hls.loadSource(proxySrc); // Use proxy URL
            hls.attachMedia(videoElement);

            // Handle HLS events
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS manifest parsed");
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("Fatal network error encountered, try to recover");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("Fatal media error encountered, try to recover");
                            hls.recoverMediaError();
                            break;
                        default:
                            console.log("Fatal error, cannot recover");
                            hls.destroy();
                            break;
                    }
                }
            });
        } else {
            console.error("HLS is not supported in this browser");
        }

        // Cleanup function
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src, isHls, isUsingLink]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            clearTimeout(isLoadingTimeoutRef.current as NodeJS.Timeout);
        };
    }, []);

    return (
        <>
            <MediaController
                id="media-controller-atld"
                style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "16/9",
                }}
            >
                <Player
                    ref={videoElementRef}
                    slot="media"
                    src={isUsingLink || !isHls ? src : undefined}
                    crossOrigin="anonymous"
                    playsInline
                    onEnded={onEnded}
                    onPause={onPause}
                    onPlay={onPlay}
                    onLoadStart={handleLoadStart}
                    onCanPlay={handleReady}
                    onWaiting={() => {
                        setIsLoadingVideo(true);
                    }}
                    onPlaying={() => {
                        setIsLoadingVideo(false);
                    }}
                    onProgress={handleProgress}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
                {!isPreview && (
                    <MediaControlBar className="w-full bg-[rgba(20,20,30,0.5)] px-2">
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center justify-between gap-x-2">
                                <div className="flex items-center gap-x-4">
                                    <MediaPlayButton className="size-5 bg-transparent" />

                                    <MediaTimeDisplay showDuration className="bg-transparent" />
                                </div>

                                <div className="flex items-center gap-x-4">
                                    <MediaVolumeRange className="bg-transparent" />

                                    <MediaFullscreenButton className="bg-transparent" />
                                </div>
                            </div>

                            <MediaTimeRange
                                className={`w-full bg-transparent ${!canSeek ? "pointer-events-none" : ""}`}
                            />
                        </div>
                    </MediaControlBar>
                )}
            </MediaController>
        </>
    );
};

export default VideoPlayer;
