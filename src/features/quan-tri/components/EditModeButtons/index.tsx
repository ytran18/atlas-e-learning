import { Button, Group, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDeviceFloppy, IconEdit, IconTrash, IconX } from "@tabler/icons-react";

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
}: EditModeButtonsProps) => {
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <Group gap="sm">
            {isEditMode ? (
                <div className="flex items-center gap-x-2">
                    <Tooltip label="Lưu" withArrow>
                        <Button
                            size="xs"
                            variant="filled"
                            onClick={onSave}
                            disabled={saveDisabled}
                            className="!w-full"
                        >
                            <div className="flex items-center gap-x-2">
                                <IconDeviceFloppy size={16} />
                            </div>
                        </Button>
                    </Tooltip>

                    <Tooltip label="Xóa khóa học" withArrow>
                        <Button
                            size="xs"
                            variant="filled"
                            color="red"
                            onClick={onDelete}
                            disabled={saveDisabled}
                            className="!w-full"
                        >
                            <div className="flex items-center gap-x-2">
                                <IconTrash size={16} />
                            </div>
                        </Button>
                    </Tooltip>

                    <Tooltip label="Huỷ bỏ" withArrow>
                        <Button
                            size="xs"
                            color="red"
                            variant="outline"
                            onClick={onCancel}
                            className="!w-full"
                        >
                            <div className="flex items-center gap-x-2">
                                <IconX size={16} />
                            </div>
                        </Button>
                    </Tooltip>
                </div>
            ) : (
                <Button size="xs" variant="filled" onClick={onEdit}>
                    <div className="flex items-center gap-x-2">
                        <IconEdit size={16} />

                        {!isMobile && editText}
                    </div>
                </Button>
            )}
        </Group>
    );
};

export default EditModeButtons;
