import { FunctionComponent } from "react";

import { Alert, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import { FinalResult } from "../../types/video";

type UploadedResultBlockProps = {
    result: FinalResult;
};

const UploadedResultBlock: FunctionComponent<UploadedResultBlockProps> = ({ result }) => {
    return (
        <Alert
            icon={<IconCheck size={16} />}
            title="🎉 Video xử lý hoàn thành!"
            color="green"
            variant="light"
        >
            <div className="space-y-2">
                <Text size="sm">
                    <strong>Task ID:</strong> {result.taskId}
                </Text>
                <Text size="sm">
                    <strong>Thời gian xử lý:</strong> {result.processingTime}ms
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
