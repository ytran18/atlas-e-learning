import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

import VideoPlayer from "@/libs/player/VideoPlayer";
import { Video } from "@/types/api";

interface DraggableVideoListProps {
    videos: Video[];
    onDragEnd: (result: any) => void;
    isEditMode: boolean;
}

const DraggableVideoList = ({ videos, onDragEnd, isEditMode }: DraggableVideoListProps) => {
    if (isEditMode) {
        return (
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
        );
    }

    return (
        <div className="flex flex-col gap-y-3">
            {videos.map((video, index) => (
                <Card withBorder key={`video-${video.sortNo}-${index}`}>
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
