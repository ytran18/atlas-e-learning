import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";

import Empty from "@/components/Empty";
import VideoPlayer from "@/libs/player/VideoPlayer";
import { Video } from "@/types/api";

import ModalEditVideo from "./ModalEditVideo";

interface DraggableVideoListProps {
    videos: Video[];
    isEditMode: boolean;
    onDragEnd: (result: any) => void;
    onUpdateVideo?: (videoId: string, data: { title: string; description: string }) => void;
    onDeleteVideo?: (videoId: string) => void;
}

const DraggableVideoList = ({
    videos,
    isEditMode,
    onDragEnd,
    onUpdateVideo,
    onDeleteVideo,
}: DraggableVideoListProps) => {
    const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState<boolean>(false);

    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const noData = videos.length === 0 || !videos;

    const handleEditVideo = (video: Video) => {
        setSelectedVideo(video);
        setIsEditVideoModalOpen(true);
    };

    const handleDeleteVideo = (video: Video) => {
        if (onDeleteVideo && video.id) {
            modals.openConfirmModal({
                title: "Xác nhận xóa video",
                centered: true,
                children: <Text size="sm">Bạn có chắc chắn muốn xóa video này?</Text>,
                labels: { confirm: "Xóa", cancel: "Huỷ" },
                confirmProps: { color: "red" },
                onCancel: () => {},
                onConfirm: () => onDeleteVideo(video.id),
            });
        }
    };

    const handleUpdateVideo = (data: { title: string; description: string; id: string }) => {
        if (selectedVideo && onUpdateVideo) {
            onUpdateVideo(data.id, data);
        }
    };

    const handleCloseEditVideoModal = () => {
        setIsEditVideoModalOpen(false);
        setSelectedVideo(null);
    };

    if (noData) {
        return (
            <div className="flex flex-col gap-y-3 w-full mt-3">
                <Empty title="Không có video" />
            </div>
        );
    }

    if (isEditMode) {
        return (
            <>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="videos">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex flex-col gap-y-3"
                            >
                                {videos.map((video, index) => (
                                    <Draggable
                                        key={`video-${video.sortNo}-${index}`}
                                        draggableId={`video-${video.sortNo}-${index}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Card
                                                withBorder
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                                }}
                                            >
                                                <div className="flex items-center gap-x-3">
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="cursor-grab active:cursor-grabbing"
                                                    >
                                                        <IconGripVertical
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    </div>

                                                    <div className="w-[100px] h-[50px]">
                                                        <VideoPlayer src={video.url} isPreview />
                                                    </div>

                                                    <div className="flex-1">
                                                        <Text size="sm" fw={500}>
                                                            {video.title}
                                                        </Text>

                                                        <Text size="sm" c="dimmed">
                                                            {video.description}
                                                        </Text>
                                                    </div>

                                                    <div className="flex items-center gap-x-2">
                                                        <Tooltip label="Xóa video" withArrow>
                                                            <ThemeIcon
                                                                color="red"
                                                                className="cursor-pointer"
                                                                size="md"
                                                                onClick={() =>
                                                                    handleDeleteVideo(video)
                                                                }
                                                            >
                                                                <IconTrash />
                                                            </ThemeIcon>
                                                        </Tooltip>

                                                        <Tooltip label="Chỉnh sửa" withArrow>
                                                            <ThemeIcon
                                                                color="blue"
                                                                className="cursor-pointer"
                                                                size="md"
                                                                onClick={() =>
                                                                    handleEditVideo(video)
                                                                }
                                                            >
                                                                <IconEdit />
                                                            </ThemeIcon>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <ModalEditVideo
                    opened={isEditVideoModalOpen}
                    video={selectedVideo as Video}
                    onClose={handleCloseEditVideoModal}
                    onSubmit={handleUpdateVideo}
                />
            </>
        );
    }

    return (
        <div className="flex flex-col gap-y-3">
            {videos.map((video, index) => (
                <Card
                    withBorder
                    key={`video-${video.sortNo}-${index}`}
                    onClick={() => {
                        window.open(video.url, "_blank");
                    }}
                >
                    <div className="flex items-center gap-x-3 cursor-pointer">
                        <div className="w-[100px] h-[50px]">
                            <VideoPlayer src={video.url} isPreview />
                        </div>

                        <div className="">
                            <Text size="sm" fw={500}>
                                {video.title}
                            </Text>

                            <Text size="sm" c="dimmed">
                                {video.description}
                            </Text>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DraggableVideoList;
