"use client";

import { useEffect, useMemo, useState } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { GrowthBookPayload, GrowthBookProvider } from "@growthbook/growthbook-react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CookiesProvider, useCookies } from "react-cookie";

import { createQueryClient } from "@/configs/reactQuery.config";
import { makeGrowthBook } from "@/libs/growthbook/make-growthbook";
import { I18nProvider } from "@/libs/i18n/provider";
import { i18nCookieName } from "@/libs/i18n/settings";
import { initMixpanel } from "@/libs/mixpanel/mixpanel-client";
import { useMixpanelUserIdentification } from "@/libs/mixpanel/tracking";

// Custom localization để thay đổi text
const customViVN = {
    ...viVN,
    formFieldLabel__username: "Số CCCD",
    formFieldInputPlaceholder__username: "Ví dụ: CC-012345678901",
    formFieldLabel__password: "Mật khẩu",
    formButtonPrimary: "Tiếp tục",
};

// Inner component to use hooks (must be inside ClerkProvider)
function ProviderContent({
    children,
    growthBookPayload,
}: {
    children: React.ReactNode;
    growthBookPayload: GrowthBookPayload;
}) {
    // Tạo QueryClient instance, chỉ tạo 1 lần duy nhất
    const [queryClient] = useState(() => createQueryClient());

    const [cookies] = useCookies([i18nCookieName]);

    const gb = useMemo(() => makeGrowthBook(growthBookPayload), [growthBookPayload]);

    // Identify user in Mixpanel when authenticated
    useMixpanelUserIdentification();

    useEffect(() => {
        initMixpanel();
    }, []);

    useEffect(() => {
        // Load features from the GrowthBook API and initialize the SDK
        gb.loadFeatures();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <I18nProvider lng={cookies["Atld.Locale"]}>
                <AntdRegistry>
                    <MantineProvider>
                        <ModalsProvider>
                            <Notifications />

                            {children}
                        </ModalsProvider>
                    </MantineProvider>
                </AntdRegistry>
            </I18nProvider>
            {/* React Query Devtools - chỉ hiện trong development */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default function Provider({
    children,
    growthBookPayload,
}: {
    children: React.ReactNode;
    growthBookPayload: GrowthBookPayload;
}) {
    const gb = useMemo(() => makeGrowthBook(growthBookPayload), [growthBookPayload]);

    return (
        <GrowthBookProvider growthbook={gb}>
            <ClerkProvider
                localization={customViVN}
                afterSignOutUrl="/sign-in"
                signInUrl="/sign-in"
                signUpUrl="/sign-up"
            >
                <CookiesProvider>
                    <ProviderContent growthBookPayload={growthBookPayload}>
                        {children}
                    </ProviderContent>
                </CookiesProvider>
            </ClerkProvider>
        </GrowthBookProvider>
    );
}
