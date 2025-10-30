import { useParams, useRouter } from "next/navigation";

import { Card, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Controller } from "react-hook-form";

import { useAtldAdminDetailContext } from "@/features/quan-tri/contexts/AdminDetailContext";
import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";
import { useDeleteCourse } from "@/hooks/api";

import EditModeButtons from "../../EditModeButtons";
import EditableField from "../../EditableField";

const AdminAtldDetailHeader = () => {
    const { atldId } = useParams();

    const router = useRouter();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const { isEditMode, setIsEditMode } = useAtldAdminDetailContext();

    // Use the shared course form context
    const { form, isLoading, handleEditToggle, handleCancelEdit } = useCourseFormContext();

    const { mutateAsync: deleteCourse } = useDeleteCourse("atld");

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

    const handleDeleteCourse = () => {
        modals.openConfirmModal({
            title: "Xác nhận xóa khóa học",
            centered: true,
            children: <p>Bạn có chắc chắn muốn xóa khóa học này?</p>,
            labels: { confirm: "Xóa", cancel: "Huỷ" },
            onConfirm: async () => {
                try {
                    await deleteCourse({ groupId: atldId as string });

                    notifications.show({
                        title: "Thành công",
                        message: "Khóa học đã được xóa thành công",
                        color: "green",
                        position: "top-right",
                    });

                    router.push("/quan-tri/atld");
                } catch (error) {
                    console.error(error);
                }
            },
        });
    };

    return (
        <Card
            withBorder={!isMobile}
            shadow={!isMobile ? "md" : undefined}
            radius="md"
            p={isMobile ? "xs" : "md"}
            className={`!overflow-visible ${isMobile ? "!shadow-none" : ""}`}
        >
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
                                onDelete={handleDeleteCourse}
                            />
                        </div>
                    </div>
                </div>
            </Group>
        </Card>
    );
};

export default AdminAtldDetailHeader;
