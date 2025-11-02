import { GrowthBook } from "@growthbook/growthbook";

export const getGrowthBookPayload = async () => {
    const gb = new GrowthBook({
        apiHost: "https://cdn.growthbook.io",
        clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_ID,
        // Enable easier debugging during development
        // Update the instance in realtime as features change in GrowthBook
        subscribeToChanges: true,
        enableDevMode: true,
    });

    await gb.init();

    const payload = gb.getDecryptedPayload();

    gb.destroy();

    return payload;
};
