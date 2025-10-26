import { FunctionComponent } from "react";

import { Progress, Text } from "@mantine/core";

type UploadProgressBlockProps = {
    uploadProgress: number;
};

const UploadProgressBlock: FunctionComponent<UploadProgressBlockProps> = ({ uploadProgress }) => {
    return (
        <div className="flex flex-col gap-y-1">
            <div className="w-full flex justify-between items-center">
                <Text size="sm" fw={500}>
                    Đang tải lên...
                </Text>

                <Text size="sm" fw={500}>
                    {uploadProgress}%
                </Text>
            </div>

            <Progress value={uploadProgress} size="sm" />
        </div>
    );
};

export default UploadProgressBlock;
