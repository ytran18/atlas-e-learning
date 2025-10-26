import { FunctionComponent } from "react";

import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type UploadErrorBlockProps = {
    uploadError: Error;
};

const UploadErrorBlock: FunctionComponent<UploadErrorBlockProps> = ({ uploadError }) => {
    return (
        <Alert icon={<IconAlertCircle size={16} />} title="Lỗi upload" color="red" variant="light">
            {uploadError.message}
        </Alert>
    );
};

export default UploadErrorBlock;
