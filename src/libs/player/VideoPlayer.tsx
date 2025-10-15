"use client";

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

const VideoPlayer = () => {
    return (
        <MediaController
            style={{
                width: "100%",
                aspectRatio: "16/9",
            }}
        >
            <ReactPlayer
                slot="media"
                src="https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k"
                controls={false}
                style={
                    {
                        width: "100%",
                        height: "100%",
                        "--controls": "none",
                    } as React.CSSProperties
                }
            />

            <MediaControlBar>
                <MediaPlayButton />

                <MediaSeekBackwardButton seekOffset={10} />

                <MediaSeekForwardButton seekOffset={10} />

                <MediaTimeRange />

                <MediaTimeDisplay showDuration />

                <MediaMuteButton />

                <MediaVolumeRange />

                <MediaPlaybackRateButton />

                <MediaFullscreenButton />
            </MediaControlBar>
        </MediaController>
    );
};

export default VideoPlayer;
