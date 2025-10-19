import { Button } from "@mantine/core";
import { IconCircleCheck, IconLoader, IconRotate } from "@tabler/icons-react";

interface ActionButtonsProps {
    onRetake: () => void;
    onConfirm: () => void;
    isUploading: boolean;
}

export const ActionButtons = ({ onRetake, onConfirm, isUploading }: ActionButtonsProps) => {
    return (
        <div className="flex gap-3 w-full">
            <Button
                onClick={onRetake}
                variant="outline"
                size="lg"
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 transition-all hover:shadow-md"
                radius="lg"
            >
                <IconRotate className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-semibold">Chụp lại</span>
            </Button>
            <Button
                onClick={onConfirm}
                disabled={isUploading}
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50"
                radius="lg"
            >
                {isUploading ? (
                    <>
                        <IconLoader className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="text-sm sm:text-base font-semibold">Đang xử lý...</span>
                    </>
                ) : (
                    <>
                        <IconCircleCheck className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base font-semibold">Xác nhận</span>
                    </>
                )}
            </Button>
        </div>
    );
};
