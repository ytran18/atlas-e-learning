import { useState } from "react";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Controller } from "react-hook-form";

import { useAtldAdminDetailContext } from "@/features/quan-tri/contexts/AtldAdminDetailContext";
import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";
import DraggableVideoList from "@/features/shared/_components/forms/DraggableVideoList";
import EditableField from "@/features/shared/_components/forms/EditableField";
import VideoUploadModal from "@/features/shared/_components/forms/VideoUploadModal";

const TheoryTab = () => {
    const { courseDetail, isEditMode } = useAtldAdminDetailContext();
    const { theory } = courseDetail;

    // Use the shared course form context
    const { form, isLoading, editVideos, handleTheoryDragEnd, handleAddVideo } =
        useCourseFormContext();

    // Add video modal state
    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

    return (
        <div className="flex flex-col w-full gap-y-6">
            <div className="w-full flex justify-between items-start gap-x-6">
                <div className="flex flex-col gap-y-3 flex-1">
                    <Controller
                        name="theory.title"
                        control={form.control}
                        render={({ field }) => (
                            <EditableField
                                value={field.value}
                                onChange={field.onChange}
                                isEditing={isEditMode}
                                size="lg"
                                fw={500}
                            />
                        )}
                    />

                    <Controller
                        name="theory.description"
                        control={form.control}
                        render={({ field }) => (
                            <EditableField
                                value={field.value}
                                onChange={field.onChange}
                                isEditing={isEditMode}
                                size="sm"
                                multiline
                                minRows={2}
                                maxRows={4}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-y-3">
                <DraggableVideoList
                    videos={isEditMode ? editVideos : theory.videos}
                    onDragEnd={handleTheoryDragEnd}
                    isEditMode={isEditMode}
                />

                {isEditMode && (
                    <Button
                        leftSection={<IconPlus size={20} />}
                        variant="outline"
                        onClick={() => setIsAddVideoModalOpen(true)}
                        className="mt-2 !w-fit"
                        disabled={isLoading}
                    >
                        Thêm video
                    </Button>
                )}
            </div>

            {/* Add Video Modal */}
            <VideoUploadModal
                opened={isAddVideoModalOpen}
                onClose={() => setIsAddVideoModalOpen(false)}
                onSubmit={handleAddVideo}
                title="Thêm video mới"
            />
        </div>
    );
};

export default TheoryTab;
