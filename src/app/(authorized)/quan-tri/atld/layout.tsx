"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { useCourseList } from "@/api";
import AdminSidebar from "@/features/quan-tri/components/AdminSidebar";
import ModalCreateNewCourse from "@/features/quan-tri/components/ModalCreateNewCourse";
import { CourseListItem } from "@/types/api";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { atldId } = useParams();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [openedModalCreateNewCourse, setOpenedModalCreateNewCourse] = useState<boolean>(false);

    const { data: courseList } = useCourseList("atld");

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

    if (!courseList) return <div>Loading...</div>;

    return (
        <div className="flex gap-x-4 flex-1">
            <AdminSidebar
                title="Các nhóm ATLĐ"
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
                type="atld"
                title="Thêm khóa học"
                opened={openedModalCreateNewCourse}
                onClose={() => setOpenedModalCreateNewCourse(false)}
            />
        </div>
    );
}
