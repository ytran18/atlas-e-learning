"use client";

import {
    JSONValue,
    useFeatureIsOn,
    useFeatureValue,
    useGrowthBook,
} from "@growthbook/growthbook-react";

/**
 * Hook to check if a feature flag is enabled with ready state
 * @param featureKey - The feature flag key from GrowthBook
 * @returns object with isReady and value
 * @example
 * const { isReady, value: isEnabled } = useFeatureFlag("new-dashboard");
 * if (!isReady) return <Loading />;
 * if (isEnabled) return <NewDashboard />;
 */
export const useFeatureFlag = (featureKey: string) => {
    const gb = useGrowthBook();
    const value = useFeatureIsOn(featureKey);

    return {
        isReady: gb?.ready ?? false,
        value,
    };
};

/**
 * Hook to check if a feature flag is enabled (simple boolean)
 * Note: May return default value during initial load
 * @param featureKey - The feature flag key from GrowthBook
 * @returns boolean - true if feature is on, false otherwise
 * @example
 * const isEnabled = useFeatureFlagSimple("new-dashboard");
 */
export const useFeatureFlagSimple = (featureKey: string): boolean => {
    return useFeatureIsOn(featureKey);
};

/**
 * Hook to get the value of a feature flag
 * @param featureKey - The feature flag key from GrowthBook
 * @param defaultValue - Default value if feature is not found
 * @returns T - The feature value or default value
 * @example
 * const maxUploadSize = useFeatureFlagValue<number>("max-upload-size", 10);
 * const theme = useFeatureFlagValue<string>("theme", "light");
 */
export const useFeatureFlagValue = <T extends JSONValue>(
    featureKey: string,
    defaultValue: T
): T => {
    return useFeatureValue(featureKey, defaultValue) as T;
};
