"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import AdminSidebar from "@/features/quan-tri/components/AdminSidebar";
import ModalCreateNewCourse from "@/features/quan-tri/components/ModalCreateNewCourse";
import { useCourseList } from "@/hooks/api";
import { CourseListItem } from "@/types/api";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { hocNgheId } = useParams();

    const isMobile = useMediaQuery("(max-width: 640px)");

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

    if (!courseList) return <div>Loading...</div>;

    return (
        <div className="flex gap-x-4 flex-1">
            <AdminSidebar
                title="Các nhóm nghề"
                courseList={courseList}
                onSelectCourse={handleSelectCourse}
            >
                <Button
                    leftSection={<IconPlus />}
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
