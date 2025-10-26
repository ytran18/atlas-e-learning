"use client";

import { ReactEventHandler, useEffect, useRef, useState } from "react";

import {
    MediaControlBar,
    MediaController,
    MediaFullscreenButton,
    MediaLoadingIndicator,
    MediaPlayButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/react";

interface VideoPlayerProps {
    src: string;
    canSeek?: boolean;
    isPreview?: boolean;
    onEnded?: () => void; // when video ended
    onPause?: () => void; // when video paused
    onPlay?: () => void; // when video played
    onProgress?: ReactEventHandler<HTMLVideoElement> | undefined; // when video progress
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
}: VideoPlayerProps) => {
    const videoElementRef = useRef<HTMLVideoElement | null>(null);

    const isLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);

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

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            clearTimeout(isLoadingTimeoutRef.current as NodeJS.Timeout);
        };
    }, []);

    return (
        <MediaController
            style={{
                width: "100%",
                height: "100%",
                aspectRatio: "16/9",
            }}
        >
            <video
                ref={videoElementRef}
                slot="media"
                src={src}
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
                                {isLoadingVideo ? (
                                    <MediaLoadingIndicator />
                                ) : (
                                    <MediaPlayButton className="size-5" />
                                )}

                                <MediaTimeDisplay showDuration />
                            </div>

                            <div className="flex items-center gap-x-4">
                                <MediaVolumeRange />

                                <MediaFullscreenButton />
                            </div>
                        </div>

                        <MediaTimeRange
                            className={`w-full ${!canSeek ? "pointer-events-none" : ""}`}
                        />
                    </div>
                </MediaControlBar>
            )}
        </MediaController>
    );
};

export default VideoPlayer;
