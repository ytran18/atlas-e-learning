import { useEffect, useState } from "react";

import { Button, Checkbox, Input, Modal, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { FormProvider, useForm } from "react-hook-form";

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
            };

            await onSubmit(value);

            notifications.show({
                title: "Thành công",
                message: "Video đã được cập nhật thành công",
                color: "green",
                position: "top-right",
            });

            onClose();
        } catch (error) {
            console.error("Error updating video:", error);
            notifications.show({
                title: "Lỗi",
                message: "Có lỗi xảy ra khi cập nhật video. Vui lòng thử lại.",
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
                title: <p className="font-bold">Bạn có chắc chắn muốn thoát?</p>,
                centered: true,
                children: <p>Các thay đổi chưa lưu sẽ bị mất.</p>,
                labels: { confirm: "Thoát", cancel: "Huỷ" },
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
            title="Chỉnh sửa video"
            opened={opened}
            onClose={handleClose}
            closeOnClickOutside={false}
            centered
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">
                    <Input.Wrapper label="Tiêu đề video" withAsterisk>
                        <Input
                            placeholder="Tiêu đề video"
                            {...form.register("title", { required: "Tiêu đề video là bắt buộc" })}
                            error={form.formState.errors.title?.message}
                        />
                    </Input.Wrapper>

                    <Input.Wrapper label="Mô tả video" withAsterisk>
                        <Textarea
                            placeholder="Mô tả video"
                            {...form.register("description", {
                                required: "Mô tả video là bắt buộc",
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

                    <Checkbox label="Cho phép tua" {...form.register("canSeek")} />

                    <Checkbox
                        label="Xem hết để hoàn thành"
                        {...form.register("shouldCompleteToPassed")}
                    />

                    <div className="flex justify-end gap-x-2 mt-4">
                        <Button variant="outline" onClick={handleClose} type="button">
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={(!form.formState.isDirty && !newVideoUrl) || isUploading}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};

export default ModalEditVideo;
