"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Card, Drawer, Group, Stack, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconMenu2 } from "@tabler/icons-react";

import { CourseType } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

import { getCurrentAdminPathname } from "../../utils/get-current-admin-pathname";
import MobileCourseSelect from "./MobileCourseSelect";

const Header = () => {
    const [opened, { toggle, close }] = useDisclosure(false);

    const pathname = usePathname();

    const { atldId, hocNgheId } = useParams();

    const currentAdminPathname = getCurrentAdminPathname(pathname) as CourseType;

    const isAdminUser = getCurrentAdminPathname(pathname) === "user";

    const isMobile = useMediaQuery("(max-width: 640px)");

    const navigationItems = [
        { href: navigationPaths.QUAN_TRI_ATLD, label: "An toàn lao động" },
        { href: navigationPaths.QUAN_TRI_HOC_NGHE, label: "Học nghề" },
        { href: navigationPaths.QUAN_TRI_USER, label: "Người dùng" },
    ];

    return (
        <>
            <Card withBorder radius="md" className="!p-3 md:!p-4">
                <Group justify="space-between" align="center">
                    <div className="flex-1 flex gap-x-4 gap-y-1 items-center justify-between sm:flex-col sm:items-start">
                        <div className="text-lg md:text-2xl font-bold truncate w-full">
                            {isMobile ? (
                                <MobileCourseSelect
                                    defaultCourseId={
                                        currentAdminPathname === "atld"
                                            ? (atldId as string)
                                            : (hocNgheId as string)
                                    }
                                    currentAdminPathname={currentAdminPathname}
                                    isAdminUser={isAdminUser}
                                />
                            ) : (
                                "Quản trị hệ thống"
                            )}
                        </div>

                        <div>
                            <Text visibleFrom="sm" className="!text-xs !opacity-70">
                                Quản lý khóa học, video và người dùng
                            </Text>

                            <IconMenu2
                                onClick={toggle}
                                size="24px"
                                className="block sm:hidden cursor-pointer"
                            />
                        </div>
                    </div>
                </Group>
            </Card>

            <Drawer
                opened={opened}
                onClose={close}
                position="left"
                size="sm"
                title={
                    <Text fw={600} size="lg">
                        Quản trị hệ thống
                    </Text>
                }
                hiddenFrom="sm"
            >
                <Stack gap="md" mt="md">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            className="block p-3 rounded-md no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)] transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
};

export default Header;
