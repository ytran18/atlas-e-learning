"use client";

import { Badge, Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

export function AdminHeader() {
    return (
        <Card
            shadow="lg"
            radius="xl"
            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 md:p-8 mb-4 md:mb-8"
        >
            <Group justify="space-between" align="center">
                <div className="flex-1">
                    <Group align="center" mb="xs" className="gap-2 md:gap-4">
                        <ThemeIcon
                            size="lg"
                            variant="white"
                            color="blue"
                            radius="xl"
                            className="w-8 h-8 md:w-12 md:h-12"
                        >
                            <IconChartBar className="w-5 h-5 md:w-6 md:h-6" />
                        </ThemeIcon>
                        <Title order={1} className="text-lg md:text-2xl font-bold truncate">
                            Quản trị hệ thống
                        </Title>
                        <Badge variant="light" color="white" size="sm" className="sm:inline-block">
                            Admin Panel
                        </Badge>
                    </Group>
                    <Text className="text-sm md:text-lg opacity-90">
                        Quản lý khóa học, video và người dùng một cách hiệu quả
                    </Text>
                </div>
            </Group>
        </Card>
    );
}
