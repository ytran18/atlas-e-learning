"use client";

import { ReactEventHandler, RefObject, useRef } from "react";

import {
    MediaPlayer,
    type MediaPlayerInstance,
    MediaProvider,
    type MediaProviderAdapter,
    type MediaSeekRequestEvent,
    type MediaSeekingRequestEvent,
    TimeSlider,
    isHLSProvider,
} from "@vidstack/react";
import {
    DefaultAudioLayout,
    DefaultVideoLayout,
    defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/base.css";

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
    // optional external ref to the underlying HTMLVideoElement
    videoRef?: RefObject<HTMLVideoElement | null>;
    // called when a fatal (unrecoverable) video error occurs
    onError?: (errorType: string, message: string) => void;
}

const VideoPlayer = ({
    src,
    canSeek = true,
    // isPreview = false,
    onEnded,
    onPause,
    onPlay,
    onProgress,
    onError,
    // isHls = true,
    // isUsingLink = false,
    videoRef,
}: VideoPlayerProps) => {
    const player = useRef<MediaPlayerInstance>(null);
    const maxWatchedTime = useRef(0);

    // useEffect(() => {
    //     // Subscribe to state updates.
    //     return player.current?.subscribe(() => {
    //         // console.log('is paused?', '->', paused);
    //         // console.log('is audio view?', '->', viewType === 'audio');
    //     });
    // }, []);

    function onProviderChange(provider: MediaProviderAdapter | null) {
        // We can configure provider's here.
        if (isHLSProvider(provider)) {
            provider.config = {
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            };
        }

        if (videoRef && provider && "video" in provider) {
            // Expose Native HTMLVideoElement so auto-capture and other logic can drawImage
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            videoRef.current = provider.video;
        }
    }

    const handleSeekRequest = (
        time: number,
        event: MediaSeekRequestEvent | MediaSeekingRequestEvent
    ) => {
        if (!canSeek) {
            // Chỉ chặn nếu vị trí muốn tua lớn hơn vị trí xa nhất đã xem
            if (time > maxWatchedTime.current) {
                event.preventDefault();
            }
        }
    };

    return (
        <MediaPlayer
            id="media-controller-atld"
            title="Bài học"
            className="absolute inset-0 w-full h-full bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-focus:ring-4"
            style={{
                maxHeight: "100%",
            }}
            src={src}
            crossOrigin
            playsInline
            onProviderChange={onProviderChange}
            onMediaSeekRequest={handleSeekRequest}
            onMediaSeekingRequest={handleSeekRequest}
            onEnded={onEnded}
            onPause={onPause}
            onPlay={onPlay}
            onError={(detail) => {
                if (onError) {
                    onError(
                        detail.code === 1
                            ? "hls_network"
                            : detail.code === 2
                              ? "hls_media"
                              : "native",
                        detail.message
                    );
                }
            }}
            onTimeUpdate={(detail, nativeEvent) => {
                if (!canSeek && detail.currentTime > maxWatchedTime.current) {
                    // Update the furthest watched time
                    maxWatchedTime.current = detail.currentTime;
                }

                if (onProgress) {
                    onProgress(nativeEvent as any);
                }
            }}
            ref={player}
        >
            <MediaProvider />

            <DefaultAudioLayout icons={defaultLayoutIcons} />

            <DefaultVideoLayout
                icons={defaultLayoutIcons}
                slots={{
                    fullscreenButton: <></>,
                }}
            />

            <TimeSlider.Root>
                <TimeSlider.Track>
                    <TimeSlider.Progress />
                </TimeSlider.Track>

                <TimeSlider.Thumb />
            </TimeSlider.Root>
        </MediaPlayer>
    );
};

export default VideoPlayer;
