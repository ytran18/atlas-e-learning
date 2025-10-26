"use client";

import { useParams } from "next/navigation";

import { Card } from "@mantine/core";

import { useCourseDetail } from "@/hooks/api";

import AdminAtldDetailHeader from "../components/atld-detail/AdminAtldDetailHeader";
import AdminAtldDetailTabs from "../components/atld-detail/AdminAtldDetailTabs";
import { AdminDetailProvider } from "../contexts/AdminDetailContext";
import { CourseFormProvider } from "../contexts/CourseFormContext";

const AtldDetailPage = () => {
    const { atldId } = useParams();

    const { data: courseDetail } = useCourseDetail("atld", atldId as string);

    if (!courseDetail) return <div>Loading...</div>;

    return (
        <Card withBorder shadow="md" radius="md" p="md" className="flex-1 gap-y-4">
            <AdminDetailProvider courseDetail={courseDetail}>
                <CourseFormProvider courseDetail={courseDetail} courseType="atld">
                    <AdminAtldDetailHeader />

                    <AdminAtldDetailTabs />
                </CourseFormProvider>
            </AdminDetailProvider>
        </Card>
    );
};

export default AtldDetailPage;
