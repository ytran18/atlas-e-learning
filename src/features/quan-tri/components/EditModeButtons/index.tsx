import { Button, Group } from "@mantine/core";
import { IconDeviceFloppy, IconEdit, IconX } from "@tabler/icons-react";

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
    return (
        <Group gap="sm">
            {isEditMode ? (
                <>
                    <Button
                        leftSection={<IconDeviceFloppy />}
                        variant="filled"
                        onClick={onSave}
                        disabled={saveDisabled}
                        className="!w-full"
                    >
                        {saveText}
                    </Button>

                    <Button
                        leftSection={<IconDeviceFloppy />}
                        variant="filled"
                        color="red"
                        onClick={onDelete}
                        disabled={saveDisabled}
                    >
                        {deleteText}
                    </Button>

                    <Button
                        color="red"
                        leftSection={<IconX />}
                        variant="outline"
                        onClick={onCancel}
                        className="!w-full"
                    >
                        {cancelText}
                    </Button>
                </>
            ) : (
                <Button leftSection={<IconEdit />} variant="filled" onClick={onEdit}>
                    {editText}
                </Button>
            )}
        </Group>
    );
};

export default EditModeButtons;
