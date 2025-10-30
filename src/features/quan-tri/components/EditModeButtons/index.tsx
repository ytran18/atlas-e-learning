import { Button, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDeviceFloppy, IconEdit, IconTrashFilled, IconX } from "@tabler/icons-react";

interface EditModeButtonsProps {
    isEditMode: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    saveDisabled?: boolean;
    editText?: string;
    saveText?: string;
    cancelText?: string;
    deleteText?: string;
}

const EditModeButtons = ({
    isEditMode,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    saveDisabled = false,
    editText = "Chỉnh sửa",
    saveText = "Lưu",
    cancelText = "Hủy",
    deleteText = "Xóa khóa học",
}: EditModeButtonsProps) => {
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <Group gap="sm">
            {isEditMode ? (
                <>
                    <Button
                        size={isMobile ? "xs" : "md"}
                        variant="filled"
                        onClick={onSave}
                        disabled={saveDisabled}
                        className="!w-full"
                    >
                        <div className="flex items-center gap-x-2">
                            <IconDeviceFloppy />

                            {!isMobile && saveText}
                        </div>
                    </Button>

                    <Button
                        size={isMobile ? "xs" : "md"}
                        variant="filled"
                        color="red"
                        onClick={onDelete}
                        disabled={saveDisabled}
                    >
                        <div className="flex items-center gap-x-2">
                            <IconTrashFilled />

                            {!isMobile && deleteText}
                        </div>
                    </Button>

                    <Button
                        size={isMobile ? "xs" : "md"}
                        color="red"
                        variant="outline"
                        onClick={onCancel}
                        className="!w-full"
                    >
                        <div className="flex items-center gap-x-2">
                            <IconX />

                            {!isMobile && cancelText}
                        </div>
                    </Button>
                </>
            ) : (
                <Button size={isMobile ? "xs" : "md"} variant="filled" onClick={onEdit}>
                    <div className="flex items-center gap-x-2">
                        <IconEdit size={isMobile ? 16 : 20} />

                        {!isMobile && editText}
                    </div>
                </Button>
            )}
        </Group>
    );
};

export default EditModeButtons;
