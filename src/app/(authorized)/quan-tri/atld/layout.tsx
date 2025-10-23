"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import AdminSidebar from "@/features/quan-tri/components/AdminSidebar";
import ModalCreateNewCourse from "@/features/quan-tri/components/ModalCreateNewCourse";
import { useCourseList } from "@/hooks/api";
import { CourseListItem } from "@/types/api";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { atldId } = useParams();

    const [openedModalCreateNewCourse, setOpenedModalCreateNewCourse] = useState<boolean>(false);

    const { data: courseList } = useCourseList("atld");

    useEffect(() => {
        if (atldId) return;

        if (courseList) {
            router.push(`/quan-tri/atld/${courseList?.[0]?.id}`);
        }
    }, [courseList, atldId, router]);

    const handleSelectCourse = (course: CourseListItem) => {
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
