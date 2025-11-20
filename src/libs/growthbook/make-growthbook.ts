import { FeatureApiResponse } from "@growthbook/growthbook";
import { GrowthBook } from "@growthbook/growthbook-react";

export function makeGrowthBook(payload?: FeatureApiResponse): GrowthBook {
    const gb = new GrowthBook({
        apiHost: "https://cdn.growthbook.io",
        clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_ID,
        // Enable easier debugging during development
        // Update the instance in realtime as features change in GrowthBook
        subscribeToChanges: true,
        enableDevMode: true,
    });

    if (payload) {
        gb.initSync({ payload, streaming: true });
    }

    return gb;
}
