import { ReactNode, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { trackCoursePreviewStartClicked } from "@/libs/mixpanel";
import { ATLD_SLUG, HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

interface CoursePreviewHeroProps {
    title: string;
    description: string;
    badge?: string;
    isJoined: boolean;
    isLoadingJoiabled: boolean;
    children?: ReactNode;
    isCompleted?: boolean;
    isValidCourse?: boolean;
    type: "atld" | "hoc-nghe";
}

const CoursePreviewHero = ({
    title,
    description,
    isJoined,
    isLoadingJoiabled,
    children,
    isCompleted,
    isValidCourse,
    type,
}: CoursePreviewHeroProps) => {
    const { atldId, hocNgheId } = useParams();

    const { t } = useI18nTranslate();

    const [isNavigating, setIsNavigating] = useState<boolean>(false);

    const getLink = () => {
        if (isJoined) {
            const atld_pathname = `${navigationPaths.ATLD_LEARN.replace(`[${ATLD_SLUG}]`, atldId as string)}?name=${title}`;

            const hoc_nghe_pathname = `${navigationPaths.HOC_NGHE_LEARN.replace(`[${HOC_NGHE_SLUG}]`, hocNgheId as string)}?name=${title}`;

            const pathname = type === "atld" ? atld_pathname : hoc_nghe_pathname;

            return pathname;
        }

        const atld_pathname = `${navigationPaths.ATLD_VERIFY.replace(`[${ATLD_SLUG}]`, atldId as string)}?name=${title}`;

        const hoc_nghe_pathname = `${navigationPaths.HOC_NGHE_VERIFY.replace(`[${HOC_NGHE_SLUG}]`, hocNgheId as string)}?name=${title}`;

        const pathname = type === "atld" ? atld_pathname : hoc_nghe_pathname;

        return pathname;
    };

    return (
        <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-6 sm:py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href={type === "atld" ? navigationPaths.ATLD : navigationPaths.HOC_NGHE}>
                        <Button
                            variant="subtle"
                            leftSection={<IconArrowLeft size={18} />}
                            size="sm"
                            className="text-gray-700 hover:bg-white/80"
                        >
                            {t("quay_lai")}
                        </Button>
                    </Link>
                </div>

                {/* Course Header */}
                <div className="max-w-4xl">
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 tracking-tight leading-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed font-normal max-w-3xl">
                        {description}
                    </p>

                    {/* Course Stats - passed as children */}
                    {children}

                    {/* CTA Button */}
                    <div className="flex flex-col gap-y-2">
                        {isCompleted && (
                            <Text className="text-green-600!">
                                {t("ban_da_hoan_thanh_khoa_hoc_nay")}
                            </Text>
                        )}

                        <Link
                            href={getLink()}
                            onClick={(e) => {
                                if (!isValidCourse) {
                                    e?.preventDefault();
                                    e?.stopPropagation();

                                    notifications.show({
                                        position: "top-center",
                                        message: t("khoa_hoc_chua_co_noi_dung"),
                                        color: "yellow",
                                        withBorder: true,
                                    });

                                    return;
                                }

                                // Track course preview start clicked
                                if (!isJoined && atldId) {
                                    trackCoursePreviewStartClicked({
                                        course_type: "atld",
                                        course_id: atldId as string,
                                        course_name: title,
                                    });
                                }

                                setIsNavigating(true);
                            }}
                            className="w-fit!"
                        >
                            <Button
                                size="sm"
                                className="bg-gray-900 hover:bg-gray-800"
                                radius="md"
                                loading={isLoadingJoiabled || isNavigating}
                                loaderProps={{ type: "dots" }}
                            >
                                {isCompleted
                                    ? t("xem_lai_khoa_hoc")
                                    : isJoined
                                      ? t("tiep_tuc_hoc")
                                      : t("bat_dau_hoc_ngay")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePreviewHero;
