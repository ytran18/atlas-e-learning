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

import { createQueryClient } from "@/configs/reactQuery.config";
import { makeGrowthBook } from "@/libs/growthbook/make-growthbook";
import { initMixpanel } from "@/libs/mixpanel/mixpanel-client";

// Custom localization để thay đổi text
const customViVN = {
    ...viVN,
    formFieldLabel__username: "Số CCCD",
    formFieldInputPlaceholder__username: "Ví dụ: CC-012345678901",
    formFieldLabel__password: "Mật khẩu",
    formButtonPrimary: "Tiếp tục",
};

export default function Provider({
    children,
    growthBookPayload,
}: {
    children: React.ReactNode;
    growthBookPayload: GrowthBookPayload;
}) {
    // Tạo QueryClient instance, chỉ tạo 1 lần duy nhất
    const [queryClient] = useState(() => createQueryClient());

    const gb = useMemo(() => makeGrowthBook(growthBookPayload), [growthBookPayload]);

    useEffect(() => {
        initMixpanel();
    }, []);

    useEffect(() => {
        // Load features from the GrowthBook API and initialize the SDK
        gb.loadFeatures();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <GrowthBookProvider growthbook={gb}>
            <ClerkProvider
                localization={customViVN}
                afterSignOutUrl="/sign-in"
                signInUrl="/sign-in"
                signUpUrl="/sign-up"
            >
                <QueryClientProvider client={queryClient}>
                    <AntdRegistry>
                        <MantineProvider>
                            <ModalsProvider>
                                <Notifications />

                                {children}
                            </ModalsProvider>
                        </MantineProvider>
                    </AntdRegistry>
                    {/* React Query Devtools - chỉ hiện trong development */}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </ClerkProvider>
        </GrowthBookProvider>
    );
}
