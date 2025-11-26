import { FunctionComponent } from "react";

import { Group } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { IconUpload, IconVideoPlus, IconX } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type DropZoneBlockProps = Partial<DropzoneProps> & {
    onDrop: (files: File[]) => void;
    isUploading: boolean;
};

const DropZoneBlock: FunctionComponent<DropZoneBlockProps> = ({
    onDrop,
    isUploading,
    ...props
}) => {
    const { t } = useI18nTranslate();

    return (
        <Dropzone
            onDrop={onDrop}
            accept={{
                "video/*": [], // Cho phép mọi định dạng video
            }}
            disabled={isUploading}
            {...props}
        >
            <Group justify="center" gap="xl" style={{ pointerEvents: "none" }}>
                <Dropzone.Accept>
                    <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                </Dropzone.Accept>

                <Dropzone.Reject>
                    <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                </Dropzone.Reject>

                <Dropzone.Idle>
                    <IconVideoPlus size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
                </Dropzone.Idle>

                <div className="text-center flex flex-col">
                    <p>{t("keo_tha_video_vao_day_hoac_nhan_de_chon_file")}</p>

                    <p className="text-gray-500 text-sm">
                        {t("keo_tha_video_vao_day_hoac_nhan_de_chon_file_moi_f")}
                    </p>
                </div>
            </Group>
        </Dropzone>
    );
};

export default DropZoneBlock;
