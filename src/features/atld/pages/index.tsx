"use client";

import { IconBook, IconCertificate, IconShieldCheck } from "@tabler/icons-react";

import { useCourseList } from "@/hooks/api";
import { GetCourseListResponse } from "@/types/api";

import AtldPreviewCard from "../_components/list/AtldPreviewCard";

interface AtldPageProps {
    initialData?: GetCourseListResponse;
}

const AtldPage = ({ initialData }: AtldPageProps) => {
    const { data, isLoading } = useCourseList("atld", {
        initialData,
    });

    if (!data || isLoading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Coursera style */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-5xl">
                        <h1 className="text-4xl sm:text-5xl font-semibold mb-5 text-gray-900 tracking-tight">
                            Khóa học An toàn Lao động
                        </h1>

                        <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-normal">
                            Học tập các kỹ năng thiết yếu và nhận chứng chỉ An toàn Lao động được
                            công nhận
                        </p>

                        <div className="flex flex-wrap gap-8 text-base text-gray-600">
                            <div className="flex items-center gap-2.5">
                                <IconBook className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
                                <span className="font-medium">6 Nhóm đào tạo</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <IconShieldCheck
                                    className="h-5 w-5 text-blue-600"
                                    strokeWidth={1.5}
                                />
                                <span className="font-medium">30+ Bài học</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <IconCertificate
                                    className="h-5 w-5 text-blue-600"
                                    strokeWidth={1.5}
                                />
                                <span className="font-medium">Chứng chỉ công nhận</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/30 flex flex-col items-center">
                <div className="mb-10 max-w-5xl">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                        Khám phá các khóa học
                    </h2>
                    <p className="text-lg text-gray-600 font-normal">
                        Chọn nhóm phù hợp với công việc của bạn
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
                    {data.map((course) => (
                        <AtldPreviewCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AtldPage;
