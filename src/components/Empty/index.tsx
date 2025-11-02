import { Text } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";

type EmptyProps = {
    title?: string;
};

const Empty = ({ title }: EmptyProps) => {
    return (
        <div className="flex flex-col gap-y-3 items-center justify-center h-full">
            <IconDatabaseOff color="gray" />

            <Text size="sm" c="dimmed" fw={500}>
                {title}
            </Text>
        </div>
    );
};

export default Empty;
