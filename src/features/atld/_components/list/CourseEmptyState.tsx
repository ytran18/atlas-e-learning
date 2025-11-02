import { IconX } from "@tabler/icons-react";

const CourseEmptyState = () => {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <IconX className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Không có khóa học nào</h3>
            <p className="text-gray-600">Hiện tại chưa có khóa học nào được mở.</p>
        </div>
    );
};

export default CourseEmptyState;
