import { Input, Textarea } from "@mantine/core";

interface EditableFieldProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    size?: "sm" | "md" | "lg";
    fw?: number;
    minRows?: number;
    maxRows?: number;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
}

const EditableField = ({
    value,
    onChange,
    isEditing,
    size = "md",
    fw,
    minRows,
    maxRows,
    placeholder,
    multiline = false,
    className,
}: EditableFieldProps) => {
    if (multiline) {
        return (
            <Textarea
                size={size}
                readOnly={!isEditing}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                minRows={minRows}
                maxRows={maxRows}
                placeholder={placeholder}
                className={className}
            />
        );
    }

    return (
        <Input
            size={size}
            fw={fw}
            readOnly={!isEditing}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className}
        />
    );
};

export default EditableField;
