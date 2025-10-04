"use client";

import { useEffect } from "react";

import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

import { initMixpanel } from "@/libs/mixpanel/mixpanel-client";

export default function Provider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initMixpanel();
    }, []);

    return (
        <ClerkProvider
            localization={viVN}
            afterSignOutUrl="/sign-in"
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
        >
            {children}
        </ClerkProvider>
    );
}
