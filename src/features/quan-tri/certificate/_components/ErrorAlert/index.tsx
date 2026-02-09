import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface ErrorAlertProps {
    error: string;
}

const ErrorAlert = ({ error }: ErrorAlertProps) => {
    return (
        <Alert color="red" className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <IconAlertCircle className="w-6 h-6 text-red-600" />
                </div>

                <div>
                    <Text className="font-semibold text-red-900 mb-1">Lỗi</Text>

                    <Text className="text-sm text-red-700">{error}</Text>
                </div>
            </div>
        </Alert>
    );
};

export default ErrorAlert;
