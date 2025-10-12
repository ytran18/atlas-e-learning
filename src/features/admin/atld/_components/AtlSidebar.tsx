"use client";

import { Badge, Card, Group, Progress, Stack, Text, Title } from "@mantine/core";
import { IconChevronRight, IconShield } from "@tabler/icons-react";

import { GroupSidebar } from "@/components/Admin/AdminSidebar";
import { GroupSidebarProps } from "@/types/adminSidebar";

export function AtlSidebar({ groups, selectedGroup, onSelectGroup }: GroupSidebarProps) {
    return (
        <GroupSidebar
            title="6 Nhóm ATLĐ"
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={onSelectGroup}
        />
    );
}
