"use client";

import { useParams } from "next/navigation";

import { Card } from "@mantine/core";

import { useCourseDetail } from "@/hooks/api";

import AdminAtldDetailHeader from "../components/atld-detail/AdminAtldDetailHeader";
import AdminAtldDetailTabs from "../components/atld-detail/AdminAtldDetailTabs";
import { AtldAdminDetailProvider } from "../contexts/AtldAdminDetailContext";
import { CourseFormProvider } from "../contexts/CourseFormContext";

const AtldDetailPage = () => {
    const { atldId } = useParams();

    const { data: courseDetail } = useCourseDetail("atld", atldId as string);

    if (!courseDetail) return <div>Loading...</div>;

    return (
        <Card withBorder shadow="md" radius="md" p="md" className="flex-1 gap-y-4">
            <AtldAdminDetailProvider courseDetail={courseDetail}>
                <CourseFormProvider courseDetail={courseDetail} courseType="atld">
                    <AdminAtldDetailHeader />

                    <AdminAtldDetailTabs />
                </CourseFormProvider>
            </AtldAdminDetailProvider>
        </Card>
    );
};

export default AtldDetailPage;
