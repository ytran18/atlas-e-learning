import { Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

const EmptyState = () => {
    return (
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <IconInfoCircle className="w-5 h-5 text-blue-600" />

                <Text className="text-sm text-slate-600">
                    Bắt đầu bằng cách upload thẻ hoặc tìm kiếm học viên ở{" "}
                    <span className="font-semibold text-blue-600">Bước 1</span>
                </Text>
            </div>
        </div>
    );
};

export default EmptyState;
