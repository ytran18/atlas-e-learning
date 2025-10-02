"use client";

import { useEffect } from "react";

import { initMixpanel } from "@/libs/mixpanel/mixpanel-client";

export default function Provider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initMixpanel();
    }, []);

    return <>{children}</>;
}
