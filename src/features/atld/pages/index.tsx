"use client";

import { GetCourseListResponse } from "@/types/api";

import AtldCourseListContainer from "../_widgets/AtldCourseListContainer";

interface AtldPageProps {
    initialData?: GetCourseListResponse;
}

const AtldPage = ({ initialData }: AtldPageProps) => {
    return <AtldCourseListContainer initialData={initialData} />;
};

export default AtldPage;
