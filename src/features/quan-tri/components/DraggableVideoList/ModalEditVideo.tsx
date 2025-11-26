import { useEffect, useState } from "react";

import { Button, Checkbox, Input, Modal, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { FormProvider, useForm } from "react-hook-form";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { Video } from "@/types/api";

import VideoBlock from "./VideoBlock";

type ModalEditVideoProps = {
    opened: boolean;
    video: Video;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        id: string;
        canSeek: boolean;
        shouldCompleteToPassed: boolean;
        url: string;
        thumbnailUrl: string;
    }) => void;
};

type ModalEditVideoFormData = {
    title: string;
    isUsingLink: boolean;
    url: string;
    thumbnailUrl: string;
    description: string;
    canSeek: boolean;
    shouldCompleteToPassed: boolean;
};

const ModalEditVideo = ({ opened, video, onClose, onSubmit }: ModalEditVideoProps) => {
    const { t } = useI18nTranslate();

    const [newVideoUrl, setNewVideoUrl] = useState<string | null>(null);

    const [newThumbnailUrl, setNewThumbnailUrl] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const [hasSelectedFile, setHasSelectedFile] = useState(false);

    const form = useForm<ModalEditVideoFormData>({
        defaultValues: {
            title: video?.title || "",
            description: video?.description || "",
            canSeek: video?.canSeek || false,
            shouldCompleteToPassed: video?.shouldCompleteToPassed || true,
            thumbnailUrl: video?.thumbnailUrl || "",
            isUsingLink: video?.isUsingLink || false,
        },
    });

    // Reset form when video changes
    useEffect(() => {
        if (video) {
            form.reset({
                title: video.title || "",
                description: video.description || "",
                canSeek: video.canSeek || false,
                shouldCompleteToPassed: video.shouldCompleteToPassed || true,
                thumbnailUrl: video?.thumbnailUrl || "",
                isUsingLink: video?.isUsingLink || false,
                url: video.url || "",
            });

            setNewVideoUrl(null);

            setNewThumbnailUrl(null);

            setIsUploading(false);

            setHasSelectedFile(false);
        }
    }, [video, form]);

    const handleSubmit = async (data: ModalEditVideoFormData) => {
        setIsSubmitting(true);

        try {
            const value = {
                ...data,
                id: video.id,
                url: data.isUsingLink ? data.url : newVideoUrl || video.url,
                thumbnailUrl: data.thumbnailUrl,
                canSeek: data.canSeek,
                shouldCompleteToPassed: data.shouldCompleteToPassed,
            };

            await onSubmit(value);

            notifications.show({
                title: t("thanh_cong"),
                message: t("video_da_duoc_cap_nhat_thanh_cong"),
                color: "green",
                position: "top-right",
            });

            onClose();
        } catch (error) {
            console.error("Error updating video:", error);
            notifications.show({
                title: t("loi"),
                message: t("co_loi_xay_ra_khi_cap_nhat_video_vui_long_thu_lai"),
                color: "red",
                position: "top-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVideoReplace = (newUrl: string, thumbnailUrl: string) => {
        setNewVideoUrl(newUrl);
        setNewThumbnailUrl(thumbnailUrl);
        // Cập nhật thumbnailUrl vào form
        form.setValue("thumbnailUrl", thumbnailUrl);
    };

    const handleClose = () => {
        if (form.formState.isDirty || newVideoUrl || isUploading || hasSelectedFile) {
            modals.openConfirmModal({
                title: <p className="font-bold">{t("ban_co_chac_chan_muon_thoat")}</p>,
                centered: true,
                children: <p>{t("cac_thay_doi_chua_luu_se_bi_mat")}</p>,
                labels: { confirm: t("thoat"), cancel: t("huy") },
                confirmProps: { color: "red" },
                onCancel: () => {},
                onConfirm: () => {
                    form.reset();
                    setNewVideoUrl(null);
                    setNewThumbnailUrl(null);
                    setIsUploading(false);
                    setHasSelectedFile(false);
                    onClose();
                },
            });
        } else {
            onClose();
        }
    };

    if (!video) {
        return null;
    }

    return (
        <Modal
            size="lg"
            title={t("chinh_sua_video")}
            opened={opened}
            onClose={handleClose}
            closeOnClickOutside={false}
            centered
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">
                    <Input.Wrapper label={t("tieu_de_video")} withAsterisk>
                        <Input
                            placeholder={t("tieu_de_video")}
                            {...form.register("title", {
                                required: t("tieu_de_video_la_bat_buoc"),
                            })}
                            error={form.formState.errors.title?.message}
                        />
                    </Input.Wrapper>

                    <Input.Wrapper label={t("mo_ta_video")} withAsterisk>
                        <Textarea
                            placeholder={t("mo_ta_video")}
                            {...form.register("description", {
                                required: t("mo_ta_video_la_bat_buoc"),
                            })}
                            error={form.formState.errors.description?.message}
                        />
                    </Input.Wrapper>

                    <VideoBlock
                        video={video}
                        onVideoReplace={handleVideoReplace}
                        newThumbnailUrl={newThumbnailUrl}
                        newVideoUrl={newVideoUrl}
                        onUploadStateChange={(uploading, fileSelected) => {
                            setIsUploading(uploading);
                            setHasSelectedFile(fileSelected);
                        }}
                    />

                    <Checkbox label={t("cho_phep_tua")} {...form.register("canSeek")} />

                    <Checkbox
                        label={t("xem_het_de_hoan_thanh")}
                        {...form.register("shouldCompleteToPassed")}
                    />

                    <div className="flex justify-end gap-x-2 mt-4">
                        <Button variant="outline" onClick={handleClose} type="button">
                            {t("huy")}
                        </Button>
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={(!form.formState.isDirty && !newVideoUrl) || isUploading}
                        >
                            {t("cap_nhat")}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};

export default ModalEditVideo;
