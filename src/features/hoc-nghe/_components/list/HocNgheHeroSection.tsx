import { IconBook, IconCertificate, IconShieldCheck } from "@tabler/icons-react";

import { GetCourseListResponse } from "@/types/api";

interface HocNgheHeroSectionProps {
    data?: GetCourseListResponse;
}

const HocNgheHeroSection = ({ data }: HocNgheHeroSectionProps) => {
    return (
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
                            <IconCertificate className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                            <span>Chứng chỉ được công nhận</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconShieldCheck className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                            <span>Bảo mật tuyệt đối</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HocNgheHeroSection;
