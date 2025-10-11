import { Badge } from "@mantine/core";
import { IconBook, IconCertificate, IconShieldCheck } from "@tabler/icons-react";

import { mockCourses } from "@/mock/courses";

import AtldPreviewCard from "../_components/list/AtldPreviewCard";

const AtldPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-indigo-400 py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge
                            size="lg"
                            className="mb-6 bg-white/80 text-blue-700 border-blue-200 shadow-sm"
                            variant="white"
                        >
                            <span className="leading-[22px] font-semibold">
                                Đào tạo An toàn Lao động
                            </span>
                        </Badge>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                            6 Nhóm An toàn Lao động
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Chọn nhóm phù hợp với công việc của bạn để bắt đầu học tập và nâng cao
                            kỹ năng an toàn
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                                <IconBook className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                                <div className="text-3xl font-bold mb-1 text-gray-900">6</div>
                                <div className="text-sm text-gray-600">Nhóm đào tạo</div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                                <IconShieldCheck className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                                <div className="text-3xl font-bold mb-1 text-gray-900">30+</div>
                                <div className="text-sm text-gray-600">Bài học</div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                                <IconCertificate className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                                <div className="text-3xl font-bold mb-1 text-gray-900">100%</div>
                                <div className="text-sm text-gray-600">Được chứng nhận</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                    {mockCourses.map((course) => (
                        <AtldPreviewCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AtldPage;
