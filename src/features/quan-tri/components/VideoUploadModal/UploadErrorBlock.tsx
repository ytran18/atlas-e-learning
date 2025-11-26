import { FunctionComponent } from "react";

import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type UploadErrorBlockProps = {
    uploadError: Error;
};

const UploadErrorBlock: FunctionComponent<UploadErrorBlockProps> = ({ uploadError }) => {
    const { t } = useI18nTranslate();

    return (
        <Alert
            icon={<IconAlertCircle size={16} />}
            title={t("loi_upload")}
            color="red"
            variant="light"
        >
            {uploadError.message}
        </Alert>
    );
};

export default UploadErrorBlock;
