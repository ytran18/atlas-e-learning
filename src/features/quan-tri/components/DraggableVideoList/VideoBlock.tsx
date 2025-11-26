import { useEffect, useRef, useState } from "react";

import { Button, Checkbox, Image, Input } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useFormContext, useWatch } from "react-hook-form";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
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
    const { t } = useI18nTranslate();
    const [isUploading, setIsUploading] = useState(false);

    const [showUploadArea, setShowUploadArea] = useState(false);

    const [hasSelectedFile, setHasSelectedFile] = useState(false);

    const videoDropzoneRef = useRef<VideoDropzoneRef>(null);

    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const isUsingLink = useWatch({ name: "isUsingLink", control });

    // Notify parent component when upload state changes
    useEffect(() => {
        onUploadStateChange?.(isUploading, hasSelectedFile);
    }, [isUploading, hasSelectedFile, onUploadStateChange]);

    const handleUploadComplete = (result: UploadResult) => {
        if (result.success && result.data?.publicUrl && result.data.thumbnailUrl) {
            onVideoReplace?.(result.data.publicUrl, result.data.thumbnailUrl);

            notifications.show({
                title: t("thanh_cong"),
                message: t("video_moi_da_duoc_tai_len_va_chuyen_doi_thanh_cong"),
                color: "green",
                position: "top-right",
            });

            // Reset state
            setTimeout(() => {
                setIsUploading(false);
                setShowUploadArea(false);
                setHasSelectedFile(false);
            }, 0);
        } else {
            notifications.show({
                title: t("loi"),
                message: t("co_loi_xay_ra_khi_tai_len_video_vui_long_thu_lai"),
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
                    title: t("loi"),
                    message: t("co_loi_xay_ra_khi_tai_len_video_vui_long_thu_lai"),
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
        <div className="w-full flex flex-col gap-y-4">
            <div className="flex gap-x-4 items-start mb-4">
                <div className="w-[200px] h-[100px]">
                    <Image
                        src={newThumbnailUrl || video?.thumbnailUrl}
                        alt={video.title}
                        fallbackSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    {!showUploadArea && (
                        <Button
                            onClick={() => setShowUploadArea(true)}
                            disabled={isUploading}
                            color="blue"
                        >
                            {t("thay_doi_video")}
                        </Button>
                    )}

                    {showUploadArea && hasSelectedFile && (
                        <div className="flex gap-x-2">
                            <Button
                                onClick={() => {
                                    modals.openConfirmModal({
                                        title: t("ban_co_chac_chan_muon_huy_khong"),
                                        centered: true,
                                        children: (
                                            <p>
                                                {t(
                                                    "huy_se_mat_toan_bo_du_lieu_da_nhap_va_file_da_chon"
                                                )}
                                            </p>
                                        ),
                                        labels: { confirm: t("huy"), cancel: t("khong") },
                                        confirmProps: { color: "red" },
                                        onCancel: () => {},
                                        onConfirm: handleResetUpload,
                                    });
                                }}
                                disabled={isUploading}
                                color="red"
                                variant="outline"
                            >
                                {t("huy_thay_doi")}
                            </Button>
                            <Button
                                onClick={() => setShowUploadArea(false)}
                                disabled={isUploading}
                                color="gray"
                                variant="default"
                            >
                                {t("dong")}
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
                            {t("dong")}
                        </Button>
                    )}
                </div>
            </div>

            {showUploadArea && (
                <>
                    <Checkbox
                        label={t("su_dung_link_video")}
                        checked={isUsingLink}
                        {...register("isUsingLink")}
                        error={errors.isUsingLink?.message as string}
                    />

                    {isUsingLink ? (
                        <Input
                            placeholder={t("nhap_link_video")}
                            {...register("url")}
                            error={errors.url?.message as string}
                        />
                    ) : (
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
                                        {isUploading ? t("dang_tai_len") : t("tai_len_video")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VideoBlock;
