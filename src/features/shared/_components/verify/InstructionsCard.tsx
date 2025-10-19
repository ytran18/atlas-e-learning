import { IconInfoCircle } from "@tabler/icons-react";

export const InstructionsCard = () => {
    return (
        <div className="hidden sm:block mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-xl p-2.5 flex-shrink-0">
                    <IconInfoCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base">
                        Hướng dẫn chụp ảnh
                    </h3>

                    <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                            Đặt khuôn mặt vào giữa khung hình oval
                        </li>

                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                            Đảm bảo ánh sáng đủ sáng và không bị chói
                        </li>

                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                            Nhìn thẳng vào camera và giữ đầu thẳng
                        </li>

                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                            Không đeo kính đen hoặc che khuôn mặt
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
