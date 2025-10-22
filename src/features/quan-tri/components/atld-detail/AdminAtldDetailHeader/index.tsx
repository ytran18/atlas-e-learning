import { Card, Group } from "@mantine/core";
import { Controller } from "react-hook-form";

import { useAtldAdminDetailContext } from "@/features/quan-tri/contexts/AtldAdminDetailContext";
import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";
import EditModeButtons from "@/features/shared/_components/forms/EditModeButtons";
import EditableField from "@/features/shared/_components/forms/EditableField";

const AdminAtldDetailHeader = () => {
    const { isEditMode, setIsEditMode } = useAtldAdminDetailContext();

    // Use the shared course form context
    const { form, isLoading, handleEditToggle, handleCancelEdit } = useCourseFormContext();

    // Handle save with edit mode toggle
    const handleSave = async () => {
        await handleEditToggle();
        setIsEditMode(false);
    };

    // Handle cancel with edit mode toggle
    const handleCancel = () => {
        handleCancelEdit();
        setIsEditMode(false);
    };

    return (
        <Card withBorder shadow="md" radius="md" p="md" className="!overflow-visible">
            <Group justify="space-between" align="center">
                <div className="flex-1 flex flex-col gap-y-3">
                    <div className="w-full flex items-start justify-between gap-x-4">
                        <div className="w-full">
                            <Group mb="xs">
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field }) => (
                                        <EditableField
                                            value={field.value}
                                            onChange={field.onChange}
                                            isEditing={isEditMode}
                                            size="lg"
                                            className="w-full"
                                            fw={600}
                                        />
                                    )}
                                />
                            </Group>

                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <EditableField
                                        value={field.value}
                                        onChange={field.onChange}
                                        isEditing={isEditMode}
                                        size="sm"
                                        multiline
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-end flex-1">
                            <EditModeButtons
                                isEditMode={isEditMode}
                                onEdit={() => setIsEditMode(true)}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                saveDisabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </Group>
        </Card>
    );
};

export default AdminAtldDetailHeader;
