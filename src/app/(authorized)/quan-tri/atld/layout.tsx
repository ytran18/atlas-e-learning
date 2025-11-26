"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { redirect, useParams, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { useCourseList } from "@/api";
import Loader from "@/components/Loader";
import AdminSidebar from "@/features/quan-tri/components/AdminSidebar";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { CourseListItem } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

const ModalCreateNewCourse = dynamic(
    () => import("@/features/quan-tri/components/ModalCreateNewCourse"),
    {
        ssr: false,
    }
);

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { t } = useI18nTranslate();

    const { atldId } = useParams();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const { user } = useClerk();

    const isStaff = user?.unsafeMetadata.role === "staff";

    const { data: courseList } = useCourseList("atld");

    // states

    const [openedModalCreateNewCourse, setOpenedModalCreateNewCourse] = useState<boolean>(false);

    useEffect(() => {
        if (atldId || isMobile) return;

        if (courseList) {
            router.push(`/quan-tri/atld/${courseList?.[0]?.id}`);
        }
    }, [courseList, atldId, router, isMobile]);

    const handleSelectCourse = (course: CourseListItem) => {
        if (isMobile) return;

        router.push(`/quan-tri/atld/${course.id}`);
    };

    if (isStaff) {
        redirect(navigationPaths.QUAN_TRI_USER);
    }

    if (!courseList)
        return (
            <div className="w-full">
                <Loader className="flex items-center w-full justify-center py-8" />
            </div>
        );

    return (
        <div className="flex gap-x-4">
            <AdminSidebar
                title={t("an_toan_lao_dong")}
                courseList={courseList}
                onSelectCourse={handleSelectCourse}
            >
                <Button
                    leftSection={<IconPlus size={16} />}
                    size="xs"
                    onClick={() => setOpenedModalCreateNewCourse(true)}
                >
                    {t("them")}
                </Button>
            </AdminSidebar>

            {children}

            <ModalCreateNewCourse
                type="atld"
                title={t("them_khoa_hoc")}
                opened={openedModalCreateNewCourse}
                onClose={() => setOpenedModalCreateNewCourse(false)}
            />
        </div>
    );
}
