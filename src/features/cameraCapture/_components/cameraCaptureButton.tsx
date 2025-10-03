"use client";

interface CameraCaptureButtonProps {
    onCapture: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export const CameraCaptureButton = ({
    onCapture,
    disabled = false,
    children = "Capture Photo",
}: CameraCaptureButtonProps) => {
    return (
        <button
            onClick={onCapture}
            disabled={disabled}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            type="button"
        >
            {children}
        </button>
    );
};
