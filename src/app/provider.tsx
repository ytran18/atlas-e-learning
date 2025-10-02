"use client";

import { initMixpanel } from "@/libs/mixpanel/mixpanel-client";
import { useEffect } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initMixpanel();
    }, []);

    return <>{children}</>;
}
