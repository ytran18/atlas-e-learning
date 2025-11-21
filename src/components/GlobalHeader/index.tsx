"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Avatar, Box, Burger, Button, Drawer, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { USER_SLUG, navigationPaths } from "@/utils/navigationPaths";

import AuthButton from "./AuthButton";

const GlobalHeader = () => {
    const router = useRouter();

    const { t } = useI18nTranslate();

    const { signOut, user, isSignedIn } = useClerk();

    const userData = user?.unsafeMetadata;

    const isAdmin =
        user?.unsafeMetadata?.role === "admin" || user?.unsafeMetadata?.role === "staff"
            ? true
            : false;

    const currentPath = usePathname();

    const [opened, { toggle, close }] = useDisclosure(false);

    const navigationItems = [
        { href: navigationPaths.LANDING_PAGE, label: t("trang_chu"), isVisible: true },
        { href: navigationPaths.ATLD, label: t("dao_tao_atld"), isVisible: true },
        { href: navigationPaths.HOC_NGHE, label: t("hoc_nghe_1"), isVisible: true },
        { href: navigationPaths.QUAN_TRI_ATLD, label: t("quan_tri"), isVisible: isAdmin },
    ];

    const handleLogout = () => {
        close();
        signOut(() => router.push("/"));
    };

    const handleUserDetail = () => {
        if (!user?.id) return;

        router.push(navigationPaths.USER_DETAIL.replace(`[${USER_SLUG}]`, user.id));
    };

    return (
        <Box className="sticky top-0 z-50 supports-backdrop-filter:bg-white">
            <header className="h-[60px] pl-(--mantine-spacing-md) pr-(--mantine-spacing-md) border-b border-(--mantine-color-gray-3)">
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
                                    className="flex items-center h-[42px] sm:h-full w-full sm:w-auto pl-(--mantine-spacing-md) pr-(--mantine-spacing-md) no-underline text-(--mantine-color-black) font-medium hover:bg-(--mantine-color-gray-0)"
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
                withCloseButton={false}
                position="right"
                size="280px"
                title={
                    userData ? (
                        <div className="flex items-center gap-x-3" onClick={handleUserDetail}>
                            <Avatar src={user?.imageUrl || ""} radius="xl" size="sm" />

                            <Box style={{ flex: 1 }}>
                                <Text size="sm" fw={500}>
                                    {userData?.fullName as string}
                                </Text>

                                <Text c="dimmed" size="xs">
                                    {userData?.cccd as string}
                                </Text>
                            </Box>
                        </div>
                    ) : (
                        <Text fw={600} size="lg">
                            {t("an_toan_lao_dong")}
                        </Text>
                    )
                }
                hiddenFrom="sm"
            >
                <Stack gap="md" mt="md">
                    {!isSignedIn && (
                        <Group hiddenFrom="xs">
                            <AuthButton
                                className="flex! flex-col! w-full!"
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
                                className="block p-3 rounded-md no-underline text-(--mantine-color-black) font-medium hover:bg-(--mantine-color-gray-0) transition-colors"
                            >
                                {item.label}
                            </Link>
                        );
                    })}

                    {isSignedIn && (
                        <Button color="red" size="sm" onClick={handleLogout}>
                            <div className="flex items-center gap-x-2">
                                <IconLogout className="text-white" size={16} />
                                <Text>{t("dang_xuat")}</Text>
                            </div>
                        </Button>
                    )}
                </Stack>
            </Drawer>
        </Box>
    );
};

export default GlobalHeader;
