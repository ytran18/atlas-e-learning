import { IconShieldCheck } from "@tabler/icons-react";

export const SuccessMessage = () => {
    return (
        <div className="mb-3 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-green-200">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-green-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 flex-shrink-0">
                    <IconShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-xs sm:text-base">
                        Ảnh đã được chụp thành công!
                    </h3>

                    <p className="hidden sm:block text-sm text-gray-600">
                        Vui lòng kiểm tra lại ảnh. Nếu hài lòng, bấm &ldquo;Xác nhận và tiếp
                        tục&rdquo; để bắt đầu học.
                    </p>
                </div>
            </div>
        </div>
    );
};
