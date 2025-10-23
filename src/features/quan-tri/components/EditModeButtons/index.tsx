import { Button, Group } from "@mantine/core";
import { IconDeviceFloppy, IconEdit, IconX } from "@tabler/icons-react";

interface EditModeButtonsProps {
    isEditMode: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    saveDisabled?: boolean;
    editText?: string;
    saveText?: string;
    cancelText?: string;
}

const EditModeButtons = ({
    isEditMode,
    onEdit,
    onSave,
    onCancel,
    saveDisabled = false,
    editText = "Chỉnh sửa",
    saveText = "Lưu",
    cancelText = "Hủy",
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
                    >
                        {saveText}
                    </Button>

                    <Button
                        color="red"
                        leftSection={<IconX />}
                        variant="outline"
                        onClick={onCancel}
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
