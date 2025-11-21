import React from "react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface LearnInfoProps {
    title?: string;
    description?: string;
    currentIndex: number;
    total: number;
    isFinished: boolean;
}

const LearnInfo = React.memo(function LearnInfo({
    title,
    description,
    currentIndex,
    total,
    isFinished,
}: LearnInfoProps) {
    const { t } = useI18nTranslate();

    return (
        <div className="shrink-0 space-y-4 px-2 sm:px-0">
            <div className="space-y-2">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-sm lg:text-base text-gray-600">{description}</p>}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 shrink-0 px-2 sm:px-0 mb-3">
                <span>
                    Video {currentIndex + 1} / {total}
                </span>

                <span>{isFinished ? t("hoan_thanh_1") : t("dang_hoc")}</span>
            </div>
        </div>
    );
});

export default LearnInfo;
