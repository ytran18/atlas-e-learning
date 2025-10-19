import { IconLoader } from "@tabler/icons-react";

const CourseLoading = () => {
    return (
        <div className="h-[calc(100vh-70px)] w-full flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <IconLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-spin" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Đang tải khóa học</h3>
                    <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        </div>
    );
};

export default CourseLoading;
