import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, Image, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { Empty } from "antd";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { Video } from "@/types/api";

import ModalEditVideo from "./ModalEditVideo";

interface DraggableVideoListProps {
    videos: Video[];
    isEditMode: boolean;
    onDragEnd: (result: any) => void;
    onUpdateVideo?: (
        videoId: string,
        data: {
            title: string;
            description: string;
            canSeek: boolean;
            shouldCompleteToPassed: boolean;
            url: string;
            thumbnailUrl: string;
        }
    ) => void;
    onDeleteVideo?: (videoId: string) => void;
}

const DraggableVideoList = ({
    videos,
    isEditMode,
    onDragEnd,
    onUpdateVideo,
    onDeleteVideo,
}: DraggableVideoListProps) => {
    const { t } = useI18nTranslate();

    const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState<boolean>(false);

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const noData = videos.length === 0 || !videos;

    const handleEditVideo = (video: Video) => {
        setSelectedVideo(video);
        setIsEditVideoModalOpen(true);
    };

    const handleDeleteVideo = (video: Video) => {
        if (onDeleteVideo && video.id) {
            modals.openConfirmModal({
                title: t("xac_nhan_xoa_video"),
                centered: true,
                children: <Text size="sm">{t("ban_co_chac_chan_muon_xoa_video_nay")}</Text>,
                labels: { confirm: t("xoa"), cancel: t("huy") },
                confirmProps: { color: "red" },
                onCancel: () => {},
                onConfirm: () => onDeleteVideo(video.id),
            });
        }
    };

    const handleUpdateVideo = (data: {
        title: string;
        description: string;
        id: string;
        canSeek: boolean;
        shouldCompleteToPassed: boolean;
        url: string;
        thumbnailUrl: string;
    }) => {
        if (selectedVideo && onUpdateVideo) {
            onUpdateVideo(data.id, data);
        }
    };

    const handleCloseEditVideoModal = () => {
        setIsEditVideoModalOpen(false);
        setSelectedVideo(null);
    };

    const renderEditButtons = (video: Video) => {
        return (
            <div className="flex items-center gap-x-2">
                <Tooltip label={t("xoa_video")} withArrow>
                    <ThemeIcon
                        color="red"
                        className="cursor-pointer"
                        size="md"
                        onClick={() => handleDeleteVideo(video)}
                    >
                        <IconTrash />
                    </ThemeIcon>
                </Tooltip>

                <Tooltip label={t("chinh_sua")} withArrow>
                    <ThemeIcon
                        color="blue"
                        className="cursor-pointer"
                        size="md"
                        onClick={() => handleEditVideo(video)}
                    >
                        <IconEdit />
                    </ThemeIcon>
                </Tooltip>
            </div>
        );
    };

    if (noData) {
        return (
            <div className="flex flex-col gap-y-3 w-full mt-3">
                <Empty description={t("khong_co_video")} />
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

                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-3 gap-y-3 w-full">
                                                        <div className="flex items-center justify-between w-full sm:w-auto">
                                                            <div className="w-[100px] h-[50px]">
                                                                <Image
                                                                    src={video?.thumbnailUrl}
                                                                    alt={video.title}
                                                                    fallbackSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
                                                                />
                                                            </div>

                                                            {isMobile && renderEditButtons(video)}
                                                        </div>

                                                        <div className="flex-1">
                                                            <Text size="sm" fw={500}>
                                                                {video.title}
                                                            </Text>

                                                            <Text size="sm" c="dimmed">
                                                                {video.description}
                                                            </Text>
                                                        </div>

                                                        {!isMobile && renderEditButtons(video)}
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
                <Tooltip
                    label={t("nhan_vao_day_de_xem_video")}
                    withArrow
                    key={`video-${video.sortNo}-${index}`}
                >
                    <Card
                        withBorder
                        onClick={() => {
                            window.open(video.url, "_blank");
                        }}
                    >
                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <div className="w-[100px] h-[50px]">
                                <Image
                                    src={video?.thumbnailUrl}
                                    alt={video.title}
                                    fallbackSrc="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
                                />
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
                </Tooltip>
            ))}
        </div>
    );
};

export default DraggableVideoList;
