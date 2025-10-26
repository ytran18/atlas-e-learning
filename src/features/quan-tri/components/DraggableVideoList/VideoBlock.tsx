import { useEffect, useRef, useState } from "react";

import { Button, Image } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { Video } from "@/types/api";

import { UploadResult } from "../../types/video";
import VideoDropzone, { VideoDropzoneRef } from "../VideoUploadModal/VideoDropzone";

type VideoBlockProps = {
    video: Video;
    onVideoReplace?: (newUrl: string, newThumbnailUrl: string) => void;
    newVideoUrl?: string | null;
    newThumbnailUrl?: string | null;
    onUploadStateChange?: (isUploading: boolean, hasSelectedFile: boolean) => void;
};

const VideoBlock = ({
    video,
    onVideoReplace,
    newThumbnailUrl,
    onUploadStateChange,
}: VideoBlockProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const [showUploadArea, setShowUploadArea] = useState(false);

    const [hasSelectedFile, setHasSelectedFile] = useState(false);

    const videoDropzoneRef = useRef<VideoDropzoneRef>(null);

    // Notify parent component when upload state changes
    useEffect(() => {
        onUploadStateChange?.(isUploading, hasSelectedFile);
    }, [isUploading, hasSelectedFile, onUploadStateChange]);

    const handleUploadComplete = (result: UploadResult) => {
        if (result.success && result.data?.publicUrl && result.data.thumbnailUrl) {
            onVideoReplace?.(result.data.publicUrl, result.data.thumbnailUrl);

            notifications.show({
                title: "Thành công",
                message: "Video mới đã được tải lên và chuyển đổi thành công",
                color: "green",
            });

            // Reset state
            setTimeout(() => {
                setIsUploading(false);
                setShowUploadArea(false);
                setHasSelectedFile(false);
            }, 0);
        } else {
            notifications.show({
                title: "Lỗi",
                message: "Có lỗi xảy ra khi tải lên video. Vui lòng thử lại.",
                color: "red",
            });

            setTimeout(() => {
                setIsUploading(false);
            }, 0);
        }
    };

    const handleUploadVideo = async () => {
        if (videoDropzoneRef.current) {
            setIsUploading(true);
            try {
                await videoDropzoneRef.current.uploadVideo();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                notifications.show({
                    title: "Lỗi",
                    message: "Có lỗi xảy ra khi tải lên video. Vui lòng thử lại.",
                    color: "red",
                });

                setTimeout(() => {
                    setIsUploading(false);
                }, 0);
            }
        }
    };

    const handleFileSelect = () => {
        setHasSelectedFile(true);

        if (!showUploadArea) {
            setShowUploadArea(true);
        }
    };

    const handleResetUpload = () => {
        videoDropzoneRef.current?.resetUpload();

        setShowUploadArea(false);

        setIsUploading(false);

        setHasSelectedFile(false);
    };

    return (
        <div className="w-full">
            <div className="flex gap-x-4 items-start mb-4">
                <div className="w-[200px] h-[100px]">
                    <Image src={newThumbnailUrl || video.thumbnailUrl} alt={video.title} />
                </div>

                <div className="flex flex-col gap-y-2">
                    {!showUploadArea && (
                        <Button
                            onClick={() => setShowUploadArea(true)}
                            disabled={isUploading}
                            color="blue"
                        >
                            Thay đổi video
                        </Button>
                    )}

                    {showUploadArea && hasSelectedFile && (
                        <div className="flex gap-x-2">
                            <Button
                                onClick={() => {
                                    modals.openConfirmModal({
                                        title: "Bạn có chắc chắn muốn hủy không?",
                                        centered: true,
                                        children: (
                                            <p>
                                                Hủy sẽ mất toàn bộ dữ liệu đã nhập và file đã chọn
                                            </p>
                                        ),
                                        labels: { confirm: "Hủy", cancel: "Không" },
                                        confirmProps: { color: "red" },
                                        onCancel: () => {},
                                        onConfirm: handleResetUpload,
                                    });
                                }}
                                disabled={isUploading}
                                color="red"
                                variant="outline"
                            >
                                Hủy thay đổi
                            </Button>
                            <Button
                                onClick={() => setShowUploadArea(false)}
                                disabled={isUploading}
                                color="gray"
                                variant="default"
                            >
                                Đóng
                            </Button>
                        </div>
                    )}

                    {showUploadArea && !hasSelectedFile && (
                        <Button
                            onClick={() => setShowUploadArea(false)}
                            disabled={isUploading}
                            color="gray"
                            variant="default"
                        >
                            Đóng
                        </Button>
                    )}
                </div>
            </div>

            {showUploadArea && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="mb-4">
                        <VideoDropzone
                            ref={videoDropzoneRef}
                            onFileSelect={handleFileSelect}
                            onUploadComplete={handleUploadComplete}
                        />
                    </div>

                    {hasSelectedFile && (
                        <div className="flex justify-end gap-x-2">
                            <Button
                                color="blue"
                                loading={isUploading}
                                disabled={isUploading}
                                onClick={handleUploadVideo}
                            >
                                {isUploading ? "Đang tải lên..." : "Tải lên video"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoBlock;
