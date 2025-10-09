import { Badge } from "@mantine/core";

import { mockCourses } from "@/mock/courses";

import AtldPreviewCard from "../components/AtldPreviewCard";

const AtldPage = () => {
    return (
        <div className="min-h-screen py-12 bg-gradient-to-b from-[var(--primary)]/10 to-[var(--background)]">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <Badge>
                        <span className="leading-[22px]">Đào tạo An toàn Lao động</span>
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-bold my-4 text-[var(--mantine-color-dark-9)]">
                        6 Nhóm An toàn Lao động
                    </h1>

                    <p className="text-lg text-[var(--mantine-color-dark-5)]">
                        Chọn nhóm phù hợp với công việc của bạn để bắt đầu học tập
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                {mockCourses.map((course) => (
                    <AtldPreviewCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default AtldPage;
