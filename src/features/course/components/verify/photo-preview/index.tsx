import Image from "next/image";

import { IconCircleCheck } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface PhotoPreviewProps {
    photoUrl: string;
}

export const PhotoPreview = ({ photoUrl }: PhotoPreviewProps) => {
    const { t } = useI18nTranslate();

    return (
        <>
            <Image
                src={photoUrl}
                alt={t("anh_da_chup")}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
            />
            {/* Success Checkmark Overlay */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 rounded-full p-2 sm:p-2.5 shadow-lg animate-bounce">
                <IconCircleCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
        </>
    );
};
