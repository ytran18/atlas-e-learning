import { Card, Text, Tooltip } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

import { EditInfoType } from ".";

type InfoCardProps = {
    title: string;
    icon: React.ReactNode;
    value: string;
    onEdit: (type: EditInfoType) => void;
    type: EditInfoType;
};

const InfoCard = ({ title, icon, value, onEdit, type }: InfoCardProps) => {
    return (
        <Card withBorder radius="md" shadow="sm" className="w-full relative">
            <div className="flex flex-col gap-y-2">
                <Text fw={500} size="sm">
                    {title}
                </Text>

                <div className="flex w-full items-center gap-x-4">
                    {icon}

                    <Text size="sm">{value}</Text>
                </div>
            </div>

            <div className="absolute top-2 right-3">
                <Tooltip label="Chỉnh sửa" withArrow>
                    <IconPencil className="size-4 cursor-pointer" onClick={() => onEdit(type)} />
                </Tooltip>
            </div>
        </Card>
    );
};

export default InfoCard;
