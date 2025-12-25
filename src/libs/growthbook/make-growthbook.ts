"use client";

import { FeatureApiResponse } from "@growthbook/growthbook";
import { GrowthBook } from "@growthbook/growthbook-react";

export function makeGrowthBook(payload?: FeatureApiResponse): GrowthBook {
    const isDev = process.env.NODE_ENV === "development";

    const gb = new GrowthBook({
        apiHost: "https://cdn.growthbook.io",
        clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_ID,
        // Only subscribe to changes in development
        subscribeToChanges: isDev,
        enableDevMode: isDev,
    });

    if (payload) {
        gb.initSync({ payload, streaming: true });
    }

    return gb;
}
