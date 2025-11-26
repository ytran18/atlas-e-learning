"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import {
    Avatar,
    Box,
    Burger,
    Button,
    Card,
    Drawer,
    Group,
    Select,
    Stack,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconLanguage, IconLogout } from "@tabler/icons-react";
import { useCookies } from "react-cookie";

import { useI18nContext } from "@/libs/i18n/provider";
import { fallbackLng, i18nCookieName, listLanguages } from "@/libs/i18n/settings";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { USER_SLUG, navigationPaths } from "@/utils/navigationPaths";

import AuthButton from "./AuthButton";

const GlobalHeader = () => {
    const router = useRouter();

    const { t } = useI18nTranslate();

    const { lng } = useI18nContext();

    // eslint-disable-next-line
    const [_, setCookie] = useCookies([i18nCookieName]);

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
        { href: navigationPaths.DOCUMENTS, label: t("tai_lieu"), isVisible: true },
        { href: navigationPaths.QUAN_TRI_ATLD, label: t("quan_tri"), isVisible: isAdmin },
    ];

    const handleLogout = () => {
        close();
        signOut(() => router.push("/"));
    };

    const handleUserDetail = () => {
        if (!user?.id) return;

        close?.();

        router.push(navigationPaths.USER_DETAIL.replace(`[${USER_SLUG}]`, user.id));
    };

    const handleLanguageChange = (value: string | null) => {
        setCookie(i18nCookieName, value);
    };

    return (
        <Box className="sticky top-0 z-50 supports-backdrop-filter:bg-white">
            <header className="h-[60px] pl-(--mantine-spacing-md) pr-(--mantine-spacing-md) border-b border-(--mantine-color-gray-3)">
                <Group display="grid" className="grid-cols-12" h="100%">
                    <div className="col-span-4 md:col-span-2 xl:col-span-3">
                        <Image
                            src="/images/atld-logo.webp"
                            alt={t("atld_logo")}
                            width={120}
                            height={40}
                            onClick={() => router.push(navigationPaths.LANDING_PAGE)}
                            className="cursor-pointer"
                            priority
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <Group
                        className="col-span-6 xl:col-span-5 justify-center!"
                        h="100%"
                        gap={0}
                        visibleFrom="md"
                    >
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
                    <Box visibleFrom="md" className="col-span-4 place-items-end">
                        <AuthButton />
                    </Box>

                    {/* Mobile Menu Button */}
                    <Group
                        gap="xs"
                        hiddenFrom="md"
                        className="col-span-8 md:col-span-10 justify-end!"
                    >
                        <Group hiddenFrom="xs">
                            <Select
                                leftSection={<IconLanguage className="size-5" />}
                                value={lng ?? fallbackLng}
                                data={listLanguages}
                                onChange={handleLanguageChange}
                                w={140}
                                checkIconPosition="right"
                            />
                        </Group>

                        <Group visibleFrom="xs" hiddenFrom="md">
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
                classNames={{
                    title: "w-full",
                }}
                title={
                    userData ? (
                        <Card withBorder shadow="md">
                            <div
                                className="w-full flex items-center justify-between gap-x-3 cursor-pointer"
                                onClick={handleUserDetail}
                            >
                                <div className="flex items-center gap-x-3">
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

                                <IconChevronRight />
                            </div>
                        </Card>
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
