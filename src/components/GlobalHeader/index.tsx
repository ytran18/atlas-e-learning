"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Box, Burger, Button, Drawer, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout } from "@tabler/icons-react";

import { navigationPaths } from "@/utils/navigationPaths";

import AuthButton from "./AuthButton";

const GlobalHeader = () => {
    const router = useRouter();

    const { signOut, user, isSignedIn } = useClerk();

    const isAdmin = user?.unsafeMetadata?.role === "admin" ? true : false;

    const currentPath = usePathname();

    const [opened, { toggle, close }] = useDisclosure(false);

    const navigationItems = [
        { href: navigationPaths.LANDING_PAGE, label: "Trang chủ", isVisible: true },
        { href: navigationPaths.ATLD, label: "Đào tạo ATLD", isVisible: true },
        { href: navigationPaths.HOC_NGHE, label: "Học nghề", isVisible: true },
        { href: navigationPaths.QUAN_TRI_ATLD, label: "Quản trị", isVisible: isAdmin },
    ];

    const handleLogout = () => {
        close();
        signOut(() => router.push("/"));
    };

    return (
        <Box className="sticky top-0 z-50 supports-[backdrop-filter]:bg-white">
            <header className="h-[60px] pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] border-b border-[var(--mantine-color-gray-3)]">
                <Group justify="space-between" h="100%">
                    <Image
                        src="/images/atld-logo.webp"
                        alt="ATLD Logo"
                        width={120}
                        height={40}
                        onClick={() => router.push(navigationPaths.LANDING_PAGE)}
                        className="cursor-pointer"
                        priority
                    />

                    {/* Desktop Navigation */}
                    <Group h="100%" gap={0} visibleFrom="sm">
                        {navigationItems.map((item) => {
                            if (!item.isVisible) {
                                return null;
                            }

                            const isAdminActive = currentPath.includes("/quan-tri");

                            const isActive =
                                currentPath === item.href ||
                                (item.href === navigationPaths.QUAN_TRI_ATLD && isAdminActive);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center h-[42px] sm:h-full w-full sm:w-auto pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)]"
                                    style={{
                                        fontSize: "var(--mantine-font-size-sm)",
                                        color: isActive ? "#1D72FE" : "",
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </Group>

                    {/* Desktop Auth Button */}
                    <Box visibleFrom="sm">
                        <AuthButton />
                    </Box>

                    {/* Mobile Menu Button */}
                    <Group gap="xs" hiddenFrom="sm">
                        <Group visibleFrom="xs" hiddenFrom="sm">
                            <AuthButton />
                        </Group>

                        <Burger opened={opened} onClick={toggle} size="sm" />
                    </Group>
                </Group>
            </header>

            {/* Mobile Drawer */}
            <Drawer
                opened={opened}
                onClose={close}
                position="right"
                size="280px"
                title={
                    <Text fw={600} size="lg">
                        An toàn lao động
                    </Text>
                }
                hiddenFrom="sm"
            >
                <Stack gap="md" mt="md">
                    {!isSignedIn && (
                        <Group hiddenFrom="xs">
                            <AuthButton
                                className="!flex !flex-col !w-full"
                                signInButtonClassName="!w-full"
                                signUpButtonClassName="!w-full"
                                onLogin={close}
                                onSignUp={close}
                            />
                        </Group>
                    )}

                    {navigationItems.map((item) => {
                        if (!item.isVisible) {
                            return null;
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={close}
                                className="block p-3 rounded-md no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)] transition-colors"
                            >
                                {item.label}
                            </Link>
                        );
                    })}

                    {isSignedIn && (
                        <Button color="red" size="sm" onClick={handleLogout}>
                            <div className="flex items-center gap-x-2">
                                <IconLogout className="text-white" size={16} />
                                <Text>Đăng xuất</Text>
                            </div>
                        </Button>
                    )}
                </Stack>
            </Drawer>
        </Box>
    );
};

export default GlobalHeader;
