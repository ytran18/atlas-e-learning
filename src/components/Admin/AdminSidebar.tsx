"use client";

import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import { GroupSidebarProps } from "@/types/adminSidebar";

export function GroupSidebar({
    title = "Danh sách nhóm",
    groups,
    selectedGroup,
    onSelectGroup,
}: GroupSidebarProps) {
    return (
        <div className="w-80 flex-shrink-0">
            <Card shadow="md" radius="lg" p="md" className="bg-white h-full">
                {/* Header */}
                <Group mb="lg">
                    {selectedGroup?.icon && (
                        <selectedGroup.icon size={24} className="text-blue-500" />
                    )}
                    <Title order={3}>{title}</Title>
                </Group>

                {/* Danh sách nhóm */}
                <Stack gap="sm">
                    {groups.map((group) => {
                        const IconComponent = group.icon;
                        const isSelected = selectedGroup.id === group.id;

                        return (
                            <Card
                                key={group.id}
                                shadow={isSelected ? "md" : "sm"}
                                radius="md"
                                p="md"
                                onClick={() => onSelectGroup(group)}
                                className={`cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300"
                                        : "bg-gray-50 hover:bg-blue-50"
                                }`}
                            >
                                {/* Tên nhóm */}
                                <Group justify="space-between" mb="xs">
                                    <Group gap="sm">
                                        <IconComponent
                                            size={20}
                                            className={`text-${group.color}-500`}
                                        />
                                        <Text fw={isSelected ? 600 : 500} size="sm">
                                            {group.name}
                                        </Text>
                                    </Group>
                                    {/* {isSelected && <IconChevronRight size={16} className="text-blue-500" />} */}
                                </Group>

                                {/* Thông tin tổng quan */}
                                {/* <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    {group.completed}/{group.totalStudents} học viên
                  </Text>
                  <Badge color={group.color} size="xs" variant="light">
                    {progressPercent}%
                  </Badge>
                </Group> */}
                            </Card>
                        );
                    })}
                </Stack>
            </Card>
        </div>
    );
}
