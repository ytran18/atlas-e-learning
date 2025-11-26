import { FunctionComponent } from "react";

import { Alert, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import { FinalResult } from "../../types/video";

type UploadedResultBlockProps = {
    result: FinalResult;
};

const UploadedResultBlock: FunctionComponent<UploadedResultBlockProps> = ({ result }) => {
    const { t } = useI18nTranslate();

    return (
        <Alert
            icon={<IconCheck size={16} />}
            title={`🎉 ${t("video_xu_ly_hoan_thanh")}`}
            color="green"
            variant="light"
        >
            <div className="space-y-2">
                <Text size="sm">
                    <strong>Task ID:</strong> {result.taskId}
                </Text>
                <Text size="sm">
                    <strong>{t("thoi_gian_xu_ly")}:</strong> {result.processingTime}ms
                </Text>
                <Text size="sm">
                    <strong>M3U8 Playlist:</strong> {result.m3u8Playlist}
                </Text>
                <Text size="sm">
                    <strong>R2 URL:</strong> {result.uploadResult.url}
                </Text>
                <Text size="sm">
                    <strong>R2 Key:</strong> {result.uploadResult.key}
                </Text>
                <Text size="sm">
                    <strong>Segments:</strong> {result.segments.length} files
                </Text>
            </div>
        </Alert>
    );
};

export default UploadedResultBlock;
