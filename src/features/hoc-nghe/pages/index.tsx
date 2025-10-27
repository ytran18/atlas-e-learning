"use client";

import { Button } from "@mantine/core";
import { IconBook, IconBookOff, IconCertificate, IconShieldCheck } from "@tabler/icons-react";

import { useCourseList } from "@/hooks/api";
import { GetCourseListResponse } from "@/types/api";

import HocNghePreviewCard from "../_components/list/HocNghePreviewCard";

interface HocNghePageProps {
    initialData?: GetCourseListResponse;
}

const HocNghePage = ({ initialData }: HocNghePageProps) => {
    const { data, isLoading } = useCourseList("hoc-nghe", {
        initialData,
    });

    console.log({ hocNgheData: data });

    if (!data || isLoading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Coursera style */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-5xl">
                        <h1 className="text-4xl sm:text-5xl font-semibold mb-5 text-gray-900 tracking-tight">
                            Khóa học Học Nghề
                        </h1>

                        <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-normal">
                            Học tập các kỹ năng thiết yếu và nhận chứng chỉ Học Nghề được công nhận
                        </p>

                        <div className="flex flex-wrap gap-8 text-base text-gray-600">
                            <div className="flex items-center gap-2">
                                <IconBook className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                                <span>Nội dung chất lượng cao</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconCertificate
                                    className="h-5 w-5 text-green-600"
                                    strokeWidth={1.5}
                                />
                                <span>Chứng chỉ được công nhận</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconShieldCheck
                                    className="h-5 w-5 text-green-600"
                                    strokeWidth={1.5}
                                />
                                <span>Bảo mật tuyệt đối</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                        Các khóa học có sẵn
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Chọn khóa học phù hợp với nhu cầu học tập của bạn
                    </p>
                </div>

                {data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {data.map((course) => (
                            <HocNghePreviewCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                        <div className="bg-gray-100 rounded-full p-6 mb-6">
                            <IconBookOff className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Chưa có khóa học nào
                        </h3>
                        <p className="text-gray-600 text-center max-w-md mb-6">
                            Hiện tại chưa có khóa học Học Nghe nào được cung cấp. Vui lòng quay lại
                            sau để xem các khóa học mới.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => window.location.reload()}
                                color="green"
                                variant="filled"
                                // className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Làm mới trang
                            </Button>
                            <Button
                                onClick={() => window.history.back()}
                                variant="default"
                                // className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Quay lại
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HocNghePage;
