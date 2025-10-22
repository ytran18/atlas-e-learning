"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import AdminSidebar from "@/features/quan-tri/components/AdminSidebar";
import { useCourseList } from "@/hooks/api";
import { CourseListItem } from "@/types/api";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { data: courseList } = useCourseList("atld");

    useEffect(() => {
        if (courseList) {
            router.push(`/quan-tri/atld/${courseList[0].id}`);
        }
    }, [courseList, router]);

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
            />

            {children}
        </div>
    );
}
