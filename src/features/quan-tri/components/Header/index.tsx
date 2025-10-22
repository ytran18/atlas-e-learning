import { Badge, Card, Group, Text, Title } from "@mantine/core";

const Header = () => {
    return (
        <Card withBorder radius="md" className="p-4 md:p-8">
            <Group justify="space-between" align="center">
                <div className="flex-1">
                    <Group align="center" mb="xs" className="gap-2 md:gap-4">
                        <Title order={1} className="text-lg md:text-2xl font-bold truncate">
                            Quản trị hệ thống
                        </Title>
                        <Badge
                            variant="default"
                            color="white"
                            size="sm"
                            className="sm:inline-block"
                        >
                            Admin Panel
                        </Badge>
                    </Group>
                    <Text className="text-sm md:text-lg opacity-90">
                        Quản lý khóa học, video và người dùng
                    </Text>
                </div>
            </Group>
        </Card>
    );
};

export default Header;
