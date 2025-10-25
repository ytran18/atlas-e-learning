import { FunctionComponent } from "react";

import { Progress, Text } from "@mantine/core";

type UploadProgressBlockProps = {
    uploadProgress: number;
};

const UploadProgressBlock: FunctionComponent<UploadProgressBlockProps> = ({ uploadProgress }) => {
    return (
        <div className="space-y-4">
            <Text size="sm" fw={500}>
                Đang tải lên...
            </Text>

            <Progress value={uploadProgress} size="sm" />
        </div>
    );
};

export default UploadProgressBlock;
