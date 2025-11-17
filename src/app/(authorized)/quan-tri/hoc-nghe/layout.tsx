"use client";

import { useEffect, useState } from "react";

import { redirect, useParams, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { useCourseList } from "@/api";
import Loader from "@/components/Loader";
import AdminSidebar from "@/features/quan-tri/components/AdminSidebar";
import ModalCreateNewCourse from "@/features/quan-tri/components/ModalCreateNewCourse";
import { CourseListItem } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { hocNgheId } = useParams();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const { user } = useClerk();

    const isStaff = user?.unsafeMetadata.role === "staff";

    const [openedModalCreateNewCourse, setOpenedModalCreateNewCourse] = useState<boolean>(false);

    const { data: courseList } = useCourseList("hoc-nghe");

    useEffect(() => {
        if (hocNgheId || isMobile) return;

        if (courseList) {
            router.push(`/quan-tri/hoc-nghe/${courseList?.[0]?.id}`);
        }
    }, [courseList, hocNgheId, router, isMobile]);

    const handleSelectCourse = (course: CourseListItem) => {
        if (isMobile) return;

        router.push(`/quan-tri/hoc-nghe/${course.id}`);
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
                title="Các nhóm nghề"
                courseList={courseList}
                onSelectCourse={handleSelectCourse}
            >
                <Button
                    leftSection={<IconPlus size={16} />}
                    size="xs"
                    onClick={() => setOpenedModalCreateNewCourse(true)}
                >
                    Thêm
                </Button>
            </AdminSidebar>

            {children}

            <ModalCreateNewCourse
                type="hoc-nghe"
                title="Thêm khóa học"
                opened={openedModalCreateNewCourse}
                onClose={() => setOpenedModalCreateNewCourse(false)}
            />
        </div>
    );
}
