import { Button } from "@mantine/core";
import { IconFile, IconVideo } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface CourseStatsProps {
    totalLessons: number;
    totalQuestions: number;
}

const CourseStats = ({ totalLessons, totalQuestions }: CourseStatsProps) => {
    const { t } = useI18nTranslate();

    return (
        <div className="flex flex-wrap gap-10 mb-6">
            <div className="flex items-center gap-2">
                <Button variant="light" size="sm">
                    <IconVideo className="size-5 text-blue-600" strokeWidth={1.5} />
                </Button>
                <div>
                    <div className="text-xs text-gray-600">Bài học</div>
                    <span className="font-semibold text-gray-900 text-sm">
                        {t("count_video", {
                            count: totalLessons,
                        })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="light" size="sm">
                    <IconFile className="size-5 text-blue-600" strokeWidth={1.5} />
                </Button>
                <div>
                    <div className="text-xs text-gray-600">{t("kiem_tra")}</div>
                    <span className="font-semibold text-gray-900 text-sm">
                        {t("count_cau_hoi", {
                            count: totalQuestions,
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CourseStats;
