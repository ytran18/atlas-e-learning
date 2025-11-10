import { IconBook, IconCertificate } from "@tabler/icons-react";

const AtldLoadingState = () => {
    return (
        <div>
            <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-5xl">
                        <h1 className="text-4xl sm:text-5xl font-semibold mb-5 text-gray-900 tracking-tight">
                            Khóa học An toàn Lao động
                        </h1>

                        <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-normal">
                            Học tập các kỹ năng thiết yếu và nhận chứng chỉ An toàn Lao động được
                            công nhận
                        </p>

                        <div className="flex flex-wrap gap-8 text-base text-gray-600">
                            <div className="flex items-center gap-2.5">
                                <IconCertificate
                                    className="h-5 w-5 text-blue-600"
                                    strokeWidth={1.5}
                                />
                                <span className="font-medium">Chứng chỉ công nhận</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/30">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <IconBook className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            Đang tải khóa học...
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Vui lòng chờ trong giây lát để xem danh sách khóa học.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtldLoadingState;
