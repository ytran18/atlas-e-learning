"use client";

import { useParams } from "next/navigation";

import { Card } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useCourseDetail } from "@/api";

import AdminAtldDetailHeader from "../components/atld-detail/AdminAtldDetailHeader";
import AdminAtldDetailTabs from "../components/atld-detail/AdminAtldDetailTabs";
import { AdminDetailProvider } from "../contexts/AdminDetailContext";
import { CourseFormProvider } from "../contexts/CourseFormContext";

const AtldDetailPage = () => {
    const { atldId } = useParams();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const { data: courseDetail } = useCourseDetail("atld", atldId as string);

    if (!courseDetail) return <div>Loading...</div>;

    return (
        <Card
            withBorder
            shadow="md"
            radius="md"
            className={`flex-1 gap-y-4 ${isMobile ? "!p-0" : ""}`}
        >
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
