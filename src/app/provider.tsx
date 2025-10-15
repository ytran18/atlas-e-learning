"use client";

import { useEffect, useState } from "react";

import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { createQueryClient } from "@/configs/reactQuery.config";
import { initMixpanel } from "@/libs/mixpanel/mixpanel-client";

// Custom localization để thay đổi text
const customViVN = {
    ...viVN,
    formFieldLabel__username: "Số CCCD",
    formFieldInputPlaceholder__username: "Ví dụ: CC-012345678901",
    formFieldLabel__password: "Mật khẩu",
    formButtonPrimary: "Tiếp tục",
};

export default function Provider({ children }: { children: React.ReactNode }) {
    // Tạo QueryClient instance, chỉ tạo 1 lần duy nhất
    const [queryClient] = useState(() => createQueryClient());

    useEffect(() => {
        initMixpanel();
    }, []);

    return (
        <ClerkProvider
            localization={customViVN}
            afterSignOutUrl="/sign-in"
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
        >
            <QueryClientProvider client={queryClient}>
                <MantineProvider>{children}</MantineProvider>
                {/* React Query Devtools - chỉ hiện trong development */}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ClerkProvider>
    );
}
