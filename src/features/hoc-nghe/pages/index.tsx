"use client";

import { GetCourseListResponse } from "@/types/api";

import HocNgheCourseListContainer from "../_widgets/HocNgheCourseListContainer";

interface HocNghePageProps {
    initialData?: GetCourseListResponse;
}

const HocNghePage = ({ initialData }: HocNghePageProps) => {
    return <HocNgheCourseListContainer initialData={initialData} />;
};

export default HocNghePage;
