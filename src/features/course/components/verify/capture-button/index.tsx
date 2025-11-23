import { Button } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface CaptureButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export const CaptureButton = ({ onClick, disabled }: CaptureButtonProps) => {
    const { t } = useI18nTranslate();

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size="sm"
            variant="gradient"
            className="w-full bg-linear-to-r disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            radius="md"
        >
            <IconCamera className="mr-2 h-5 w-5" />
            <span className="text-base font-semibold">{t("chup_anh")}</span>
        </Button>
    );
};
