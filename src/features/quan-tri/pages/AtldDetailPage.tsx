"use client";

import { useParams } from "next/navigation";

import { Card, Text } from "@mantine/core";
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

    if (!courseDetail)
        return (
            <div className="flex-1">
                <Card withBorder className="w-full h-full">
                    <div className="w-full h-full flex justify-center">
                        <Text>Hãy chọn khóa học để xem chi tiết</Text>
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
                <CourseFormProvider courseDetail={courseDetail} courseType="atld">
                    <AdminAtldDetailHeader />

                    <AdminAtldDetailTabs />
                </CourseFormProvider>
            </AdminDetailProvider>
        </Card>
    );
};

export default AtldDetailPage;
