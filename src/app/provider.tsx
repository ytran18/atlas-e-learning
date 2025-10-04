"use client";

import { useEffect } from "react";

import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

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
            {children}
        </ClerkProvider>
    );
}
