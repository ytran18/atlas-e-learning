"use client";

import { ReactEventHandler } from "react";

import {
    MediaControlBar,
    MediaController,
    MediaFullscreenButton,
    MediaMuteButton,
    MediaPlayButton,
    MediaPlaybackRateButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
    src: string;
    canSeek?: boolean;
    onEnded?: () => void; // when video ended
    onPause?: () => void; // when video paused
    onPlay?: () => void; // when video played
    onProgress?: ReactEventHandler<HTMLVideoElement> | undefined; // when video progress
}

const VideoPlayer = ({
    src,
    canSeek = true,
    onEnded,
    onPause,
    onPlay,
    onProgress,
}: VideoPlayerProps) => {
    return (
        <MediaController
            style={{
                width: "100%",
                height: "80%",
                aspectRatio: "16/9",
            }}
        >
            <ReactPlayer
                slot="media"
                src={src}
                controls={false}
                onEnded={onEnded}
                onPause={onPause}
                onPlay={onPlay}
                onProgress={onProgress}
                style={
                    {
                        width: "100%",
                        height: "100%",
                        "--controls": "none",
                    } as React.CSSProperties
                }
            />

            <MediaControlBar className="w-full bg-[rgb(20,20,30)] px-2">
                <div className="w-full flex items-center gap-x-2">
                    <MediaPlayButton />

                    {canSeek && (
                        <>
                            <MediaSeekBackwardButton seekOffset={10} />

                            <MediaSeekForwardButton seekOffset={10} />
                        </>
                    )}

                    <MediaTimeRange className={`w-full ${canSeek ? "visible" : "invisible"}`} />

                    <MediaTimeDisplay showDuration />

                    <MediaMuteButton />

                    <MediaVolumeRange />

                    {canSeek && <MediaPlaybackRateButton />}

                    <MediaFullscreenButton />
                </div>
            </MediaControlBar>
        </MediaController>
    );
};

export default VideoPlayer;
