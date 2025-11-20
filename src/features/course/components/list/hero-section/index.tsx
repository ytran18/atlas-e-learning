import { IconBook, IconCertificate } from "@tabler/icons-react";

interface CourseListHeroSectionProps {
    totalCourses?: number;
}

const CourseListHeroSection = ({ totalCourses }: CourseListHeroSectionProps) => {
    return (
        <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-5xl">
                    <h1 className="text-4xl sm:text-5xl font-semibold mb-5 text-gray-900 tracking-tight">
                        Khóa học An toàn Lao động
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-normal">
                        Học tập các kỹ năng thiết yếu và nhận chứng chỉ An toàn Lao động được công
                        nhận
                    </p>

                    <div className="flex flex-wrap gap-8 text-base text-gray-600">
                        {totalCourses !== 0 && (
                            <div className="flex items-center gap-2.5">
                                <IconBook className="h-5 w-5 text-blue-600" strokeWidth={1.5} />

                                <span className="font-medium">{totalCourses} Nhóm đào tạo</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2.5">
                            <IconCertificate className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
                            <span className="font-medium">Chứng chỉ công nhận</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseListHeroSection;
