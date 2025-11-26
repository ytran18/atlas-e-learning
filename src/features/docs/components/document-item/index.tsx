import { Button, Card, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBrandYoutube, IconDownload, IconFileTypePdf, IconVideo } from "@tabler/icons-react";
import dayjs from "dayjs";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { DocumentResponse } from "@/types/documents";

type DocumentItemProps = {
    doc: DocumentResponse;
};

const DocumentItem = ({ doc }: DocumentItemProps) => {
    const { t } = useI18nTranslate();

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!doc.url) {
            notifications.show({
                title: t("loi"),
                message: t("tai_lieu_khong_co_link"),
                color: "yellow",
                position: "top-right",
            });
            return;
        }

        window.open(doc?.url, "_blank");
    };

    const isPdf = doc.type === "file";

    return (
        <Card
            withBorder
            radius="md"
            padding="lg"
            className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 h-full flex flex-col gap-y-3"
            onClick={handleAction}
        >
            <div className="flex justify-between items-start mb-4">
                <div
                    className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                        isPdf ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                    }`}
                >
                    {isPdf ? <IconFileTypePdf size={28} /> : <IconVideo size={28} />}
                </div>
                <Text size="xs" c="dimmed" fw={500}>
                    {dayjs(Number(doc.createdAt)).format("DD/MM/YYYY")}
                </Text>
            </div>

            <Text
                fw={700}
                size="lg"
                lineClamp={2}
                className="mb-2 group-hover:text-blue-600 transition-colors"
            >
                {doc.title}
            </Text>

            <Text size="sm" c="dimmed" lineClamp={2} className="mb-6 grow">
                {doc.description || t("khong_co_mo_ta")}
            </Text>

            <Button
                variant="light"
                color={isPdf ? "red" : "blue"}
                fullWidth
                radius="md"
                onClick={handleAction}
                leftSection={isPdf ? <IconDownload size={18} /> : <IconBrandYoutube size={18} />}
            >
                {isPdf ? t("tai_ve_tai_lieu") : t("xem_video_bai_giang")}
            </Button>
        </Card>
    );
};

export default DocumentItem;
