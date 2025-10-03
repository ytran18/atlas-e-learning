import { ChangeEvent, useRef } from "react";

interface VideoUploadButtonProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
    accept?: string;
    maxSize?: number; // in MB
    children?: React.ReactNode;
}

export const VideoUploadButton = ({
    onFileSelect,
    disabled = false,
    accept = "video/*",
    maxSize = 500, // 500MB default
    children,
}: VideoUploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Validate file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        onFileSelect(file);

        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={disabled}
            />
            <button onClick={handleButtonClick} disabled={disabled} type="button">
                {children || "Select Video"}
            </button>
        </>
    );
};
