"use client";

import { useParams } from "next/navigation";

import { Card, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useCourseDetail } from "@/api";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import AdminHocNgheDetailHeader from "../components/hoc-nghe-detail/AdminHocNgheDetailHeader";
import AdminHocNgheDetailTabs from "../components/hoc-nghe-detail/AdminHocNgheDetailTabs";
import { AdminDetailProvider } from "../contexts/AdminDetailContext";
import { CourseFormProvider } from "../contexts/CourseFormContext";

const AtldHocNgheDetailPage = () => {
    const { t } = useI18nTranslate();

    const { hocNgheId } = useParams();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const { data: courseDetail } = useCourseDetail("hoc-nghe", hocNgheId as string);

    if (!courseDetail)
        return (
            <div className="flex-1">
                <Card withBorder className="w-full h-full">
                    <div className="w-full h-full flex justify-center">
                        <Text>{t("hay_chon_khoa_hoc_de_xem_chi_tiet")}</Text>
                    </div>
                </Card>
            </div>
        );

    return (
        <Card
            withBorder
            shadow="md"
            radius="md"
            className={`h-[calc(100vh-152px)] sm:h-[calc(100vh-272px)] flex-1 gap-y-4 ${isMobile ? "p-0!" : ""}`}
        >
            <AdminDetailProvider courseDetail={courseDetail}>
                <CourseFormProvider courseDetail={courseDetail} courseType="hoc-nghe">
                    <AdminHocNgheDetailHeader />

                    <AdminHocNgheDetailTabs />
                </CourseFormProvider>
            </AdminDetailProvider>
        </Card>
    );
};

export default AtldHocNgheDetailPage;
