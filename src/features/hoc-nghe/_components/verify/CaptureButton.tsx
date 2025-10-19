import { Button } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";

interface CaptureButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export const CaptureButton = ({ onClick, disabled }: CaptureButtonProps) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            radius="lg"
        >
            <IconCamera className="mr-2 h-5 w-5" />
            <span className="text-base font-semibold">Chụp ảnh</span>
        </Button>
    );
};
