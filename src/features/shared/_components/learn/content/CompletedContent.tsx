import Link from "next/link";

import { Button } from "@mantine/core";

import { navigationPaths } from "@/utils/navigationPaths";

const CompletedContent = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
                Chúc mừng bạn đã hoàn thành khóa học!
            </h2>
            <p className="text-gray-600 mb-4">
                Bạn đã hoàn thành tất cả các phần của khóa học này.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-green-800">
                    Khóa học đã được đánh dấu là hoàn thành trong hồ sơ học tập của bạn.
                </p>
            </div>

            <Link href={navigationPaths.ATLD}>
                <Button className="mt-4">Quay về trang chủ</Button>
            </Link>
        </div>
    );
};

export default CompletedContent;
