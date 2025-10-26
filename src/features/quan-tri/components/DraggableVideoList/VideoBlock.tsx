import { useRef, useState } from "react";

import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import VideoPlayer from "@/libs/player/VideoPlayer";
import { Video } from "@/types/api";

import { UploadResult } from "../../types/video";
import VideoDropzone, { VideoDropzoneRef } from "../VideoUploadModal/VideoDropzone";

type VideoBlockProps = {
    video: Video;
    onVideoReplace?: (newUrl: string) => void;
    newVideoUrl?: string | null;
};

const VideoBlock = ({ video, onVideoReplace, newVideoUrl }: VideoBlockProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const videoDropzoneRef = useRef<VideoDropzoneRef>(null);

    const handleVideoReplace = () => {
        const id = modals.open({
            title: "Thay đổi video",
            centered: true,
            children: (
                <div className="flex flex-col gap-y-4">
                    <VideoDropzone
                        ref={videoDropzoneRef}
                        onFileSelect={() => {}}
                        onUploadComplete={(result: UploadResult) => {
                            console.log("Upload complete:", result);
                            if (result.success && result.data?.publicUrl) {
                                onVideoReplace?.(result.data.publicUrl);

                                notifications.show({
                                    title: "Thành công",
                                    message: "Video mới đã được tải lên và chuyển đổi thành công",
                                    color: "green",
                                });

                                // Defer state update và đóng modal để tránh lỗi render
                                setTimeout(() => {
                                    setIsUploading(false);
                                    modals.close(id);
                                }, 0);
                            } else {
                                notifications.show({
                                    title: "Lỗi",
                                    message: "Có lỗi xảy ra khi tải lên video. Vui lòng thử lại.",
                                    color: "red",
                                });

                                // Defer state update để tránh lỗi render
                                setTimeout(() => {
                                    setIsUploading(false);
                                }, 0);
                            }
                        }}
                    />

                    <div className="flex justify-end gap-x-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                videoDropzoneRef.current?.resetUpload();
                                setTimeout(() => {
                                    setIsUploading(false);
                                    modals.close(id);
                                }, 0);
                            }}
                            disabled={isUploading}
                        >
                            Hủy
                        </Button>

                        <Button
                            color="blue"
                            loading={isUploading}
                            disabled={isUploading}
                            onClick={async () => {
                                if (videoDropzoneRef.current) {
                                    setIsUploading(true);
                                    try {
                                        console.log("Uploading video...");
                                        // Upload video và chờ đến khi hoàn thành
                                        await videoDropzoneRef.current.uploadVideo();
                                        // Modal sẽ được đóng trong onUploadComplete
                                    } catch (error) {
                                        console.error("Upload failed:", error);

                                        notifications.show({
                                            title: "Lỗi",
                                            message:
                                                "Có lỗi xảy ra khi tải lên video. Vui lòng thử lại.",
                                            color: "red",
                                        });

                                        // Defer state update để tránh lỗi render
                                        setTimeout(() => {
                                            setIsUploading(false);
                                        }, 0);
                                    }
                                }
                            }}
                        >
                            {isUploading ? "Đang tải lên..." : "Thay đổi video"}
                        </Button>
                    </div>
                </div>
            ),
            onClose: () => {
                videoDropzoneRef.current?.resetUpload();
                setTimeout(() => {
                    setIsUploading(false);
                }, 0);
            },
        });
    };

    const currentVideoUrl = newVideoUrl || video.url;

    return (
        <div className="w-full flex gap-x-4 items-center">
            <div className="w-[200px] h-[100px]">
                <VideoPlayer src={currentVideoUrl} isPreview />
            </div>

            <Button onClick={handleVideoReplace} disabled={isUploading}>
                {isUploading ? "Đang tải lên..." : "Thay đổi video"}
            </Button>
        </div>
    );
};

export default VideoBlock;
