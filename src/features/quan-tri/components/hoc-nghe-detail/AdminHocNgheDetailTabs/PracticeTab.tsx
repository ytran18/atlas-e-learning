import { useState } from "react";

import { Button, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Controller } from "react-hook-form";

import { useHocNgheAdminDetailContext } from "@/features/quan-tri/contexts/AdminDetailContext";
import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import DraggableVideoList from "../../DraggableVideoList";
import EditableField from "../../EditableField";
import VideoUploadModal from "../../VideoUploadModal";

const PracticeTab = () => {
    const { t } = useI18nTranslate();
    const { courseDetail, isEditMode } = useHocNgheAdminDetailContext();

    const { practice } = courseDetail;

    // Use the shared course form context
    const {
        form,
        isLoading,
        editPractice,
        handlePracticeDragEnd,
        handleAddVideo,
        handleUpdateVideo,
    } = useCourseFormContext();

    // Add video modal state
    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

    return (
        <div className="flex flex-col w-full gap-y-6 px-4 sm:px-0">
            <div className="w-full flex justify-between items-start gap-x-6">
                <div className="flex flex-col gap-y-3 flex-1">
                    <Controller
                        name="practice.title"
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
                        name="practice.description"
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
                <Text fw={500}>{t("video_thuc_hanh")}</Text>

                <DraggableVideoList
                    videos={isEditMode ? editPractice.videos : practice.videos}
                    onDragEnd={handlePracticeDragEnd}
                    isEditMode={isEditMode}
                    onUpdateVideo={handleUpdateVideo}
                />

                {isEditMode && (
                    <Button
                        leftSection={<IconPlus size={20} />}
                        variant="outline"
                        onClick={() => setIsAddVideoModalOpen(true)}
                        className="mt-2 w-fit!"
                        disabled={isLoading}
                    >
                        {t("them_video")}
                    </Button>
                )}
            </div>

            {/* Add Video Modal */}
            <VideoUploadModal
                opened={isAddVideoModalOpen}
                onClose={() => setIsAddVideoModalOpen(false)}
                onSubmit={(video) => handleAddVideo({ video, section: "practice" })}
                title={t("them_video_moi")}
            />
        </div>
    );
};

export default PracticeTab;
