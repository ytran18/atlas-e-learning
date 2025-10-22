import { useState } from "react";

import { Button, FileInput, Group, Input, Modal, Text, Textarea } from "@mantine/core";

interface VideoUploadModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; file: File | null }) => void;
    title?: string;
}

const VideoUploadModal = ({
    opened,
    onClose,
    onSubmit,
    title = "Thêm video mới",
}: VideoUploadModalProps) => {
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleSubmit = () => {
        onSubmit({
            title: videoTitle,
            description: videoDescription,
            file: videoFile,
        });

        // Reset form
        setVideoTitle("");
        setVideoDescription("");
        setVideoFile(null);
        onClose();
    };

    const handleClose = () => {
        // Reset form when closing
        setVideoTitle("");
        setVideoDescription("");
        setVideoFile(null);
        onClose();
    };

    const isFormValid = videoTitle.trim() && videoDescription.trim() && videoFile;

    return (
        <Modal opened={opened} onClose={handleClose} title={title} size="md">
            <div className="flex flex-col gap-y-4">
                <div>
                    <Text size="sm" fw={500} mb="xs">
                        Tiêu đề video
                    </Text>
                    <Input
                        placeholder="Nhập tiêu đề video"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                    />
                </div>

                <div>
                    <Text size="sm" fw={500} mb="xs">
                        Mô tả video
                    </Text>
                    <Textarea
                        placeholder="Nhập mô tả video"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        minRows={3}
                    />
                </div>

                <div>
                    <Text size="sm" fw={500} mb="xs">
                        Chọn file video
                    </Text>
                    <FileInput
                        placeholder="Chọn file video"
                        accept="video/*"
                        value={videoFile}
                        onChange={setVideoFile}
                    />
                </div>

                <Group justify="flex-end" gap="sm">
                    <Button variant="outline" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid}>
                        Thêm video
                    </Button>
                </Group>
            </div>
        </Modal>
    );
};

export default VideoUploadModal;
