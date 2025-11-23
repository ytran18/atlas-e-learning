import { Button } from "@mantine/core";
import { IconCircleCheck, IconLoader, IconRotate } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface ActionButtonsProps {
    onRetake: () => void;
    onConfirm: () => void;
    isUploading: boolean;
}

export const ActionButtons = ({ onRetake, onConfirm, isUploading }: ActionButtonsProps) => {
    const { t } = useI18nTranslate();

    return (
        <div className="flex gap-3 w-full">
            <Button
                onClick={onRetake}
                variant="outline"
                size="sm"
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 transition-all hover:shadow-md"
                radius="md"
            >
                <IconRotate className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-semibold">{t("chup_lai")}</span>
            </Button>
            <Button
                onClick={onConfirm}
                disabled={isUploading}
                size="sm"
                className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50"
                radius="md"
            >
                {isUploading ? (
                    <>
                        <IconLoader className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="text-sm sm:text-base font-semibold">
                            {t("dang_xu_ly_1")}
                        </span>
                    </>
                ) : (
                    <>
                        <IconCircleCheck className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base font-semibold">{t("xac_nhan")}</span>
                    </>
                )}
            </Button>
        </div>
    );
};
