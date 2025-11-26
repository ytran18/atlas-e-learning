import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Group, Input, Modal, Text, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useForm } from "react-hook-form";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { Video } from "@/types/api";

import { UploadResult } from "../../types/video";
import { VideoUploadFormData, videoUploadSchema } from "../../validations/videoUploadSchema";
import VideoDropzone, { VideoDropzoneRef } from "./VideoDropzone";

interface VideoUploadModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (video: Video) => void;
    title?: string;
}

const VideoUploadModal = ({ opened, onClose, onSubmit, title }: VideoUploadModalProps) => {
    const { t } = useI18nTranslate();
    const videoDropzoneRef = useRef<VideoDropzoneRef>(null);

    const [isUsingLink, setIsUsingLink] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
        getValues,
        resetField,
    } = useForm<VideoUploadFormData>({
        resolver: zodResolver(videoUploadSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            canSeek: true,
            shouldCompleteToPassed: true,
        },
    });

    const watchedFile = watch("file");

    const handleResetForm = (isClose: boolean = true) => {
        reset();

        videoDropzoneRef.current?.resetUpload();

        if (isClose) {
            onClose();
        }
    };

    // when user reload or close tab, warning user to save data
    useEffect(() => {
        function handleBeforeUnload(event: BeforeUnloadEvent) {
            if (!opened) {
                return;
            }

            event.preventDefault();

            event.returnValue = t("du_lieu_da_nhap_se_bi_mat");
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [opened, t]);

    const handleFormSubmit = async (data: VideoUploadFormData) => {
        try {
            if (isUsingLink) {
                const videoPayload: Video = {
                    id: crypto.randomUUID(), // Generate temporary ID
                    sortNo: 0, // Will be set by parent component
                    title: data.title,
                    description: data.description,
                    url: data?.url ?? "",
                    length: 0, // Will be updated when video metadata is available
                    canSeek: data.canSeek,
                    shouldCompleteToPassed: data.shouldCompleteToPassed,
                    thumbnailUrl: "",
                    isUsingLink: true,
                };

                onSubmit(videoPayload);

                handleResetForm();

                return;
            }

            // First upload the video
            if (videoDropzoneRef.current) {
                await videoDropzoneRef.current.uploadVideo();
            }
        } catch (error) {
            console.error("Upload failed:", error);
            return;
        }
    };

    const handleClose = () => {
        modals.openConfirmModal({
            title: t("ban_co_chac_chan_muon_thoat_khong"),
            centered: true,
            children: <Text size="sm">{t("thoat_se_mat_toan_bo_du_lieu_da_nhap")}</Text>,
            labels: { confirm: t("thoat"), cancel: t("huy") },
            confirmProps: { color: "red" },
            onCancel: () => {},
            onConfirm: () => handleResetForm(),
        });
    };

    const handleFileSelect = (file: File | null) => {
        if (file) {
            setValue("file", file);
        } else {
            resetField("file");
        }
    };

    const handleUploadComplete = (result: UploadResult) => {
        if (result.success && result.data?.publicUrl) {
            // Set the video URL and other properties after successful upload
            setValue("url", result.data.publicUrl);

            // Create Video object and submit
            const formData = getValues();

            const video: Video = {
                id: crypto.randomUUID(), // Generate temporary ID
                sortNo: 0, // Will be set by parent component
                title: formData.title,
                description: formData.description,
                url: result.data.publicUrl,
                length: 0, // Will be updated when video metadata is available
                canSeek: formData.canSeek,
                shouldCompleteToPassed: formData.shouldCompleteToPassed,
                thumbnailUrl: result.data.thumbnailUrl,
            };

            onSubmit(video);

            handleResetForm();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={title || t("them_video_moi")}
            size="lg"
            centered
            closeOnClickOutside={false}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <div>
                    <Text size="sm" fw={500} mb="xs">
                        {t("tieu_de_video")}
                    </Text>
                    <Input
                        placeholder={t("nhap_tieu_de_video")}
                        {...register("title")}
                        error={errors.title?.message}
                    />
                </div>

                <div>
                    <Text size="sm" fw={500} mb="xs">
                        {t("mo_ta_video")}
                    </Text>
                    <Textarea
                        placeholder={t("nhap_mo_ta_video")}
                        {...register("description")}
                        error={errors.description?.message}
                        minRows={3}
                    />
                </div>

                <Checkbox
                    label={t("su_dung_link_video")}
                    checked={isUsingLink}
                    onChange={(event) => setIsUsingLink(event.currentTarget.checked)}
                />

                {isUsingLink ? (
                    <Input
                        placeholder={t("nhap_link_video")}
                        {...register("url")}
                        error={errors.url?.message}
                    />
                ) : (
                    <VideoDropzone
                        ref={videoDropzoneRef}
                        onFileSelect={handleFileSelect}
                        onUploadComplete={handleUploadComplete}
                    />
                )}

                {errors.file && (
                    <Text size="sm" c="red">
                        {errors.file.message}
                    </Text>
                )}

                {((watchedFile && !isSubmitting) || isUsingLink) && (
                    <>
                        <Checkbox label={t("cho_phep_tua")} {...register("canSeek")} />
                        <Checkbox
                            label={t("xem_het_de_hoan_thanh")}
                            {...register("shouldCompleteToPassed")}
                        />
                    </>
                )}

                <Group justify="flex-end" gap="sm">
                    <Button variant="outline" onClick={handleClose} type="button">
                        {t("huy")}
                    </Button>

                    <Button
                        type="submit"
                        loading={isSubmitting || videoDropzoneRef.current?.isUploading}
                        disabled={
                            isUsingLink
                                ? false
                                : !watchedFile || videoDropzoneRef.current?.isUploading
                        }
                    >
                        {videoDropzoneRef.current?.isUploading
                            ? t("dang_tai_len")
                            : t("upload_video")}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default VideoUploadModal;
