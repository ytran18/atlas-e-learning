"use client";

import { useParams } from "next/navigation";

import { PhotoCaptureContainer } from "../_widgets/PhotoCaptureContainer";

const VerifyPage = () => {
    const { atldId } = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Simple Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                        <span>🔐</span>
                        Xác thực danh tính
                    </div>
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                        Xác thực danh tính
                    </h1>
                    <p className="text-xs sm:text-base text-gray-600">
                        Chụp ảnh khuôn mặt để xác thực trước khi bắt đầu khóa học
                    </p>
                </div>

                {/* Main Content */}
                <PhotoCaptureContainer courseId={Number(atldId)} />
            </div>
        </div>
    );
};

export default VerifyPage;
