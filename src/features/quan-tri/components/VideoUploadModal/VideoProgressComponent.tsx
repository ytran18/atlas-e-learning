import React from "react";

import { Alert, Group, Progress, Text } from "@mantine/core";
import { IconAlertCircle, IconClock } from "@tabler/icons-react";

import { ProgressData } from "../../types/video";

interface VideoProgressComponentProps {
    progress: ProgressData | null;
    isConnected: boolean;
    error: string | null;
}

export const VideoProgressComponent: React.FC<VideoProgressComponentProps> = ({
    progress,
    isConnected,
    error,
}) => {
    if (!progress) {
        return (
            <Alert
                icon={<IconClock size={16} />}
                title="Đang kết nối..."
                color="blue"
                variant="light"
            >
                <div className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            isConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                    />
                    <Text size="sm">
                        {isConnected ? "WebSocket đã kết nối" : "WebSocket chưa kết nối"}
                    </Text>
                </div>
                {error && (
                    <Text size="sm" c="red" mt="xs">
                        Lỗi: {error}
                    </Text>
                )}
            </Alert>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "yellow";
            case "processing":
                return "blue";
            case "completed":
                return "green";
            case "failed":
                return "red";
            default:
                return "gray";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "Đang chờ xử lý";
            case "processing":
                return "Đang xử lý";
            case "completed":
                return "Hoàn thành";
            case "failed":
                return "Thất bại";
            default:
                return status;
        }
    };

    return (
        <div className="space-y-4">
            {/* Status */}
            <div>
                <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                        Trạng thái:
                    </Text>
                    <Alert
                        color={getStatusColor(progress.status)}
                        variant="filled"
                        radius="sm"
                        px={4}
                        py={2}
                    >
                        {getStatusText(progress.status)}
                    </Alert>
                </Group>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <Text size="sm">Tiến trình</Text>
                    <Text size="sm" fw={500}>
                        {Number(progress?.progress).toFixed(0)}%
                    </Text>
                </div>
                <Progress
                    value={progress.progress}
                    color={getStatusColor(progress.status)}
                    size="sm"
                />
            </div>

            {/* Error Display */}
            {progress.status === "failed" && progress.error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Lỗi xử lý"
                    color="red"
                    variant="light"
                >
                    {progress.error}
                </Alert>
            )}

            {/* Connection Error */}
            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Lỗi kết nối"
                    color="red"
                    variant="light"
                >
                    {error}
                </Alert>
            )}
        </div>
    );
};
