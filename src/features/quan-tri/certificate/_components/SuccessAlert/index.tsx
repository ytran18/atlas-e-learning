import { Alert, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const SuccessAlert = () => {
    return (
        <Alert
            className="mb-6 bg-green-50 border-green-200 animate-in fade-in slide-in-from-top-2 duration-300"
            styles={{
                root: { borderColor: "#86efac" },
                message: { color: "#15803d" },
            }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <IconCheck className="w-6 h-6 text-green-600" />
                </div>

                <div>
                    <Text className="font-semibold text-green-900 mb-1">Thành công!</Text>

                    <Text className="text-sm text-green-700">
                        Thông tin đã được tải lên. Vui lòng điền thông tin chứng chỉ.
                    </Text>
                </div>
            </div>
        </Alert>
    );
};

export default SuccessAlert;
