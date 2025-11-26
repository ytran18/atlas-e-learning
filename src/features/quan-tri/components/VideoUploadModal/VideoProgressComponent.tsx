import React from "react";

import { Alert, Group, Progress, Text } from "@mantine/core";
import { IconAlertCircle, IconClock } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

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
    const { t } = useI18nTranslate();

    if (!progress) {
        return (
            <Alert
                icon={<IconClock size={16} />}
                title={t("dang_ket_noi")}
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
                        {isConnected ? t("websocket_da_ket_noi") : t("websocket_chua_ket_noi")}
                    </Text>
                </div>
                {error && (
                    <Text size="sm" c="red" mt="xs">
                        {t("loi")}: {error}
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
                return t("dang_cho_xu_ly");
            case "processing":
                return t("dang_xu_ly");
            case "completed":
                return t("hoan_thanh");
            case "failed":
                return t("that_bai");
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
                        {t("trang_thai")}:
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
                    <Text size="sm">{t("tien_trinh")}</Text>
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
                    title={t("loi_xu_ly")}
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
                    title={t("loi_ket_noi")}
                    color="red"
                    variant="light"
                >
                    {error}
                </Alert>
            )}
        </div>
    );
};
