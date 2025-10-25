import { useEffect } from "react";

import { Button, Checkbox, Input, Modal, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";

import { Video } from "@/types/api";

type ModalEditVideoProps = {
    opened: boolean;
    video: Video;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; id: string }) => void;
};

const ModalEditVideo = ({ opened, video, onClose, onSubmit }: ModalEditVideoProps) => {
    const form = useForm<{ title: string; description: string }>({
        defaultValues: {
            title: video?.title || "",
            description: video?.description || "",
        },
    });

    // Reset form when video changes
    useEffect(() => {
        if (video) {
            console.log({ video });

            form.reset({
                title: video.title || "",
                description: video.description || "",
            });
        }
    }, [video, form]);

    const handleSubmit = (data: { title: string; description: string }) => {
        const value = {
            ...data,
            id: video.id,
        };

        onSubmit(value);
        onClose();
    };

    if (!video) {
        return null;
    }

    return (
        <Modal size="lg" title="Chỉnh sửa video" opened={opened} onClose={onClose} centered>
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
                        {...form.register("description", { required: "Mô tả video là bắt buộc" })}
                        error={form.formState.errors.description?.message}
                    />
                </Input.Wrapper>

                {/* <div className="w-full flex items-center justify-between"> */}
                <Checkbox label="Cho phép tua" />

                <Checkbox label="Xem hết để hoàn thành" defaultChecked />
                {/* </div> */}

                <div className="flex justify-end gap-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit" loading={form.formState.isSubmitting}>
                        Cập nhật
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalEditVideo;
