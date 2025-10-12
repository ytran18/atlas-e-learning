"use client";

import { useState } from "react";

import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Card,
    Group,
    Progress,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import {
    IconCertificate,
    IconChevronRight,
    IconDownload,
    IconEye,
    IconFileText,
    IconShield,
    IconUsers,
} from "@tabler/icons-react";

import { AtlSidebar } from "@/features/admin/atld/_components/AtlSidebar";
import { atldGroups, mockStudents } from "@/mock/adminData";

export default function AtldAdminPage() {
    const [selectedGroup, setSelectedGroup] = useState(atldGroups[0]);

    // const getProgressValue = (group: typeof atldGroups[0]) => {
    //   return (group.completed / group.totalStudents) * 100;
    // };

    const getStatusIcon = (status: boolean) => {
        return status ? "✅" : "❌";
    };

    return (
        <div className="flex gap-6 h-full">
            {/* Sidebar - Danh sách nhóm ATLĐ */}
            {/* <div className="w-80 flex-shrink-0">
        <Card shadow="md" radius="lg" p="md" className="bg-white h-full">
          <Group mb="lg">
            <IconShield size={24} className="text-blue-500" />
            <Title order={3}>6 Nhóm ATLĐ</Title>
          </Group>
          
          <Stack gap="sm">
            {atldGroups.map((group) => {
              const IconComponent = group.icon;
              const isSelected = selectedGroup.id === group.id;
              
              return (
                <Card
                  key={group.id}
                  shadow={isSelected ? "md" : "sm"}
                  radius="md"
                  p="md"
                  onClick={() => setSelectedGroup(group)}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-50 hover:bg-blue-50'
                  }`}
                >
                  <Group justify="space-between" mb="xs">
                    <Group gap="sm">
                      <IconComponent size={20} className={`text-${group.color}-500`} />
                      <Text fw={isSelected ? 600 : 500} size="sm">
                        {group.name}
                      </Text>
                    </Group>
                    {isSelected && <IconChevronRight size={16} className="text-blue-500" />}
                  </Group>
                  
                  <Group justify="space-between" mb="xs">
                    <Text size="xs" c="dimmed">
                      {group.completed}/{group.totalStudents} học viên
                    </Text>
                    <Badge color={group.color} size="xs" variant="light">
                      {Math.round(getProgressValue(group))}%
                    </Badge>
                  </Group>
                  
                  <Progress 
                    value={getProgressValue(group)} 
                    color={group.color} 
                    size="sm" 
                    radius="xl"
                  />
                </Card>
              );
            })}
          </Stack>
        </Card>
      </div> */}
            <AtlSidebar
                groups={atldGroups}
                selectedGroup={selectedGroup}
                onSelectGroup={setSelectedGroup}
            />

            {/* Main Content - Chi tiết nhóm được chọn */}
            <div className="flex-1">
                <Stack gap="lg">
                    {/* Header thông tin nhóm */}
                    <Card
                        shadow="md"
                        radius="lg"
                        p="xl"
                        className="bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                    >
                        <Group justify="space-between" align="center">
                            <div>
                                <Group mb="xs">
                                    <selectedGroup.icon size={32} />
                                    <Title order={2}>{selectedGroup.name}</Title>
                                </Group>
                                <Text size="lg" opacity={0.9}>
                                    Quản lý học viên và chứng nhận
                                </Text>
                            </div>
                            <Group>
                                <Button
                                    variant="white"
                                    color="blue"
                                    leftSection={<IconDownload size={16} />}
                                >
                                    Xuất PDF
                                </Button>
                                <Button
                                    variant="white"
                                    color="blue"
                                    leftSection={<IconCertificate size={16} />}
                                >
                                    Cấp chứng nhận
                                </Button>
                            </Group>
                        </Group>
                    </Card>

                    {/* Stats cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <Card shadow="sm" radius="lg" p="md" className="bg-white">
                            <Group gap="sm">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <IconUsers size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    {/* <Text size="xl" fw={700}>{selectedGroup.totalStudents}</Text> */}
                                    <Text size="xs" c="dimmed">
                                        Tổng học viên
                                    </Text>
                                </div>
                            </Group>
                        </Card>

                        <Card shadow="sm" radius="lg" p="md" className="bg-white">
                            <Group gap="sm">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <IconCertificate size={20} className="text-green-600" />
                                </div>
                                <div>
                                    {/* <Text size="xl" fw={700}>{selectedGroup.completed}</Text> */}
                                    <Text size="xs" c="dimmed">
                                        Hoàn thành
                                    </Text>
                                </div>
                            </Group>
                        </Card>

                        <Card shadow="sm" radius="lg" p="md" className="bg-white">
                            <Group gap="sm">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <IconFileText size={20} className="text-orange-600" />
                                </div>
                                <div>
                                    {/* <Text size="xl" fw={700}>{selectedGroup.totalStudents - selectedGroup.completed}</Text> */}
                                    <Text size="xs" c="dimmed">
                                        Đang học
                                    </Text>
                                </div>
                            </Group>
                        </Card>

                        <Card shadow="sm" radius="lg" p="md" className="bg-white">
                            <Group gap="sm">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {/* <Text size="sm" fw={700} className="text-blue-600">
                    {Math.round(getProgressValue(selectedGroup))}%
                  </Text> */}
                                </div>
                                <div>
                                    <Text size="xl" fw={700}>
                                        Tiến độ
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        Hoàn thành
                                    </Text>
                                </div>
                            </Group>
                        </Card>
                    </div>

                    {/* Bảng danh sách học viên */}
                    <Card shadow="md" radius="lg" p="md" className="bg-white">
                        <Group justify="space-between" mb="lg">
                            <Title order={4}>Danh sách học viên</Title>
                            <Group>
                                <Button
                                    variant="light"
                                    size="sm"
                                    leftSection={<IconDownload size={16} />}
                                >
                                    Xuất danh sách
                                </Button>
                            </Group>
                        </Group>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                                            STT
                                        </th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                                            Học viên
                                        </th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                                            Ngày sinh
                                        </th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                                            CCCD
                                        </th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                                            Công ty
                                        </th>
                                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                                            Lý thuyết
                                        </th>
                                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                                            Thực hành
                                        </th>
                                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                                            Kiểm tra
                                        </th>
                                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                                            Chứng nhận
                                        </th>
                                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockStudents.map((student, index) => (
                                        <tr
                                            key={student.id}
                                            className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                        >
                                            <td className="py-3 px-2">{index + 1}</td>
                                            <td className="py-3 px-2">
                                                <Group gap="sm">
                                                    <Avatar
                                                        src={student.avatar}
                                                        size="sm"
                                                        radius="xl"
                                                    />
                                                    <div>
                                                        <Text size="sm" fw={500}>
                                                            {student.name}
                                                        </Text>
                                                    </div>
                                                </Group>
                                            </td>
                                            <td className="py-3 px-2">
                                                <Text size="sm">{student.dateOfBirth}</Text>
                                            </td>
                                            <td className="py-3 px-2">
                                                <Text size="sm" className="font-mono">
                                                    {student.cccd}
                                                </Text>
                                            </td>
                                            <td className="py-3 px-2">
                                                <Text size="sm">{student.company}</Text>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className="text-lg">
                                                    {getStatusIcon(student.theory)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className="text-lg">
                                                    {getStatusIcon(student.practice)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className="text-lg">
                                                    {getStatusIcon(student.exam)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className="text-lg">
                                                    {getStatusIcon(student.certificate)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                <Group gap="xs" justify="center">
                                                    <ActionIcon
                                                        variant="light"
                                                        color="blue"
                                                        size="sm"
                                                    >
                                                        <IconEye size={14} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="light"
                                                        color="green"
                                                        size="sm"
                                                    >
                                                        <IconDownload size={14} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="light"
                                                        color="orange"
                                                        size="sm"
                                                    >
                                                        <IconCertificate size={14} />
                                                    </ActionIcon>
                                                </Group>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Stack>
            </div>
        </div>
    );
}
