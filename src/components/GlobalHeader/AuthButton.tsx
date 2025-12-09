"use client";

import { FunctionComponent } from "react";

import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Box, Button, Group, Select, Text } from "@mantine/core";
import { IconLanguage, IconLogout } from "@tabler/icons-react";
import { useCookies } from "react-cookie";

import { useI18nContext } from "@/libs/i18n/provider";
import { fallbackLng, i18nCookieName, listLanguages } from "@/libs/i18n/settings";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { trackUserSignedOut } from "@/libs/mixpanel";
import { USER_SLUG, navigationPaths } from "@/utils/navigationPaths";

type AuthButtonProps = {
    className?: string;
    signInButtonClassName?: string;
    signUpButtonClassName?: string;
    onLogin?: () => void;
    onSignUp?: () => void;
};

const AuthButton: FunctionComponent<AuthButtonProps> = ({
    className,
    signInButtonClassName,
    signUpButtonClassName,
    onLogin,
    onSignUp,
}) => {
    const router = useRouter();

    // eslint-disable-next-line
    const [_, setCookie] = useCookies([i18nCookieName]);

    const { lng } = useI18nContext();

    const { t } = useI18nTranslate();

    const { signOut } = useClerk();

    const { user, isLoaded } = useUser();

    const userData = user?.unsafeMetadata;

    const handleLogin = () => {
        router.push(navigationPaths.SIGN_IN);

        if (onLogin) {
            onLogin();
        }
    };

    const handleSignUp = () => {
        router.push(navigationPaths.SIGN_UP);

        if (onSignUp) {
            onSignUp();
        }
    };

    const handleUserDetail = () => {
        if (!user?.id) return;

        router.push(navigationPaths.USER_DETAIL.replace(`[${USER_SLUG}]`, user.id));
    };

    const handleLanguageChange = (value: string | null) => {
        setCookie(i18nCookieName, value);
    };

    // Show loading state while checking authentication
    if (!isLoaded) return null;

    if (!!userData) {
        return (
            <Group className="hover:cursor-pointer">
                <Select
                    leftSection={<IconLanguage className="size-5" />}
                    value={lng ?? fallbackLng}
                    data={listLanguages}
                    onChange={handleLanguageChange}
                    w={140}
                    checkIconPosition="right"
                />

                <Avatar
                    src={user?.imageUrl || ""}
                    radius="xl"
                    size="sm"
                    onClick={handleUserDetail}
                />

                <Box visibleFrom="xl" onClick={handleUserDetail}>
                    <Text size="sm" fw={500}>
                        {userData?.fullName as string}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {userData?.cccd as string}
                    </Text>
                </Box>

                <Button
                    visibleFrom="md"
                    variant="default"
                    size="xs"
                    onClick={() => {
                        // Track sign-out
                        trackUserSignedOut({
                            user_id: user.id,
                        });

                        signOut(() => router.push("/"));
                    }}
                >
                    <div className="flex items-center gap-x-2">
                        <IconLogout className="text-gray-700" size={16} />
                        <Text size="xs" visibleFrom="xl">
                            {t("dang_xuat")}
                        </Text>
                    </div>
                </Button>
            </Group>
        );
    }

    return (
        <Group gap="xs" className={`${className} justify-end!`}>
            <Button
                variant="default"
                size="xs"
                onClick={handleLogin}
                className={signInButtonClassName}
            >
                {t("dang_nhap")}
            </Button>
            <Button size="xs" onClick={handleSignUp} className={signUpButtonClassName}>
                {t("dang_ky")}
            </Button>
        </Group>
    );
};

export default AuthButton;
