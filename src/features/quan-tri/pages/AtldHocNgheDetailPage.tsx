"use client";

import { useParams } from "next/navigation";

import { Card } from "@mantine/core";

import { useCourseDetail } from "@/hooks/api";

import AdminHocNgheDetailHeader from "../components/hoc-nghe-detail/AdminHocNgheDetailHeader";
import AdminHocNgheDetailTabs from "../components/hoc-nghe-detail/AdminHocNgheDetailTabs";
import { AdminDetailProvider } from "../contexts/AdminDetailContext";
import { CourseFormProvider } from "../contexts/CourseFormContext";

const AtldHocNgheDetailPage = () => {
    const { hocNgheId } = useParams();

    const { data: courseDetail } = useCourseDetail("hoc-nghe", hocNgheId as string);

    if (!courseDetail) return <div>Loading...</div>;

    return (
        <Card withBorder shadow="md" radius="md" p="md" className="flex-1 gap-y-4">
            <AdminDetailProvider courseDetail={courseDetail}>
                <CourseFormProvider courseDetail={courseDetail} courseType="hoc-nghe">
                    <AdminHocNgheDetailHeader />

                    <AdminHocNgheDetailTabs />
                </CourseFormProvider>
            </AdminDetailProvider>
        </Card>
    );
};

export default AtldHocNgheDetailPage;
