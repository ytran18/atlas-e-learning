import { Button } from "@mantine/core";
import { IconBookOff } from "@tabler/icons-react";

const CourseEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="bg-gray-100 rounded-full p-6 mb-6">
                <IconBookOff className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chưa có khóa học nào</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
                Hiện tại chưa có khóa học Học Nghề nào được cung cấp. Vui lòng quay lại sau để xem
                các khóa học mới.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => window.location.reload()} color="green" variant="filled">
                    Làm mới trang
                </Button>
                <Button onClick={() => window.history.back()} variant="default">
                    Quay lại
                </Button>
            </div>
        </div>
    );
};

export default CourseEmptyState;
